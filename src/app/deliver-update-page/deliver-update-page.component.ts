import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import { site, grade, deliveryUpdate } from '../../app/shared/common.constants';
import { Site, Grade } from '../shared/common.model';
import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormControlName,
  MaxLengthValidator,
} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { BackendService } from '../_services';
import { Store } from '@ngrx/store';
import { getTotalGrades, selectSiteId } from '../app.selectors';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { DailogBoxComponent } from '../dailog-box/dailog-box.component';
import { SaveDailogBoxComponent } from '../save-dailog-box/save-dailog-box.component';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-deliver-update-page',
  templateUrl: './deliver-update-page.component.html',
  styleUrls: ['./deliver-update-page.component.scss'],
})
export class DeliverUpdatePageComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];
  
  isLoading: boolean;

  sites: Site[];
  site: any;
  grade: Grade[];
  deliveryUpdate: deliveryUpdate = <deliveryUpdate>{};
  deliveryForm: FormGroup;
  errorMessage: string;
  result: string;
  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private validationMessages: {
    [key: string]: { [key: string]: string } | {};
  } = {
    docketNumber: {
      required: 'Required Doctype.',
      maxLength: 'length should be 3 digits',
    },
    literValue: {
      required: 'Price Required.',
      range:
        'Price of the product must be between 1 (lowest) and 9999 (highest).',
    },
    companyName: {
      required: 'Required companyName',
    },
    deliveryDateTime: {
      required: 'Required timestamp',
    },
    gradeId: {
      required: 'Required grade',
    },
    siteId: {
      required: 'Required siteName',
    },
  };
  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private store: Store,
    public dialog: MatDialog
  ) {
    this.genericValidator = new GenericValidator(this.validationMessages);
  }
  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) =>
        Observable.fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.deliveryForm.valueChanges, ...controlBlurs)
      .debounceTime(500)
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.deliveryForm
        );
      });
  }

  ngOnInit(): void {
    this.sites = site;
    this.store.select(selectSiteId).subscribe((siteId) => {
      if (siteId !== this.site) {
        this.site = siteId;
        if (this.deliveryForm) {
          this.deliveryForm.reset();
        }
      }
    });
    this.store.select(getTotalGrades).subscribe((grades) => {
      // console.log('delivery',);
      if (grades !== undefined) {
        this.grade = grades.res.grades[0];
      }
    });

    this.deliveryForm = this.fb.group({
      docketNumber: ['', [Validators.required, Validators.maxLength(3)]],
      literValue: ['', [Validators.required, NumberValidators.range(1, 99999)]],
      deliveryDateTime: ['', [Validators.required]],
      gradeId: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      siteId: [this.site, [Validators.required]],
    });
  }

  savePriceChange(): void {
    if (this.deliveryForm.dirty && this.deliveryForm.valid) {
      // Copy the form values over the customer object values
      const customer = Object.assign(
        {},
        this.deliveryUpdate,
        
        this.deliveryForm.value
      );
      console.log('customer', customer);
      let customerArray = [];
      let res;
      customerArray.push(customer);
      this.backendService
        .deliveryUpdateSave('deliveryupdate', customerArray).finally(() => this.isLoading = false)
        .subscribe(
          (res) => {
            const message = `succesfully saveed the data`;
            const dialogRef = this.dialog.open(SaveDailogBoxComponent, {
              maxWidth: '400px',
              data: { name: message },
            });
            dialogRef.afterClosed().subscribe((dialogResult) => {
              this.result = dialogResult;

              this.deliveryForm.reset();
            });
          },
          (err) => {
            console.log('error', err);
            const message = 'error in saving data please try again';
            let dialogRef = this.dialog.open(SaveDailogBoxComponent, {
              maxWidth: '400px',
              data: { name: message },
            });
            dialogRef.disableClose = true;
            dialogRef.afterClosed().subscribe((dialogResult) => {
              this.result = dialogResult;
              this.deliveryForm.reset();
            });
          }
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

  // private createCustomer(customer: deliveryUpdate): Observable<deliveryUpdate> {
  //   let customerArray = [];
  //   let res;
  //   customerArray.push(customer);
  //   // this.backend
  //   //   .deliveryUpdateSave('/deliveryupdate', customerArray)

  //   //   .map(this.extractData)
  //   //   .subscribe((res) => {
  //   //     console.log(res);
  //   //     return res;
  //   //     res = res;
  //   //   });
  //   // return res;

  // }
  private extractData(response: Response) {
    let body: any = response.json ? response.json() : response;
    return body.data ? body.data : body || {};
  }
  private handleError(error: Response): Observable<any> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json() || 'Server error');
  }
  reset(){
    this.deliveryForm.reset();
  }
  ngDestroy(){
    this.deliveryForm.reset();
    
  }
}
