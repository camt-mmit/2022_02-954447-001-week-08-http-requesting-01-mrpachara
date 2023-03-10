import { InjectionToken } from '@angular/core';

export type Configuration = {
  client_id: string;
  client_secret: string;
  scopes: string[];
  redirect_uri: string;
};

export const ConfigurationToken = new InjectionToken<Configuration>(
  'Google configuration',
);

export type TokenData = {
  access_token: string;
  expires_in: number; // seconds
  refresh_token?: string;
  token_type: string;
  scope: string;
  expiredAt?: number;
};

export type StateData = {
  expiredAt?: number;
  verifierCode: string;
  redirectUrl: string;
};

export type GetAllParams = {
  [key: string]: string | number | boolean;
};

export class AccessTokenNotFound extends Error {
  override stack = new Error().stack;
  override name = this.constructor.name;

  constructor(message = 'Access Token not Found!!!', options?: ErrorOptions) {
    super(message, options);
  }
}

export class SecurityTokenNotFound extends Error {
  override stack = new Error().stack;
  override name = this.constructor.name;

  constructor(securityToken: string, options?: ErrorOptions) {
    super(`Security token ${securityToken} is not found or expired!!`, options);
  }
}
