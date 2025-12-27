import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
// 1. IMPORT OBLIGATOIRE POUR HTTP
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // 2. ACTIVATION DU CLIENT HTTP (avec Fetch pour la performance)
    provideHttpClient(withFetch())
  ]
};
