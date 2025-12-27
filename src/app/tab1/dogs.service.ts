import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';

export interface DogSimple {
  box: string;
  name: string;
}
export interface Dog {
  box: string;
  name: string;
  status: string;
}

export interface Box {
  box: string;
}

@Injectable({ providedIn: 'root' })
export class DogsService {

  private allDogs: Dog[] = [
    { box: 'A1', name: 'Reksio/Burek/Lunek/Żaba', status: 'x' },
    { box: 'B2', name: 'Azor', status: '' },
    { box: 'C3', name: 'Johny', status: 'X' },
    { box: 'D4', name: 'Max', status: '' },
    { box: 'E5', name: 'Fafik', status: 'x' },
    { box: 'F6', name: 'Luna', status: '' },
    { box: 'G7', name: 'Milo', status: 'X' },
    { box: 'H8', name: 'Sara', status: '' },
  ];


  constructor(private http: HttpClient, private platform: Platform) {}

  // Return allDogs without the 'status' property if mock, otherwise fetch from backend
  getAllDogs(): Observable<Dog[]> {
    if (environment.mock) {
      return of(this.allDogs);
    } else {
      const apiUrl = environment.apiUrl + '/dogs';
      return this.http.get<Dog[]>(apiUrl);
    }
  }

  sendDogClick(dog: Dog): Observable<any> {
    if(environment.mock) {
      console.log('Mock sendDogClick:', dog);
      return of({ success: true });
    }
    const apiUrl = `${environment.apiUrl}/dogs/${dog.box}/mark`;
    return this.http.post(apiUrl, { box: dog.box, name: dog.name, status: dog.status });
    /*if (this.platform.is('hybrid')) {
      // Tu można użyć natywnego pluginu HTTP, np. @awesome-cordova-plugins/http
      // return from(Promise.resolve({mock: 'native'}));
      console.log('Native HTTP call (mock):', dog);
      return of({mock: 'native'});
    } else {
      // WebView: można używać Angular HttpClient
      return this.http.post(apiUrl, { box: dog.box, name: dog.name, status: dog.status });
    }*/
  }

  // --- Selected Dogs Persistence ---
  // Only persist the 'box' property for each selected dog
  async getSelectedBoxes(): Promise<Box[]> {
    const { value } = await Preferences.get({ key: 'selectedDogs' });
    if (value) {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return [];
  }


  async setSelectedDogs(dogs: any[]): Promise<void> {
    // Only save array of { box } objects
    const boxes = dogs.map((d: any) => ({ box: d.box }));
    await Preferences.set({ key: 'selectedDogs', value: JSON.stringify(boxes) });
  }
}
