import { Component, OnInit, inject } from '@angular/core';
import { ViewWillEnter, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { DogsService, Dog } from './dogs.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonText,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol, IonSpinner, IonRefresher, IonRefresherContent
} from "@ionic/angular/standalone";
import { sortDogsByBox } from '../utils/sort-dogs.util';
import { ConfirmWalkModalComponent } from '../modals/confirm-walk-modal/confirm-walk-modal.component';
import {environment} from "../../environments/environment";
import {map} from "rxjs";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonText, IonButton, IonIcon, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonSpinner, IonRefresher, IonRefresherContent],
})
export class Tab1Page implements OnInit, ViewWillEnter {
  dogs: Dog[] = [];
  selectedDogs: Dog[] = [];
  isLoading = false;
  loadError: string | null = null;
  markError: string | null = null;
  private dogsService = inject(DogsService);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);
  mock = environment.mock;
  live = undefined;

  constructor() {}

  async ngOnInit() {
    await this.loadDogs();
    this.isLive().subscribe((live)=>{
      this.live = live;
  });
  }

  async ionViewWillEnter() {
    await this.loadDogs();
  }

  private async loadDogs() {
    this.isLoading = true;
    this.loadError = null;
    try {
      this.dogsService.getAllDogs().subscribe({
        next: async (allDogs) => {
          const selected = await this.dogsService.getSelectedBoxes();
          this.dogs = sortDogsByBox(
            allDogs.filter(dog => selected.some(sel => sel.box === dog.box))
          );
          this.isLoading = false;
        },
        error: () => {
          this.loadError = 'Błąd wczytywania piesków';
          this.isLoading = false;
        }
      });
    } catch {
      this.loadError = 'Błąd wczytywania piesków';
      this.isLoading = false;
    }
  }

  async onDogClick(dog: Dog) {
    const modal = await this.modalCtrl.create({
      component: ConfirmWalkModalComponent,
      componentProps: { dog },
      showBackdrop: true,
    });
    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role !== 'confirm') return;
    this.markError = null;
    const loading = await this.loadingCtrl.create({
      message: `Zapisuję spacer dla: ${dog.name}`
    });
    await loading.present();
    this.dogsService.sendDogClick(dog).subscribe({
      next: async () => {
        await loading.dismiss();
        dog.status = 'X';
        const toast = await this.toastCtrl.create({
          message: `Spacer zapisany dla: ${dog.name}`,
          duration: 1200,
          color: 'success'
        });
        toast.present();
      },
      error: async () => {
        await loading.dismiss();
        this.markError = `Błąd zapisywania spaceru dla: ${dog.name}`;
        const toast = await this.toastCtrl.create({
          message: `Błąd zapisywania spaceru dla: ${dog.name}`,
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async doRefresh(event: any) {
    await this.loadDogs();
    event.target.complete();
  }

  isLive() {
    return this.dogsService.getCfg().pipe(map(cfg => cfg.live));
  }
}
