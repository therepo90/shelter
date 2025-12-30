import {Injectable, inject} from '@angular/core';
import {catchError, from, Observable, of, switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {environment} from 'src/environments/environment';
import {Preferences} from '@capacitor/preferences';
import {AuthService} from "./auth.service";
import { APP_VERSION } from '../app-version';

export interface DogSimple {
  box: string;
  name: string;
}

export interface Dog { // to w sumie box obj
  box: string;
  name: string;
  status: string;
  recentPresence?: { date: string; value: string | null }[];
}

export interface Box {
  box: string;
}

@Injectable({providedIn: 'root'})
export class DogsService {

  private http = inject(HttpClient);
  private platform = inject(Platform);
  private authService = inject(AuthService);

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

  getCfg(): Observable<{ version: string; live: boolean }> {
    const apiUrl = environment.apiUrl + '/dogs/cfg';
    return from(this.authService.getAuthHeader()).pipe(switchMap((headers) => {
      return this.http.get<{ live: boolean }>(apiUrl, {
        headers
      })
    }), this.handleError());
  }

  sendDogClick(dog: Dog, dogName: string): Observable<any> {
    //return of(null); // @TODOrmv
    const apiUrl = `${environment.apiUrl}/dogs/${dog.box}/mark/${encodeURIComponent(dogName.toLowerCase())}`;


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

  // --- App Version Persistence ---
  async getVersion(): Promise<string | null> {
    return this.getWebAppVersion();
  }

  async setVersion(version: string): Promise<void> {
    //await Preferences.set({ key: 'appVersion', value: version });
  }

  async getWebAppVersion(): Promise<string | null> {
    return APP_VERSION;
  }

}
