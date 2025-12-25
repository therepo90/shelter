import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

export interface Dog {
  box: string;
  imie: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class DogsService {
  private dogs: Dog[] = [
    { box: 'A1', imie: 'Reksio', status: 'x' },
    { box: 'B2', imie: 'Azor', status: '' },
    { box: 'C3', imie: 'Burek', status: 'X' },
    { box: 'D4', imie: 'Max', status: '' },
    { box: 'E5', imie: 'Fafik', status: 'x' },
    { box: 'F6', imie: 'Luna', status: '' },
    { box: 'G7', imie: 'Milo', status: 'X' },
    { box: 'H8', imie: 'Sara', status: '' },
  ];

  constructor(private http: HttpClient, private platform: Platform) {}

  getDogs(): Observable<Dog[]> {
    return of(this.dogs);
  }

  sendDogClick(dog: Dog): Observable<any> {
    const apiUrl = environment.apiUrl;
    return this.http.post(apiUrl, { box: dog.box, imie: dog.imie, status: dog.status });
    /*if (this.platform.is('hybrid')) {
      // Tu można użyć natywnego pluginu HTTP, np. @awesome-cordova-plugins/http
      // return from(Promise.resolve({mock: 'native'}));
      console.log('Native HTTP call (mock):', dog);
      return of({mock: 'native'});
    } else {
      // WebView: można używać Angular HttpClient
      return this.http.post(apiUrl, { box: dog.box, imie: dog.imie, status: dog.status });
    }*/
  }
}
