import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen'
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
      console.log('Checking for updates...');
      // fetch https://raw.githubusercontent.com/therepo90/shelter/refs/heads/main/.git-version
      // powinno bycf w /releases ta gitversion ale dobra. Potem sie to zmieni - backward comp powinno byc.
      const response = await fetch('https://raw.githubusercontent.com/therepo90/shelter/refs/heads/main/.git-version');
      if (!response.ok) {
        throw new Error('Failed to fetch version info');
      }
      const version = (await response.text()).trim();
      //const {version} = await firstValueFrom(this.dogsService.getCfg());
      const localVersion = await this.dogsService.getVersion();
      console.log({version, localVersion});
      if (version && localVersion && version !== localVersion) {
        console.log(`Updating from version ${localVersion} to ${version}`);
        alert(`Updating app to version ${version}. Please wait...`);
        await SplashScreen.show();
        const bundleInfo = await CapacitorUpdater.download({ url: 'https://raw.githubusercontent.com/therepo90/shelter/refs/heads/main/releases/www.zip', version });
        await CapacitorUpdater.set({ id: bundleInfo.id });
        await this.dogsService.setVersion(version);
        alert('Reloading app');
        window.location.reload();
      } else if (version && !localVersion) {
        // First run or no version stored, just save the version
        console.log(`Setting initial version to ${version}`);
        await this.dogsService.setVersion(version);
      }else{
        console.log(`App is up to date with version ${localVersion}`);
      }
      this.initialized = true;
    } catch (e) {
      // ignore update errors
      alert('Update check error: ' + e);
    }finally{
      await SplashScreen.hide()
    }
  }
}
