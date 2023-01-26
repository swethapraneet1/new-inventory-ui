import {
  Component,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Grade } from '../shared/common.model';
import { selectSiteId, getGradeDropdwon } from '../../app/app.selectors';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { AppAction } from '../app.action';
import { BackendService } from '../_services';

// import { MatDialog } from '@angular/material/dialog';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { DailogBoxComponent } from '../dailog-box/dailog-box.component';
import { SaveDailogBoxComponent } from '../save-dailog-box/save-dailog-box.component';
interface salesDetals {
  names: [];
}

@Component({
  selector: 'app-shop-sales-details',
  templateUrl: './shop-sales-details.component.html',
  styleUrls: ['./shop-sales-details.component.scss'],
})
export class ShopSalesDetailsComponent implements OnInit {
  grades = [];
  selectedGrades: null;
  salesForm: FormGroup;
  private formSubmitAttempt: boolean;
  private uid = 0;
  disabled: boolean = true;
  showForm: boolean = true;
  pumpData: any;
  siteId: string = '';
  result: string = '';
  salesList = [];
  isLoading = false;

  @ViewChild('salestable') salestable: MatTable<any>;

  displayedColumns = ['name', 'value'];
  SalesdataSource: MatTableDataSource<AbstractControl>;

  get saleDetailsControlArray() {
    return this.salesForm.get('salesDetails') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    private backendService: BackendService,
    public dialog: MatDialog
  ) {
    this.saleForm();
    this.SalesdataSource = new MatTableDataSource(
      this.saleDetailsControlArray.controls
    );
    this.store.select(selectSiteId).subscribe((siteId) => {
      //console.log(siteId);
      if (siteId !== this.siteId) {
        // console.log('changed');
        this.siteId = siteId;
        this.formRest();
        // this.createRow();
        this.gradeCall();
      }
    });
  }
  gradeCall() {
    this.salesList = [];
    this.backendService.getSalesList(this.siteId).subscribe((list: salesDetals) => {
      this.salesList = list.names;
      // console.log(this.salesList);
      if (this.salesList) {
        this.createRow();
      }
    });


  }
  saleForm() {
    this.salesForm = this.fb.group({
      salesDetails: this.fb.array([]),
    });
  }
  ngAfterViewInit() {
    this.salestable.renderRows();
  }
  trackRows(index: number, row: AbstractControl) {
    return row.value.uid;
  }
  saveSalesDetails() {
    // console.log(this.salesForm.value.salesDetails.value);

    let sales = [];
    sales.push({
      sales: this.salesForm.value.salesDetails,
      siteId: this.siteId,
    });
    //console.log(sales);
    this.isLoading = true;
    this.backendService.SaveSalesList(sales[0]).subscribe(
      (res) => {
        this.isLoading = false;
        this.formRest();
        this.gradeCall();
        const message = `succesfully saved the data`;
        const dialogRef = this.dialog.open(SaveDailogBoxComponent, {
          maxWidth: '400px',
          data: { name: message },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          this.result = dialogResult;
          // (this.form.get('salesDetails') as FormArray).clear();
          // this.formRest();
        });
      },
      (err) => {
        this.isLoading = false;
        console.log('error', err);
        const message = 'error in saving data please try again';
        let dialogRef = this.dialog.open(SaveDailogBoxComponent, {
          maxWidth: '400px',
          data: { name: message },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((dialogResult) => {
          this.result = dialogResult;
          //  this.formRest();
        });
      }
    );
  }
  private addRow() {

    let length = this.salesList.length;
    for (var i = 0; i < length; i++) {
      let formGroup = this.fb.group({
        name: [
          this.salesList[i],
          { value: '', disabled: true },
          Validators.required,
        ],
        value: [0, Validators.required],
      });
      (this.salesForm.get('salesDetails') as FormArray).push(formGroup);
    }
    this.showForm = false;
  }

  createRow() {
    this.addRow();
    if (this.salestable) {
      this.salestable.renderRows();
    }

  }

  private nextUid() {
    ++this.uid;
    return this.uid;
  }
  ngOnInit(): void {

    this.store.select(selectSiteId).subscribe((siteId) => {
      this.siteId = siteId;
    });
  }
  formRest() {
    (this.salesForm.get('salesDetails') as FormArray).clear();
    // this.showForm = true;
    this.salesList = [];
  }
  formRest1() {
    location.reload();
    this.selectedGrades = null;
    this.showForm = true;
    this.salesList = [];
  }
  ngOnDestroy() {
    (this.salesForm.get('salesDetails') as FormArray).clear();
    this.selectedGrades = null;
    this.salesList = [];
    // this.subscriptions.forEach(s => s.unsubscribe());
  }
}
