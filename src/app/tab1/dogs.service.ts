import {Injectable} from '@angular/core';
import {catchError, from, Observable, of, switchMap} from 'rxjs';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {environment} from 'src/environments/environment';
import {Preferences} from '@capacitor/preferences';
import {AuthService} from "./auth.service";

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

@Injectable({providedIn: 'root'})
export class DogsService {

  private allDogs: Dog[] = [
    {box: 'A1', name: 'Reksio/Burek/Lunek/Żaba', status: 'x'},
    {box: 'B2', name: 'Azor', status: ''},
    {box: 'C3', name: 'Johny', status: 'X'},
    {box: 'D4', name: 'Max', status: ''},
    {box: 'E5', name: 'Fafik', status: 'x'},
    {box: 'F6', name: 'Luna', status: ''},
    {box: 'G7', name: 'Milo', status: 'X'},
    {box: 'H8', name: 'Sara', status: ''},
  ];


  constructor(private http: HttpClient, private platform: Platform, private authService: AuthService) {
  }

  // Return allDogs without the 'status' property if mock, otherwise fetch from backend
  getAllDogs(): Observable<Dog[]> {
    const apiUrl = environment.apiUrl + '/dogs';
    return from(this.authService.getAuthHeader()).pipe(switchMap((headers) => {
      return this.http.get<Dog[]>(apiUrl, {headers});
    }), this.handleError());
  }

  private handleError() {
    return catchError((error: any) => {
      console.error('Error:', error);
      return from(this.authService.handleError(error));
    });
  }

  getCfg(): Observable<any> {
    const apiUrl = environment.apiUrl + '/dogs/cfg';
    return from(this.authService.getAuthHeader()).pipe(switchMap((headers) => {
      return this.http.get<{ live: boolean }>(apiUrl, {
        headers
      })
    }), this.handleError());
  }

  sendDogClick(dog: Dog): Observable<any> {
    if (environment.mock) {
      console.log('Mock sendDogClick:', dog);
      return of({success: true});
    }
    const apiUrl = `${environment.apiUrl}/dogs/${dog.box}/mark`;


    return from(this.authService.getAuthHeader()).pipe(switchMap((headers) => {
      return this.http.post(apiUrl, {box: dog.box, name: dog.name, status: dog.status}, {headers});
    }), this.handleError());
  }

  // --- Selected Dogs Persistence ---
  // Only persist the 'box' property for each selected dog
  async getSelectedBoxes(): Promise<Box[]> {
    const {value} = await Preferences.get({key: 'selectedDogs'});
    if (value) {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return [];
  }
}
