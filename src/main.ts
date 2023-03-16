import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './routes';
import {
  ConfigurationToken as GoogleConfigurationToken,
  KeyValueStorageToken,
} from './app/google/models';
import { googleConfiguration } from './configuration';
import { LocalStorageService } from './app/google/services/local-storage.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: KeyValueStorageToken,
      useClass: LocalStorageService,
    },
    {
      provide: GoogleConfigurationToken,
      useValue: googleConfiguration,
    },
  ],
}).catch((err) => console.error(err));
