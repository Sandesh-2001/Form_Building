import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AllService } from 'src/app/service/all.service';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css'],
})
export class FormBuilderComponent implements OnInit {
  formsBuilder!: FormGroup;
  validationArray!: FormArray;
  checkGroup!: FormGroup | null;
  checkArray!: FormArray;
  constructor(private fb: FormBuilder, private _all: AllService) {}

  ngOnInit(): void {
    this.validationArray = new FormArray([this.getValid()]);
    this.formsBuilder = this.fb.group({
      text: [''],
      name: [''],
      type: [''],
      validation: this.validationArray,
    });
  }

  getValid(): FormGroup {
    return this.fb.group({
      validation: [''],
    });
  }
  typeChange(value: any) {
    console.log('The value is', value);
    if (value === 'checkbox' || value === 'radio') {
      let i = 1;
      this.checkArray = new FormArray([this.getCheck()]);
      while (i < 4) {
        this.addCheck();
        console.log('hello', i);
        i++;
      }
      this.checkGroup = this.fb.group({
        checkvalue: this.checkArray,
      });
    }
  }
  change() {
    console.log('check array', this.checkGroup);
  }
  getCheck() {
    return this.fb.group({
      check: [''],
    });
  }
  addCheck() {
    this.checkArray.push(this.getCheck());
  }
  removeCheck(index: number) {
    this.checkArray.removeAt(index);
  }

  addValid() {
    this.validationArray.push(this.getValid());
  }
  removeValid(i: number) {
    this.validationArray.removeAt(i);
  }
  validArr: any[] = [];
  min: number = 0;
  max: number = 0;
  maxInput: boolean = false;
  minInput: boolean = false;
  valid(data: any, validLen?: number) {
    let a = (document.getElementById('maxlength') as HTMLInputElement)?.checked;
    let b = (document.getElementById('minlength') as HTMLInputElement)?.checked;
    if (a) {
      this.maxInput = true;
    } else {
      this.maxInput = false;
    }
    if (b) {
      this.minInput = true;
    } else {
      this.minInput = false;
    }

    console.log('max value is', this.max);
    console.log('min value is', this.min);

    const index = this.validArr.findIndex(
      (element) => element.validation == data
    );
    console.log('valid length is', validLen);
    if (index > -1) {
      if (validLen == undefined) {
        this.validArr.splice(index, 1);
        console.log('validateion array is', this.validArr);
        return;
      } else {
        if (
          this.validArr[index].validation == 'minlength' ||
          this.validArr[index].validation == 'maxlength'
        ) {
          this.validArr[index].len = validLen;
        } else {
          this.validArr.splice(index, 1);
          console.log('validateion array is', this.validArr);
        }
        return;
      }
    }
    let obj = {};
    if (data === 'maxlength') {
      obj = {
        validation: data,
        len: this.max,
      };
    } else if (data === 'minlength') {
      obj = {
        validation: data,
        len: this.min,
      };
    } else {
      obj = {
        validation: data,
      };
    }

    console.log('checkbox data is', this.validArr);
    this.validArr.push(obj);
  }

  addInArray() {
    this.formsBuilder.value.validation = this.validArr;

    let obj = { ...this.formsBuilder.value, option: this.checkGroup?.value };
    console.log(obj);
    this._all.addControl(obj);
    this.checkGroup = null;
    (document.getElementById('options_id') as HTMLInputElement).value = '';
    (document.getElementById('text') as HTMLInputElement).value = '';
    (document.getElementById('modal') as HTMLInputElement).value = '';
  }
}
