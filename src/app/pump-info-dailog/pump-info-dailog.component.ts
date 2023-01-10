import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs-compat';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-pump-info-dailog',
  templateUrl: './pump-info-dailog.component.html',
  styleUrls: ['./pump-info-dailog.component.scss']
})

export class PumpInfoDailogComponent implements OnInit {
tabledata: object;
columnNames : any;
dataSource = new MatTableDataSource<any>(ELEMENT_DATA[0].grade);
dataSourceChild= new MatTableDataSource<any>(ELEMENT_DATA[0].grade[0].differenceData)

displayedColumns = ['gradeName','liters','price','date'];
displayedColumns2 = ['liters'];
displayedColumns3 =['price']
displayedColumns4=['date']
getdata(data)
{
  console.log(data);
  return new MatTableDataSource<any>(ELEMENT_DATA[0].grade[0].differenceData);
}
  constructor(
    public dialogRef: MatDialogRef<PumpInfoDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    this.tabledata = data;
    console.log("Pump", data.data["pumpName"])
   // this.columnNames = Object.keys(this.data[0]);
  }

  ngOnInit(): void {
    console.log("data",this.dataSource);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
let ELEMENT_DATA = [
  {
    Group: 1,
    grade: [
      {
        gradeId: '1',
        gradeName: 'grade 1',
        differenceData: [
          {
            date: '22-12-2022',
            price: '$10',
            liters: '100lts',
          },
          {
            date: '22-12-2022',
            price: '$20',
            liters: '200lts',
          },
          {
          date: '22-12-2022',
          price: '$60',
          liters: '111lts',
        },
        ],
      },
      {
        gradeId: '2',
        gradeName: 'grade 2',
        differenceData: [
          {
            date: '22-12-2022',
            price: '$30',
            liters: '300lts',
          },
        ],
      },
      {
        gradeId: '3',
        gradeName: 'grade 3',
        differenceData: [
          {
            date: '22-12-2022',
            price: '$40',
            liters: '400lts',
          },
        ],
      },
    ],

    Title: 'PUMP1',
    pumpId: '1',
    pumpName: 'pump 1',
  },
];
