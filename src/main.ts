import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { defineCustomElement as defineLoading } from '@ionic/core/components/ion-loading';
import { defineCustomElement as defineToast } from '@ionic/core/components/ion-toast';
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {IonicModule} from "@ionic/angular";
import {importProvidersFrom} from "@angular/core";

// CHANGE: Call the element loader before the `bootstrapModule` call
defineCustomElements(window);
defineLoading();
defineToast();

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicModule.forRoot({}))
    //loading ctrl & toast

  ],
});
