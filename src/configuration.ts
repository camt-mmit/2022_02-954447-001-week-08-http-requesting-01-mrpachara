import { isDevMode } from '@angular/core';
import { Configuration as GoogleConfiguration } from './app/google/models';

export const googleConfiguration: GoogleConfiguration = {
  client_id:
    '209689905225-dj1bo29m0c7or5926cv4bb1nu5aru0cv.apps.googleusercontent.com',
  client_secret: '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',
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/contacts',
  ],
  redirect_uri: isDevMode()
    ? 'http://localhost:4200/google/authorization'
    : 'https://camt-mmit.github.io/2022_02-954447-001-week-08-http-requesting-01-mrpachara/google/authorization',
};
