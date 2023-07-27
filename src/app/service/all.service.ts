import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AllService {
  constructor() {}

  arrayData = new BehaviorSubject<any>({});

  addControl(data: any) {
    this.arrayData.next(data);
  }
}
