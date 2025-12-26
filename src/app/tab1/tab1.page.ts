import { Component, OnInit } from '@angular/core';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { DogsService, Dog } from './dogs.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon, IonItem, IonList,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonText, IonButton, IonIcon, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonGrid, IonRow, IonCol, IonContent],
})
export class Tab1Page implements OnInit, ViewWillEnter {
  dogs: Dog[] = [];
  selectedDogs: Dog[] = [];
  constructor(
    private dogsService: DogsService
  ) {}

  async ngOnInit() {
    await this.loadDogs();
  }

  async ionViewWillEnter() {
    await this.loadDogs();
  }

  private async loadDogs() {
    this.dogsService.getAllDogs().subscribe(async (allDogs) => {
      const selected = await this.dogsService.getSelectedBoxes();
      this.dogs = allDogs.filter(dog => selected.some(sel => sel.box === dog.box));
    });
  }

  onDogClick(dog: Dog) {
    this.dogsService.sendDogClick(dog).subscribe({
      next: (res) => console.log('Dog click response', res),
      error: (err) => console.error('Dog click error', err),
    });
  }
}
