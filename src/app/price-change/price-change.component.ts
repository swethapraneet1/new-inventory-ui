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
import { ApicallService } from './price.service';
import { Grade } from '../shared/common.model';
import { selectSiteId,getGradeDropdwon } from '../../app/app.selectors';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { AppAction } from '../app.action';
import { BackendService } from '../_services';

@Component({
  selector: 'app-price-change',
  templateUrl: './price-change.component.html',
  styleUrls: ['./price-change.component.scss'],
})
export class PriceChangeComponent implements OnInit {
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

  @ViewChild('table') table: MatTable<any>;

  displayedColumns = ['pump', 'literValue', 'dollarValue'];
  dataSource: MatTableDataSource<AbstractControl>;

  get productControlArray() {
    return this.form.get('products') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private api: ApicallService,
    private store: Store,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    private backendService:BackendService
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
    this.store.dispatch(AppAction.getGradeDropDown({siteId:this.site}));
    this.store.select(getGradeDropdwon).subscribe((gradeDropDown)=>{
      if(gradeDropDown === undefined){
        this.store.dispatch(AppAction.getGradeDropDown({siteId:this.site}));
      }
      if(gradeDropDown !== undefined){
        this.grades = gradeDropDown.res.grades[0];
        console.log(this.grades);
      }
     
    })
    // this.api.getGradeNames(this.site).subscribe((data) => {
    //   this.grades = data;
    // });
  }
  createForm() {
    this.form = this.fb.group({
      products: this.fb.array([]),
    });
  }

  trackRows(index: number, row: AbstractControl) {
    return row.value.uid;
  }
  savePriceChange() {
    console.log(this.form.value.products.value);
    this.isDisiable = 'false';
    let grade = [];
    grade.push({
      gradeId: this.selectedGrades,
      siteId: this.site,
      pump: this.form.value.products,
    });
    console.log(grade[0]);
    this.router.navigate(['/PriceChange']);
    this.backendService.SaveForm(grade[0]).subscribe((data) => {
      console.log(data);
      // saved sucessflly messgae should come after that show popup and reset the form and grade dropdwon
    });
  }
  private addRow() {
    const rows = this.productControlArray;
    for (let i = 0; i < this.pumpData.length; i++) {
      rows.push(
        this.fb.group({
         // uid: this.nextUid(),
          literValue: [0, Validators.required],
          dollarValue: [0, Validators.required],
          pump: [
            this.pumpData[i]['pumpName'],
            { value: '', disabled: true },
            Validators.required,
          ],
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
    this.api.getFormInput(value).subscribe((data) => {
      this.pumpData = data;
      this.changeDetectorRefs.detectChanges();
      if (this.pumpData.length > 0) {
        this.createRow();
      } else {
      }
    });
  }
  ngOnInit(): void {
    this.gradeCall();
  }
  formRest() {
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
