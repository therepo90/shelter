import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Platform } from '@ionic/angular';
import { DogsService } from "./tab1/dogs.service";
import {firstValueFrom} from "rxjs";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [CommonModule, IonApp, IonRouterOutlet],
})
export class AppComponent {
  public initialized: boolean = false;

  private platform = inject(Platform);
  private dogsService = inject(DogsService);

  constructor() {
    this.platform.ready().then(() => {
      this.checkForUpdate();
    });
  }

  async checkForUpdate() {
    try {
      const {version} = await firstValueFrom(this.dogsService.getCfg());
      const localVersion = await this.dogsService.getVersion();
      if (version && localVersion && version !== localVersion) {
        const bundleInfo = await CapacitorUpdater.download({ url: 'https://therepo90.github.io/shelter/www.zip', version });
        await CapacitorUpdater.set({ id: bundleInfo.id });
        await this.dogsService.setVersion(version);
        window.location.reload();
      } else if (version && !localVersion) {
        // First run or no version stored, just save the version
        await this.dogsService.setVersion(version);
      }
      this.initialized = true;
    } catch (e) {
      // ignore update errors
      alert('Update check error: ' + e);
    }
  }
}
