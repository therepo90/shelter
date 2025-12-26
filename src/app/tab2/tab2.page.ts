import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {DogsService, Dog, Box, DogSimple} from '../tab1/dogs.service';
import {IonicModule} from "@ionic/angular";
import {addIcons} from "ionicons";
import { close } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon, IonItem, IonLabel, IonList,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonLabel, IonHeader, IonToolbar, IonText, IonButton, IonIcon, IonTitle, IonContent, IonSearchbar, IonList, IonItem]
})
export class Tab2Page implements OnInit {
  dogs: DogSimple[] = [];
  filteredDogs: DogSimple[] = [];
  searchTerm: string = '';
  selectedBoxes: Box[] = [];
  selectedDogs: DogSimple[] = [];
  private dogsService = inject(DogsService);

  constructor() {
    addIcons({close});
  }

  async ngOnInit() {
    this.dogsService.getAllDogs().subscribe(dogs => {
      this.dogs = dogs;
      this.filteredDogs = dogs;
    });
    try {
      const selectedBoxes = await this.dogsService.getSelectedBoxes();
      const allDogs = await this.dogsService.getAllDogs().toPromise();
      this.selectedDogs = allDogs!.filter(dog =>
        selectedBoxes.some(sel => sel.box === dog.box)
      );
      this.selectedBoxes = selectedBoxes;
    } catch (err) {
      console.warn('Preferences not ready or error occurred:', err);
      this.selectedDogs = [];
    }
  }

  filterDogs() {//
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
