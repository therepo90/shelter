import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DogsService, Dog } from '../tab1/dogs.service';
import {IonicModule} from "@ionic/angular";
import {addIcons} from "ionicons";
import { close } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class Tab2Page implements OnInit {
  dogs: Dog[] = [];
  filteredDogs: Dog[] = [];
  searchTerm: string = '';
  selectedDogs: Dog[] = [];
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
      const { value } = await Preferences.get({ key: 'selectedDogs' });
      if (value) {
        this.selectedDogs = JSON.parse(value);
      }
    } catch (err) {
      console.warn('Preferences not ready or error occurred:', err);
      this.selectedDogs = [];
    }
  }

  filterDogs() {
    const term = this.searchTerm.toLowerCase();
    this.filteredDogs = this.dogs.filter(dog =>
      (`${dog.box}-${dog.imie}`.toLowerCase().includes(term))
    );
  }

  async selectDog(dog: Dog) {
    if (!this.selectedDogs.some(d => d.box === dog.box && d.imie === dog.imie)) {
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
