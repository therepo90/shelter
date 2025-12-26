import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {DogsService, Box, DogSimple} from '../tab1/dogs.service';
import {addIcons} from "ionicons";
import { close } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import { ViewWillEnter } from '@ionic/angular';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon, IonItem, IonLabel, IonList,
  IonSearchbar, IonSpinner,
  IonText,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import { sortDogsByBox } from '../utils/sort-dogs.util';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonLabel, IonHeader, IonToolbar, IonText, IonButton, IonIcon, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonSpinner]
})
export class Tab2Page implements OnInit, ViewWillEnter {
  dogs: DogSimple[] = [];
  filteredDogs: DogSimple[] = [];
  searchTerm: string = '';
  selectedBoxes: Box[] = [];
  selectedDogs: DogSimple[] = [];
  isLoading = true;
  loadError: string | null = null;
  private dogsService = inject(DogsService);

  constructor() {
    addIcons({close});
  }

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
        next: (dogs) => {
          this.dogs = sortDogsByBox(dogs);
          this.filteredDogs = sortDogsByBox(dogs);
          this.isLoading = false;
        },
        error: () => {
          this.loadError = 'Błąd wczytywania piesków';
          this.isLoading = false;
        }
      });
      const selectedBoxes = await this.dogsService.getSelectedBoxes();
      const allDogs = await this.dogsService.getAllDogs().toPromise();
      this.selectedDogs = sortDogsByBox(
        allDogs!.filter(dog => selectedBoxes.some(sel => sel.box === dog.box))
      );
      this.selectedBoxes = selectedBoxes;
    } catch (err) {
      this.loadError = 'Błąd wczytywania piesków';
      this.selectedDogs = [];
      this.isLoading = false;
    }
  }

  filterDogs() {
    if (this.isLoading) return;
    const term = this.searchTerm.toLowerCase();
    this.filteredDogs = this.dogs.filter(dog =>
      (`${dog.box}-${dog.name}`.toLowerCase().includes(term))
    );
  }

  async selectDog(dog: DogSimple) {
    if (!this.selectedDogs.some(d => d.box === dog.box)) {
      this.selectedDogs.push(dog);
      console.log('Saving Selected Dogs:', this.selectedDogs);
      await Preferences.set({ key: 'selectedDogs', value: JSON.stringify(this.selectedDogs) });
    }
    this.searchTerm = '';
    this.filteredDogs = [];
  }

  async removeDog(index: number) {
    this.selectedDogs.splice(index, 1);
    await Preferences.set({ key: 'selectedDogs', value: JSON.stringify(this.selectedDogs) });
  }
}
