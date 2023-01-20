import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
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

@Component({
  selector: 'app-closing-day-entry',
  templateUrl: './closing-day-entry.component.html',
  styleUrls: ['./closing-day-entry.component.scss']
})
export class ClosingDayEntryComponent implements OnInit {
  grades = [];
  selectedGrades: null;
  form: FormGroup;
  private formSubmitAttempt: boolean;
  private uid = 0;
  disabled: boolean = true;
  showForm: boolean = true;
  pumpData: any;
  site: string = '';
  isDisiable = 'false';
  result: string = '';

  @ViewChild('table') table: MatTable<any>;

  displayedColumns = ['pumpName', 'literValue', 'dollarValue'];
  dataSource: MatTableDataSource<AbstractControl>;

  get productControlArray() {
    return this.form.get('products') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    private backendService: BackendService,
    public dialog: MatDialog
  ) {
    this.createForm();
    this.dataSource = new MatTableDataSource(this.productControlArray.controls);
    this.store.select(selectSiteId).subscribe((siteId) => {
      if (siteId !== this.site) {
        this.site = siteId;
        this.gradeCall();
        this.selectedGrades = null;
        this.showForm = true;
      }
    });
  }
  gradeCall() {
    this.store.dispatch(AppAction.getGradeDropDown({ siteId: this.site }));
    this.store.select(getGradeDropdwon).subscribe((gradeDropDown) => {
      if (gradeDropDown === undefined) {
        this.store.dispatch(AppAction.getGradeDropDown({ siteId: this.site }));
      }
      if (gradeDropDown !== undefined) {
        this.grades = gradeDropDown.res.grades[0];
        // console.log(this.grades);
      }
    });
    // this.api.getGradeNames(this.site).subscribe((data) => {
    //   this.grades = data;
    // });
  }
  createForm() {
    this.form = this.fb.group({
      dipValue: new FormControl(null, [Validators.required]),
      products: this.fb.array([]),
    });
  }

  trackRows(index: number, row: AbstractControl) {
    return row.value.uid;
  }
  savePriceChange() {
    console.log(this.form.value);
    this.isDisiable = 'false';
    let grade = [];
    grade.push({
      gradeId: this.selectedGrades,
      siteId: this.site,
      closingDateTime:new Date(),
      dipsValue:this.form.value.dipValue,
      pumps: this.form.value.products,
     

    });
    // console.log(grade[0]);

    this.backendService.SaveFormClosingDay(grade[0]).subscribe(
      (res) => {
        const message = `succesfully saveed the data`;
        const dialogRef = this.dialog.open(SaveDailogBoxComponent, {
          maxWidth: '400px',
          data: { name: message },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          this.result = dialogResult;

          this.formRest();
          this.router.navigate(['/closingDayEntry']);
        });
      },
      (err) => {
        // console.log('error', err);
        const message = 'error in saving data';
        let dialogRef = this.dialog.open(SaveDailogBoxComponent, {
          maxWidth: '400px',
          data: { name: message },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((dialogResult) => {
          this.result = dialogResult;
          this.formRest();
        });
      }
    );
  }
  private addRow() {
    const rows = this.productControlArray;
    for (let i = 0; i < this.pumpData.length; i++) {
      rows.push(
        this.fb.group({
          // uid: this.nextUid(),
          literValue: [0, Validators.required],
          dollarValue: [0, Validators.required],
          pumpName: [
            this.pumpData[i]['pumpName'],
            { value: '', disabled: true },
            Validators.required,
          ],
          pumpId: [this.pumpData[i]['pumpId']],
         // dipValue: [ Validators.required]
        })
      );
    }
    this.showForm = false;
  }

  createRow() {
    this.addRow();
    this.table.renderRows();
  }

  private nextUid() {
    ++this.uid;
    return this.uid;
  }
  selectedGrade(value) {
    this.selectedGrades = value;
    this.isDisiable = 'true';
    this.backendService
      .getGradeWisePumpDetails(value, this.site)
      .subscribe((res) => {
        this.pumpData = res.pumps[0];
        this.changeDetectorRefs.detectChanges();
        if (this.pumpData.length > 0) {
          this.createRow();
        } else {
        }
      });
    // this.api.getFormInput(value).subscribe((data) => {
    //   this.pumpData = data;
    //   this.changeDetectorRefs.detectChanges();
    //   if (this.pumpData.length > 0) {
    //     this.createRow();
    //   } else {
    //   }
    // });
  }
  ngOnInit(): void {
    this.gradeCall();
  }
  formRest() {
    this.router.navigate(['/closingDayEntry']);
    this.productControlArray.controls = [];
    this.changeDetectorRefs.detectChanges();
    this.form.reset();
    this.selectedGrades = null;
    this.isDisiable = 'false';
    this.pumpData = [];
    this.showForm = true;
  }
  ngOnDestroy() {
    this.showForm = true;
    this.form.reset();
    this.selectedGrades = null;
    this.isDisiable = 'false';
  }
}
