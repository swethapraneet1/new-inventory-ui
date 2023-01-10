import { Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  ElementRef } from '@angular/core';
import { site,grade,deliveryUpdate } from '../../app/shared/common.constants';
import { Site,Grade } from '../shared/common.model';
import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName, MaxLengthValidator } from '@angular/forms';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/merge";
import { Observable } from "rxjs/Observable";
import { BackendService } from '../_services'

@Component({
  selector: 'app-deliver-update-page',
  templateUrl: './deliver-update-page.component.html',
  styleUrls: ['./deliver-update-page.component.scss']
})

export class DeliverUpdatePageComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
 sites: Site[];
 grade: Grade[];
 deliveryUpdate: deliveryUpdate = <deliveryUpdate>{};
 deliveryForm :FormGroup;   
  errorMessage: string;
 // Use with the generic validation message class
 displayMessage: { [key: string]: string } = {};
 private genericValidator: GenericValidator;
 private validationMessages: { [key: string]: { [key: string]: string } | {} } = {
  docType: {
      required: 'Required Doctype.',
      maxLength:'length should be 3 digits'
  },
  price: {
    required: 'Price Required.',
    range:
      "Price of the product must be between 1 (lowest) and 9999 (highest)."
  },
  siteName:{
    required:'Required siteName',
  },
  timeStamp:{
    required:'Required timestamp'
  },
  garde:{
    required:'Required grde'
  }
};
  constructor(private fb: FormBuilder,private backend:BackendService) { 
    this.genericValidator = new GenericValidator(this.validationMessages);
  }
  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.deliveryForm.valueChanges, ...controlBlurs).debounceTime(500).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.deliveryForm);
    });
}

  ngOnInit(): void {
    this.sites = site;
    this.grade = grade;
    console.log(this.sites);
    this.deliveryForm = this.fb.group({
      docType: ['', [Validators.required,Validators.maxLength(3)]],
      price: ["", [Validators.required,NumberValidators.range(1, 99999)]],
      siteName:["",[Validators.required]],
      timeStamp:["",[Validators.required]],
      grade:["",[Validators.required]]
  });
  }
  
  savePriceChange(): void {
    if (this.deliveryForm.dirty && this.deliveryForm.valid) {
        // Copy the form values over the customer object values
        const customer = Object.assign({}, this.deliveryUpdate, this.deliveryForm.value);
  
        this.createCustomer(customer)
            .subscribe(
                () => this.onSaveComplete(),
                (error: any) => this.errorMessage = <any>error
            );
    } else if (!this.deliveryForm.dirty) {
        this.onSaveComplete();
    }
}

onSaveComplete(): void {
    // Reset the form to clear the flags
    this.deliveryForm.reset();
   // this.router.navigate(['/customers']);
}

private createCustomer(customer: deliveryUpdate): Observable<deliveryUpdate> {
  return this.backend.deliveryUpdateSave('save', customer)
    .map(this.extractData)
    .catch(this.handleError);
}
private extractData(response: Response) {
  let body : any = response.json ? response.json() : response;
  return body.data ? body.data : (body || {});
}
  private handleError(error: Response): Observable<any> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json() || 'Server error');
  }
}
