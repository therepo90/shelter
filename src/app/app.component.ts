import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Platform } from '@ionic/angular';
import {DogSimple, DogsService} from "./tab1/dogs.service";
import {firstValueFrom} from "rxjs";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [CommonModule, IonApp, IonRouterOutlet],
})
export class AppComponent {
  public initialized: boolean = false;

  constructor(private platform: Platform, private dogsService:DogsService) {
    this.platform.ready().then(() => {
      this.checkForUpdate();
    });
  }

  async checkForUpdate() {
    try {
      const {version} = await firstValueFrom(this.dogsService.getCfg());
      const localVersion = ''; // @TODO save in prefs
      if (version && localVersion && version !== localVersion) {
        const bundleInfo = await CapacitorUpdater.download({ url: 'https://therepo90.github.io/shelter/www.zip', version });
        await CapacitorUpdater.set({ id: bundleInfo.id });
        window.location.reload();
      }
      this.initialized = true;
    } catch (e) {
      // ignore update errors
      alert('Update check error: ' + e);
    }
  }
}
