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
  constructor(
    private dogsService: DogsService
  ) {}

  ngOnInit() {
    this.dogsService.getDogs().subscribe((dogs) => {
      this.dogs = dogs;
    });
  }

  onDogClick(dog: Dog) {
    this.dogsService.sendDogClick(dog).subscribe({
      next: (res) => console.log('Dog click response', res),
      error: (err) => console.error('Dog click error', err),
    });
  }
}
