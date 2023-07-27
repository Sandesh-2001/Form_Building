import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AllService } from 'src/app/service/all.service';

@Component({
  selector: 'app-form-render',
  templateUrl: './form-render.component.html',
  styleUrls: ['./form-render.component.css'],
})
export class FormRenderComponent implements OnInit {
  renderForm!: FormGroup;
  controlsArray!: FormArray;
  getData: any[] = [];
  controlType: any;
  controlText: any;
  modalName: any;
  currentName: any;
  finalobj: any = {};
  option: any[] = [];
  isEmptyForm!: boolean;
  isSubmitSpin: boolean = false;
  shudhVariable: boolean = false;

  constructor(
    private _all: AllService,
    private fb: FormBuilder,
    private _http: HttpClient
  ) {
    this.controlsArray = new FormArray<FormArray>([]);
  }

  labelArray: any[] = [];

  ngOnInit(): void {
    this.option = [];

    this._all.arrayData.subscribe({
      next: (data: any) => {
        console.log('data of option is', data);
        if (Object.keys(data).length == 0) {
          this.isEmptyForm = true;
        } else {
          this.isEmptyForm = false;
        }
        this.controlType = data?.type;
        this.controlText = data.text;
        this.modalName = data.name;
        // this.option = data.option?.checkvalue;
        if (Object.keys(data).length != 0) {
          if (this.option.length == 0) {
            this.option = [data.option?.checkvalue];
          } else {
            this.option = [...this.option, data.option?.checkvalue];
          }
        }
        // console.log('length of array is', this.option.length);
        // if (data.option) {
        // this.option.push(data.option?.checkvalue);
        console.log('option array is', this.option);
        // }
        // this.getControl(data);
        console.log('data  is array', data);
        this.addControl(data);
      },
    });
    this.controlsArray = new FormArray<FormArray>([]);
    this.renderForm = this.fb.group({
      controls: this.controlsArray,
    });
    console.log('form control ', this.controlsArray.value);
  }
  selectedOption: any[] = [];
  optionChecked(
    value: any,
    index: number,
    labelName: any,
    id: string,
    type: string
  ) {
    console.log('value ifbdbffdgs', value);

    switch (type) {
      case 'checkbox': {
        // this.option[index]['checked'] = (
        //   document.getElementById(id) as HTMLInputElement
        // )?.checked;

        // this.shudhVariable = this.isValid(this.option);

        let ind = this.selectedOption?.findIndex((ele) => ele === value);
        if (ind > -1) {
          this.selectedOption.splice(ind, 1);
          return;
        }
        this.selectedOption.push(value);
        console.log('Selected option array is', this.selectedOption);
        this.finalobj[labelName] = this.selectedOption;
        break;
      }
      case 'radio': {
        console.log('value is', value);
        this.finalobj[labelName] = value;
        break;
      }
    }
    console.log('this is final object', this.finalobj);
  }
  // meowMeow(array: any[], index: number, labelName: string): boolean {
  //   console.log('index is', index);
  //   if (index == 0) {
  //     this.finalobj[labelName] = this.option[0]?.check;

  //     console.log(this.finalobj, 'hihi');

  //     return true;
  //   }
  //   return false;
  // }

  isValid(getArray: any[]): boolean {
    let i: number = 0;
    console.log(getArray);
    for (let x of getArray) {
      if (x.checked) {
        i++;
        break;
      }
    }
    if (i > 0) {
      return true;
    }
    return false;
  }

  showForm() {
    console.log(this.renderForm);
    console.log('shudh variable', this.shudhVariable);
  }
  getControl(data?: any): FormGroup {
    console.log('get control data', data);
    let obj = {
      type: this.controlType,
      text: this.controlText,
      name: this.modalName,
      valid: data.validation,
    };

    console.log('validations', obj.valid);
    let allValidation: any[] = [];
    obj.valid?.forEach((element: any) => {
      console.log('element is ', element);
      if (element.validation == 'required') {
        allValidation.push(Validators.required);
      }
      if (element.validation == 'email') {
        allValidation.push(Validators.email);
      }
      if (element.validation == 'maxlength') {
        allValidation.push(Validators.maxLength(element.len));
      }
      if (element.validation == 'minlength') {
        allValidation.push(Validators.minLength(element.len));
      }
      // let maxlength = element.validation.split(' ');
      // console.log('max is ', maxlength);
      // if (maxlength[0] == 'maxlength') {
      //   allValidation.push(Validators.maxLength(maxlength[1]));
      // }
      // let minlength = element.validation.split(' ');
      // console.log('max is ', minlength);
      // if (minlength[0] == 'minlength') {
      //   allValidation.push(Validators.minLength(minlength[1]));
      // }
    });
    console.log('validators array is ', allValidation);
    this.labelArray.push(obj);
    return this.fb.group({
      newControl: ['', allValidation, ,],
    });

    // return this.
  }

  addControl(data?: any) {
    this.controlsArray.push(this.getControl(data));
    console.log(this.controlsArray);
  }

  getControlFroError(index: number): any {
    return this.controlsArray.at(index).get('newControl');
  }

  setName() {}

  setValue(index: number, controlsArray: any, value: any, name: any) {
    this.finalobj[name] = value;
    console.log('final object is', this.finalobj);
  }
  removeControl(index: number, data: any) {
    delete this.finalobj[data];
    this.controlsArray.removeAt(index);
    console.log('final object is', this.finalobj);
  }
  afterSubmit: any;
  submit() {
    this.isSubmitSpin = true;
    if (Object.keys(this.finalobj).length === 0) {
      alert('Give some values');
      return;
    }
    this._http
      .post('https://winter-summer-sceptre.glitch.me/submit', this.finalobj)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.afterSubmit = data?.message;
          this.isSubmitSpin = false;
        },
      });
    console.log(this.renderForm);
    console.log('Render form value', this.finalobj);
  }
}
