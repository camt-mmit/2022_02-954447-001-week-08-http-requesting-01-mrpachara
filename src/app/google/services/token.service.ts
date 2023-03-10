import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  from,
  map,
  Observable,
  of,
  pipe,
  share,
  switchMap,
  throwError,
} from 'rxjs';

import {
  AccessTokenNotFound,
  Configuration as GoogleConfiguration,
  ConfigurationToken as GoogleConfigurationToken,
  SecurityTokenNotFound,
  StateData,
  TokenData,
} from '../models';
import { arrayBufferToBase64, randomString, sha256 } from '../utils';

const tokenKeyName = 'google-token';
const stateKeyPrefix = 'google-state-';

const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
const tokenUrl = 'https://oauth2.googleapis.com/token';

const randomStringLength = 56;
const securityTokenLength = 16;

const stateTTL = 10 * 60 * 1_000; // milliseconds
const networkLatency = 2 * (5 * 1_000); // milliseconds

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly tokenReadySubject = new BehaviorSubject<boolean | null>(
    null,
  );
  readonly tokenReady$ = this.tokenReadySubject
    .asObservable()
    .pipe(debounceTime(100), distinctUntilChanged());

  private readonly storeTokenDataPipe = pipe(
    switchMap((tokenData: TokenData) => from(this.storeTokenData(tokenData))),
  );

  constructor(
    @Inject(GoogleConfigurationToken)
    private readonly configuration: GoogleConfiguration,
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {
    from(this.getAvailableTokenData()).subscribe(({ available, tokenData }) => {
      // NOTE: To prevent race condition
      if (this.tokenReadySubject.value === null) {
        this.tokenReadySubject.next(
          available || tokenData?.refresh_token !== undefined,
        );
      }
    });
  }

  private async loadData<T>(key: string): Promise<T | null> {
    return JSON.parse(localStorage.getItem(key) ?? 'null');
  }

  private async storeData<T>(key: string, value: T): Promise<void> {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  private async removeData(key: string): Promise<void> {
    return localStorage.removeItem(key);
  }

  private async loadKeys(): Promise<string[]> {
    const results: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      results.push(localStorage.key(i) ?? '');
    }

    return results;
  }

  private async loadStateData(
    securityToken: string,
  ): Promise<StateData | null> {
    const currentTime = Date.now();
    const keyName = `${stateKeyPrefix}${securityToken}`;

    for (const key of await this.loadKeys()) {
      if (key.startsWith(stateKeyPrefix)) {
        const storedStateData = await this.loadData<StateData>(key);

        if ((storedStateData?.expiredAt ?? 0) <= currentTime) {
          this.removeData(key);
        }
      }
    }

    return this.loadData(keyName);
  }

  private async storeStateData(
    securityToken: string,
    stateData: StateData,
  ): Promise<StateData> {
    const storedStateData: StateData = {
      ...stateData,
      expiredAt: Date.now() + stateTTL,
    };

    await this.storeData(`${stateKeyPrefix}${securityToken}`, storedStateData);
    return storedStateData;
  }

  private async removeStateData(
    securityToken: string,
  ): Promise<StateData | null> {
    const stateData = await this.loadStateData(securityToken);
    await this.removeData(`${stateKeyPrefix}${securityToken}`);
    return stateData;
  }

  private async loadTokenData(): Promise<TokenData | null> {
    const tokenData = await this.loadData<TokenData>(tokenKeyName);

    return tokenData;
  }

  private async storeTokenData(tokenData: TokenData): Promise<TokenData> {
    const currentTime = Date.now();
    const storedTokenData = { ...tokenData };
    const existingTokenData = await this.loadTokenData();

    /**
     * NOTE: Defferent from other OAuth services,
     * Google re-use the same refresh_token for requesting the new access_token
     * so keep it to the new token data.
     */
    if (!storedTokenData.refresh_token && existingTokenData?.refresh_token) {
      storedTokenData.refresh_token = existingTokenData.refresh_token;
    }

    if (storedTokenData.expiredAt === undefined) {
      storedTokenData.expiredAt =
        currentTime + storedTokenData.expires_in * 1_000 - networkLatency;
    }

    await this.storeData(tokenKeyName, storedTokenData);
    this.tokenReadySubject.next(true);
    return storedTokenData;
  }

  private async removeTokenData(): Promise<void> {
    await this.removeData(tokenKeyName);
    this.tokenReadySubject.next(false);
  }

  private refreshTokenData(refreshToken: string): Observable<TokenData> {
    return this.http
      .post<TokenData>(tokenUrl, {
        client_id: this.configuration.client_id,
        client_secret: this.configuration.client_secret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })
      .pipe(this.storeTokenDataPipe);
  }

  exchangeCodeForToken(
    code: string,
    securityToken: string,
    errorMessage?: string,
  ): Observable<StateData> {
    return from(this.removeStateData(securityToken)).pipe(
      switchMap((stateData) => {
        if (errorMessage) {
          return throwError(() => errorMessage);
        }

        return of(stateData);
      }),
      switchMap((stateData) => {
        if (stateData) {
          return this.http
            .post<TokenData>(tokenUrl, {
              client_id: this.configuration.client_id,
              client_secret: this.configuration.client_secret,
              code: code,
              code_verifier: stateData.verifierCode,
              grant_type: 'authorization_code',
              redirect_uri: this.configuration.redirect_uri,
            })
            .pipe(
              this.storeTokenDataPipe,
              map(() => stateData),
            );
        }

        return throwError(() => new SecurityTokenNotFound(securityToken));
      }),
    );
  }

  getAuthorizationLink(): Observable<URL> {
    const verifierCode = randomString(randomStringLength);

    return from(sha256(verifierCode)).pipe(
      map((sha256) => arrayBufferToBase64(sha256, true)),
      switchMap((challengeCode) => {
        const securityToken = randomString(securityTokenLength);

        return from(
          this.storeStateData(securityToken, {
            verifierCode: verifierCode,
            redirectUrl: this.router.url,
          }),
        ).pipe(
          map(() => ({
            challengeCode,
            securityToken,
          })),
        );
      }),
      map(({ challengeCode, securityToken }) => {
        const url = new URL(authUrl);

        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', this.configuration.client_id);
        url.searchParams.set('scope', this.configuration.scopes.join(' '));
        url.searchParams.set('redirect_uri', this.configuration.redirect_uri);
        url.searchParams.set('code_challenge', challengeCode);
        url.searchParams.set('code_challenge_method', 'S256');
        url.searchParams.set(
          'state',
          new URLSearchParams({
            security_token: securityToken,
          }).toString(),
        );

        /**
         * NOTE: The following 2 parameters, prompt and access_type,
         * are required for getting the refresh_token.
         */
        url.searchParams.append('prompt', 'consent');
        url.searchParams.append('access_type', 'offline');

        return url;
      }),
    );
  }

  private getAvailableTokenData(): Observable<{
    available: boolean;
    tokenData: TokenData | null;
  }> {
    return from(this.loadTokenData()).pipe(
      map((tokenData) => {
        const currentTime = Date.now();

        return {
          available: (tokenData?.expiredAt ?? 0) > currentTime,
          tokenData: tokenData,
        };
      }),
    );
  }

  private tryGetTokenData(): Observable<TokenData | null> {
    return from(this.getAvailableTokenData()).pipe(
      switchMap(({ available, tokenData }) => {
        if (!available && tokenData?.refresh_token === undefined) {
          return of(null);
        } else {
          return this.refreshTokenData(tokenData?.refresh_token ?? '');
        }
      }),
      share(),
    );
  }

  getAccessToken(): Observable<string | null> {
    return this.tryGetTokenData().pipe(
      map((tokenData) => tokenData?.access_token ?? null),
    );
  }

  getAuthorizationHeader(): Observable<string> {
    return this.tryGetTokenData().pipe(
      switchMap((tokenData) => {
        if (tokenData) {
          return of(`${tokenData.token_type} ${tokenData.access_token}`);
        }

        return throwError(() => new AccessTokenNotFound());
      }),
    );
  }

  async forceExpired(): Promise<void> {
    const tokenData = await this.loadTokenData();
    if (tokenData) {
      tokenData.expiredAt = 0;

      await this.storeTokenData(tokenData);
    }
  }

  async deleteToken(): Promise<void> {
    await this.removeTokenData();
  }
}
