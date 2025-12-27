import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonHeader } from '@ionic/angular/standalone';
import { IonToolbar } from '@ionic/angular/standalone';
import { IonTitle } from '@ionic/angular/standalone';
import { IonContent } from '@ionic/angular/standalone';
import { IonList } from '@ionic/angular/standalone';
import { IonItem } from '@ionic/angular/standalone';
import { IonLabel } from '@ionic/angular/standalone';
import { IonInput } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-user-auth-modal',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Autoryzacja</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Użytkownik</ion-label>
          <ion-input [(ngModel)]="username" type="text"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Hasło</ion-label>
          <ion-input [(ngModel)]="password" type="password"></ion-input>
        </ion-item>
      </ion-list>
      <ion-button expand="block" (click)="submit()" type="submit">Zatwierdź</ion-button>
    </ion-content>
  `
})
export class UserAuthModalComponent {
  username = '';
  password = '';

  private modalCtrl = inject(ModalController);

  submit() {
    this.modalCtrl.dismiss({ username: this.username, password: this.password });
  }
}
