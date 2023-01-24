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
import { Router } from '@angular/router';
import { AppAction } from '../app.action';
import { getGradeDropdwon } from '../app.selectors';

@Component({
  selector: 'app-deliver-update-page',
  templateUrl: './deliver-update-page.component.html',
  styleUrls: ['./deliver-update-page.component.scss'],
})
export class DeliverUpdatePageComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];

  isLoading= false;

  sites: Site[];
  site: any;
  grade: Grade[];
  deliveryUpdate: deliveryUpdate = <deliveryUpdate>{};
  deliveryForm: FormGroup;
  errorMessage: string;
  result: string;
  hideSiteID:false;
  isNextDisabled = true;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private store: Store,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.sites = site;
    this.store.select(selectSiteId).subscribe((siteId) => {
      if (siteId !== this.site) {
        this.site = siteId;
        if (this.deliveryForm) {
          this.deliveryForm.reset({
            siteId:this.site
          });
        }
      }
    });
    this.gradeCall();
    // this.store.select(getTotalGrades).subscribe((grades) => {
    //   if (grades !== undefined) {
    //     this.grade = grades.res.grades[0];
    //   }
    // });
  }

  ngOnInit(): void {
    (this.deliveryForm = this.fb.group({
      docketNumber: ['', [Validators.required]],
      literValue: ['', [Validators.required]],
      deliveryDateTime: ['', [Validators.required]],
      gradeId: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      siteId: [this.site ? this.site : this.getSiteId()],
    })),
      this.deliveryForm.valueChanges.subscribe((v) => {
        this.isNextDisabled = !this.deliveryForm.valid;
      });
  }
  savePriceChange() {
    console.log(this.deliveryForm.value);
    this.isLoading = true;
    let customerArray = [];
    customerArray.push(this.deliveryForm.value);
    this.backendService
      .deliveryUpdateSave('deliveryupdate', customerArray)
      .finally(() => (this.isLoading = false))
      .subscribe(
        (res) => {
          const message = `succesfully saved the data`;
          const dialogRef = this.dialog.open(SaveDailogBoxComponent, {
            maxWidth: '400px',
            data: { name: message },
          });
          dialogRef.afterClosed().subscribe((dialogResult) => {
            this.result = dialogResult;
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
          });
        }
      );
    this.deliveryForm.reset({
      siteId:this.site
    });
  }
  getSiteId() {
    this.store.select(selectSiteId).subscribe((siteId) => {
      this.site = siteId;
    });
    return this.site;
  }
  gradeCall() {
    this.store.dispatch(AppAction.getGradeDropDown({ siteId: this.site }));
    this.store.select(getGradeDropdwon).subscribe((res) => {
      if (res === undefined || res.res.grades[0].length < 0) {
        this.store.dispatch(AppAction.getGradeDropDown({ siteId: this.site }));
      }else{
        if(res !== undefined) {
          this.grade =res.res.grades[0];
          // console.log(this.grades);
        }
      }

    });
    // this.api.getGradeNames(this.site).subscribe((data) => {
    //   this.grades = data;
    // });
  }
  ngDestroy() {
    this.deliveryForm.reset();
    this.isLoading = false;
  }
}
