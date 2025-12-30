import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon, IonItem,
  IonLabel, IonList, IonSearchbar, IonSpinner,
  IonText,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {DogsService} from "../tab1/dogs.service";

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonLabel, IonHeader, IonToolbar, IonText, IonButton, IonIcon, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonSpinner]
})
export class Tab3Page implements OnInit {
  version: string | null = null;
  constructor(private dogsService:DogsService) {
  }
  ngOnInit() {
    try {
      this.dogsService.getVersion().then(v => {
        this.version = v;
      });
    }catch (e) {
      console.error('Error fetching version:', e);
      alert('Error fetching version:');
    }
  }

}

