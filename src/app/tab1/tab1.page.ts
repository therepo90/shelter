import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ViewWillEnter, LoadingController, ToastController, ModalController, Platform } from '@ionic/angular';
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
import {map} from "rxjs";

export function calcNewStatus(dog: Dog, dogName: string) {
  console.log({ dogFull: dog.name, dogName, status: dog.status });
  const allDogsInBox = dog.name.split(',').map(n => n.trim().toLowerCase()).filter(n => n.length > 0);
  console.log({allDogsInBox})

    // merge with current status
    const currentStatus = dog.status ? dog.status.toUpperCase().split('') : [];
    const newInitial = dogName.toUpperCase().slice(0, 1);
    if (!currentStatus.includes(newInitial)) {
      currentStatus.push(newInitial);
    }
    console.log({currentStatus});
    // if status has all the initials of the dogs, return 'X'
    const allInitials = allDogsInBox.map(n => n.slice(0, 1).toUpperCase());
    const hasAllInitials = allInitials.every(initial => currentStatus.includes(initial));
    if (hasAllInitials) {
      return 'X';
    }else {
      return currentStatus.join('');
    }
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonText, IonButton, IonIcon, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonSpinner, IonRefresher, IonRefresherContent],
})
export class Tab1Page implements OnInit, ViewWillEnter, OnDestroy {
  dogs: Dog[] = [];
  selectedDogs: Dog[] = [];
  isLoading = false;
  loadError: string | null = null;
  markError: string | null = null;
  private dogsService = inject(DogsService);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);
  live?:boolean = undefined;
  private resumeSubscription: any;
  private platform = inject(Platform);

  async ngOnInit() {
    await this.loadDogs();
    this.isLive().subscribe((live)=>{
      this.live = live;
    });
    // Listen for app resume (mobile)
    this.platform.ready().then(() => {
      this.resumeSubscription = this.platform.resume.subscribe(() => {
        console.log('App resumed');
        this.loadDogs();
      });
    });
    // Listen for visibility change (web)
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  ngOnDestroy() {
    if (this.resumeSubscription) {
      this.resumeSubscription.unsubscribe();
    }
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  onVisibilityChange = () => {
    console.log('Visibility changed:', document.visibilityState);
    if (document.visibilityState === 'visible') {
      this.loadDogs();
    }
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

  async onDogClick(dog: Dog, dogName: string) { // dog zawiera wiele psow
    const modal = await this.modalCtrl.create({
      component: ConfirmWalkModalComponent,
      componentProps: { dog, dogName },
      showBackdrop: true,
    });
    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role !== 'confirm') return;
    this.markError = null;
    const loading = await this.loadingCtrl.create({
      message: `Zapisuję spacer dla: ${dogName}`
    });
    await loading.present();
    this.dogsService.sendDogClick(dog, dogName).subscribe({
      next: async () => {
        await loading.dismiss();
        const status = calcNewStatus(dog, dogName);
        dog.status = status;
        //set recent present for this day also. DD/MM/YYYY. Its last
        if(dog.recentPresence && dog.recentPresence.length) {
          dog.recentPresence[dog.recentPresence.length - 1].value = dog.status;
        }

        const toast = await this.toastCtrl.create({
          message: `Spacer zapisany dla: ${dogName}`,
          duration: 1200,
          color: 'success'
        });
        toast.present();
      },
      error: async () => {
        await loading.dismiss();
        this.markError = `Błąd zapisywania spaceru dla: ${dogName}`;
        const toast = await this.toastCtrl.create({
          message: `Błąd zapisywania spaceru dla: ${dogName}`,
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

  protected getShortDate(dateMMDDYYYY: string) {
    return dateMMDDYYYY.split('/').slice(0, 2).join('/');
  }

  splitDogNames(name: string): string[] {
    return name.split(',').map(n => n.trim()).filter(n => n.length > 0);
  }
}
