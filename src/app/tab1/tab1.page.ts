import { Component, OnInit, inject } from '@angular/core';
import { ViewWillEnter, LoadingController, ToastController } from '@ionic/angular';
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

  constructor() {}

  async ngOnInit() {
    await this.loadDogs();
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
          this.loadError = 'Błąd ładowania piesków';
          this.isLoading = false;
        }
      });
    } catch {
      this.loadError = 'Błąd ładowania piesków';
      this.isLoading = false;
    }
  }

  async onDogClick(dog: Dog) {
    console.log('Kliknięto pieska:', dog);
    this.markError = null;
    const loading = await this.loadingCtrl.create({
      message: 'Zapisuję...'
    });
    await loading.present();
    this.dogsService.sendDogClick(dog).subscribe({
      next: async () => {
        await loading.dismiss();
        dog.status = 'X'; // Ustaw status na X po sukcesie
        const toast = await this.toastCtrl.create({
          message: 'Spacer zapisany!',
          duration: 1200,
          color: 'success'
        });
        toast.present();
      },
      error: async () => {
        await loading.dismiss();
        this.markError = 'Błąd zapisywania';
        const toast = await this.toastCtrl.create({
          message: 'Błąd zapisywania',
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
}
