import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Dog {
  box: string;
  imie: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class DogsService {
  private dogs: Dog[] = [
    { box: 'A1', imie: 'Reksio', status: 'x' },
    { box: 'B2', imie: 'Azor', status: 'X' },
    { box: 'C3', imie: 'Burek', status: 'x' },
    { box: 'D4', imie: 'Max', status: 'X' },
    { box: 'E5', imie: 'Fafik', status: 'x' },
  ];

  getDogs(): Observable<Dog[]> {
    return of(this.dogs);
  }
}
