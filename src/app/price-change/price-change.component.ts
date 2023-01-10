import { Component, ViewChild,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ApicallService } from './price.service'
export interface PriceChange {
  id: number;
  avatar: string;
  firstname: string;
  lastname: string;
  rewards: number;
  email: string;
  membership: boolean;
  mobile: string;
  phone: string;
}
interface grade {
  gradeId: string;
  gradeName: string;
}
@Component({
  selector: 'app-price-change',
  templateUrl: './price-change.component.html',
  styleUrls: ['./price-change.component.scss'],
})

export class PriceChangeComponent implements OnInit {
  grades: grade[] = [
    { gradeId: '1', gradeName: 'grade1' },
    { gradeId: '2', gradeName: 'grade2' },
    { gradeId: '3', gradeName: 'grade3' },
  ];
  selectedGrades= this.grades[0].gradeId;
  form: FormGroup;
  private formSubmitAttempt: boolean;
  private uid = 0;
  disabled: boolean = true;
  header =[
    {
      Group: 1,
      grade: [
      ],
      Title: 'PUMP1',
      pumpId: '1',
      pumpName: 'pump 1',
    },
    {
      Group: 1,
      grade: [
      ],
      Title: 'PUMP2',
      pumpId: '1',
      pumpName: 'pump 2',
    },
    {
      Group: 1,
      grade: [
      
      ],
  
      Title: 'PUMP3',
      pumpId: '1',
      pumpName: 'pump 3',
    },
    {
      Group: 1,
      grade: [
      ],
  
      Title: 'PUMP2',
      pumpId: '1',
      pumpName: 'pump 2',
    },
    {
      Group: 1,
      grade: [
      
      ],
  
      Title: 'PUMP4',
      pumpId: '1',
      pumpName: 'pump 4',
    },
  ];
  

  @ViewChild('table') table: MatTable<any>;

  displayedColumns = ['pump','product', 'unit'];
  displayedColumns2=['Title','pumpName']
  dataSource: MatTableDataSource<AbstractControl>;
  

  get productControlArray() {
    return this.form.get('products') as FormArray;
  }

  constructor(private fb: FormBuilder,private api:ApicallService) {
    this.createForm();
    this.addRow();
    this.dataSource = new MatTableDataSource(
      this.productControlArray.controls);
  }

  createForm() {
    this.form = this.fb.group({
      products: this.fb.array([
      ]),
    });
  }

  trackRows(index: number, row: AbstractControl) {
    return row.value.uid;
  }
  savePriceChange(){
  //  let arr = this.header.map(val=>{
  //     this.form.value.products.map(val1=>{
  //       return val.grade.push(val1);
  //     })
    
  //   })
    for(var i =0; i<this.header.length;i++){
       for(var j=i; j<this.form.value.products.length;j++){
        // tslint:disable-next-line: triple-equals
        if(i===j){
          this.header[i].grade.push({
            grade_id:'grade',
            grade_name:'gradename',
            differncedata:[{ uid: this.form.value.products[j].uid,
              liters: this.form.value.products[j].liters,
              price: this.form.value.products[j].price}]
           });
        }
        
     }
    }
    console.log(this.form.value,this.header)
  }
  private addRow() {
    const rows = this.productControlArray;
    for(let i=0; i<this.header.length; i++){
      rows.push(
        this.fb.group({
          uid: this.nextUid(),
          liters: [0, Validators.required],
          price: [0, Validators.required],
          pump:[this.header[i].pumpName,{value: '', disabled: true}, Validators.required]
        })
      );
    }
   
  }
  
  createRow() {
    this.addRow();
    this.table.renderRows();
  }
 
  private nextUid() {
    ++this.uid
    return this.uid;
  }
ngOnInit(): void {
 
    this.api
    .getGradeNames()
    .subscribe((data) => {
      console.log("price",data);
     
    });
  // this.form.controls['pump'].disable();
}

}
