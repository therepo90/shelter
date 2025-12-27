import { Component } from '@angular/core';
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

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonLabel, IonHeader, IonToolbar, IonText, IonButton, IonIcon, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonSpinner]
})
export class Tab3Page {}

