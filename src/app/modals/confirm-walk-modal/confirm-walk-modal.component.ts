import { Component, Input, inject } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { Dog } from '../../tab1/dogs.service';

@Component({
  selector: 'app-confirm-walk-modal',
  template: `
    <div class="confirm-modal-wrapper">
      <div class="confirm-modal-dogname">{{ dog?.name }}</div>
      <ion-button expand="block" color="success" class="big-confirm-btn" (click)="confirm()">Potwierdź</ion-button>
      <ion-button expand="block" color="danger" class="big-cancel-btn" (click)="cancel()">Anuluj</ion-button>
    </div>
  `,
  styleUrls: ['./confirm-walk-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton]
})
export class ConfirmWalkModalComponent {
  @Input() dog!: Dog;
  private modalCtrl = inject(ModalController);
  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  confirm() {
    this.modalCtrl.dismiss(null, 'confirm');
  }
}
