import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DogsService, Dog } from '../tab1/dogs.service';
import {IonicModule} from "@ionic/angular";
import {addIcons} from "ionicons";
import { close } from 'ionicons/icons';

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

  ngOnInit() {
    this.dogsService.getAllDogs().subscribe(dogs => {
      this.dogs = dogs;
      this.filteredDogs = dogs;
    });
  }

  constructor() {
    addIcons({close})
  }
  filterDogs() {
    const term = this.searchTerm.toLowerCase();
    this.filteredDogs = this.dogs.filter(dog =>
      (`${dog.box}-${dog.imie}`.toLowerCase().includes(term))
    );
  }

  selectDog(dog: Dog) {
    if (!this.selectedDogs.some(d => d.box === dog.box && d.imie === dog.imie)) {
      this.selectedDogs.push(dog);
    }
    this.searchTerm = '';
    this.filteredDogs = [];
  }

  removeDog(index: number) {
    this.selectedDogs.splice(index, 1);
  }

  compareDogs(dog1: Dog, dog2: Dog): boolean {
    return dog1 && dog2 && dog1.box === dog2.box && dog1.imie === dog2.imie;
  }
}
