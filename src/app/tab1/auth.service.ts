import { Injectable, inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { sha256 } from 'js-sha256';
import { ModalController } from '@ionic/angular';
import { UserAuthModalComponent } from './user-auth-modal.component';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private hash: string | null = null;

  private modalCtrl = inject(ModalController);

  constructor() {
    this.loadAuth();
  }

  private async loadAuth() {
    const { value } = await Preferences.get({ key: 'authData' });
    console.log('Loaded auth data:', value);
    if (value) {
      try {
        this.hash = value;
      } catch {}
    }
    return value;
  }

  private async saveAuth(user: string, password: string) {
    this.hash = sha256(user + password);
    await Preferences.set({ key: 'authData', value: this.hash });

  }

  async getAuthHeader(): Promise<{ Authorization: string }> {
    const hash = await this.loadAuth();
    return { Authorization: this.hash ? `${hash}` : '' };
  }

  async handleError(e: any): Promise<any> {
    if(e.status === 401 || e.status === 403) {
      return this.handleAuthError(e);
    }else{
      alert('Wystąpił błąd: ' + (e.message || e.statusText || 'Nieznany błąd'));
      throw e;
    }
  }
  async handleAuthError(e: any): Promise<any> {
    const modal = await this.modalCtrl.create({ component: UserAuthModalComponent });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && data.username && data.password) {
      await this.saveAuth(data.username, data.password);
      //restart
      window.location.reload();
    }
  }
}
