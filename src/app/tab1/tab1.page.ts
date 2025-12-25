import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DogsService, Dog } from './dogs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CommonModule, IonicModule ],
})
export class Tab1Page implements OnInit {
  dogs: Dog[] = [];
  selectedDogs: Dog[] = [];
  constructor(
    private dogsService: DogsService
  ) {}

  async ngOnInit() {
    this.dogsService.getAllDogs().subscribe(async (allDogs) => {
      const selected = await this.dogsService.getSelectedDogs();
      this.dogs = allDogs.filter(dog => selected.some(sel => sel.box === dog.box && sel.imie === dog.imie));
    });
  }

  onDogClick(dog: Dog) {
    this.dogsService.sendDogClick(dog).subscribe({
      next: (res) => console.log('Dog click response', res),
      error: (err) => console.error('Dog click error', err),
    });
  }
}
