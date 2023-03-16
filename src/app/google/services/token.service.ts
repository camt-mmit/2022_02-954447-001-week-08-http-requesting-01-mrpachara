import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  debounceTime,
  defer,
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
  AuthorizationResponseError,
  Configuration as GoogleConfiguration,
  ConfigurationToken as GoogleConfigurationToken,
  KeyValueStorage,
  KeyValueStorageToken,
  SecurityTokenNotFound,
  StateData,
  TokenData,
} from '../models';
import { arrayBufferToBase64, randomString, sha256 } from '../utils';

type AvailableTokenResult =
  | {
      type: 'none';
    }
  | {
      type: 'available';
      tokenData: TokenData;
    }
  | {
      type: 'refresh';
      refreshToken: string;
    };

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
  readonly tokenReady$ = this.tokenReadySubject.asObservable().pipe(
    // NOTE: To prevent NG0100: Expression has changed after it was checked.
    //       @see {@link https://angular.io/errors/NG0100}
    debounceTime(100),
    distinctUntilChanged(),
  );

  private readonly storeTokenDataPipe = pipe(
    switchMap((tokenData: TokenData) => from(this.storeTokenData(tokenData))),
  );

  constructor(
    @Inject(GoogleConfigurationToken)
    private readonly configuration: GoogleConfiguration,
    @Inject(KeyValueStorageToken)
    private readonly storage: KeyValueStorage,
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {
    this.getAvailableToken().then((result) => {
      // NOTE: To prevent race condition
      if (this.tokenReadySubject.value === null) {
        this.tokenReadySubject.next(result.type !== 'none');
      }
    });
  }

  private async loadStateData(
    securityToken: string,
  ): Promise<StateData | null> {
    const currentTime = Date.now();

    for (const key of await this.storage.loadKeys()) {
      if (key.startsWith(stateKeyPrefix)) {
        const storedStateData = await this.storage.loadData<StateData>(key);

        if ((storedStateData?.expiredAt ?? 0) <= currentTime) {
          this.storage.removeData(key);
        }
      }
    }

    return this.storage.loadData(`${stateKeyPrefix}${securityToken}`);
  }

  private async storeStateData(
    securityToken: string,
    stateData: StateData,
  ): Promise<StateData> {
    const currentTime = Date.now();
    const storedStateData = { ...stateData };

    if (storedStateData.expiredAt === undefined) {
      storedStateData.expiredAt = currentTime + stateTTL;
    }

    await this.storage.storeData(
      `${stateKeyPrefix}${securityToken}`,
      storedStateData,
    );
    return storedStateData;
  }

  private async removeStateData(
    securityToken: string,
  ): Promise<StateData | null> {
    const existingStateData = await this.loadStateData(securityToken);
    await this.storage.removeData(`${stateKeyPrefix}${securityToken}`);
    return existingStateData;
  }

  private async loadTokenData(): Promise<TokenData | null> {
    const existingTokenData = await this.storage.loadData<TokenData>(
      tokenKeyName,
    );

    return existingTokenData;
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

    await this.storage.storeData(tokenKeyName, storedTokenData);
    this.tokenReadySubject.next(true);
    return storedTokenData;
  }

  private async removeTokenData(): Promise<void> {
    await this.storage.removeData(tokenKeyName);
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
    return defer(() => from(this.removeStateData(securityToken))).pipe(
      switchMap((stateData) => {
        if (errorMessage) {
          return throwError(() => new AuthorizationResponseError(errorMessage));
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

    return defer(() => from(sha256(verifierCode))).pipe(
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

  private async getAvailableToken(): Promise<AvailableTokenResult> {
    const tokenData = await this.loadTokenData();
    const currentTime = Date.now();

    if (tokenData) {
      if ((tokenData.expiredAt ?? 0) > currentTime) {
        return {
          type: 'available',
          tokenData: tokenData,
        };
      }

      if (tokenData.refresh_token !== undefined) {
        return {
          type: 'refresh',
          refreshToken: tokenData.refresh_token,
        };
      }
    }

    return { type: 'none' };
  }

  private tryGetTokenData(): Observable<TokenData | null> {
    return defer(() => from(this.getAvailableToken())).pipe(
      switchMap((result) => {
        if (result.type === 'available') {
          return of(result.tokenData);
        }

        if (result.type === 'refresh') {
          return this.refreshTokenData(result.refreshToken);
        }

        return of(null);
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
