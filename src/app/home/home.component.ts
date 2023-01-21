import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PumpInfoDailogComponent } from '../pump-info-dailog/pump-info-dailog.component';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../_services';
import { getLocaleDateFormat } from '@angular/common';
import { AuthenticationService } from '../_services';
import { Store } from '@ngrx/store';
import { setSiteSelection } from '../../app/app.action';
import { selectSiteId } from '../../app/app.selectors';
import { HomeApicallService } from './home.service';
interface sites {
  value: string;
  viewValue: string;
}
interface grade {
  gradeNames: [];
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Input() viewValue: string;
  displayColumns = ['PumpName'];

  displayedColumns: string[] = [
    //after integration change the  displayColumns to  displayedColumns
    // 'pumpName',
    // 'ULP.soldData.dollarsValue',
    // 'ULP.soldData.litersValue',
    // 'P-95.soldData.dollarsValue',
    // 'P-95.soldData.litersValue',
    // 'DIS.soldData.dollarsValue',
    // 'DIS.soldData.litersValue',
  ];
  errorMessage = '';
  responseData: [];
  site: string;
  // dataSource: any; enable when request with backend server
  date = new Date();
  grades: string[] = [];
  data = [
    {
      pumpId: 1,
      pumpName: 'PUMP 1',
      ULP: {
        gradeName: 'ULP',
        gradeId: 1,
        soldData: {
          closingDateTime: '2022-10-10T18:30',
          litersValue: -1,
          dollarsValue: -1,
        },
      },
      'P-95': {
        gradeName: 'P-95',
        gradeId: 2,
        soldData: {
          closingDateTime: '2022-10-10T18:30',
          litersValue: 2,
          dollarsValue: 0,
        },
      },

      DIS: {
        gradeName: 'DIS',
        gradeId: 3,
        soldData: {
          closingDateTime: '2022-10-10T18:30',
          litersValue: 737,
          dollarsValue: 1034,
        },
      },
    },
  ];
  dataSource =[];
  //disiable when request with backend server

  constructor(
    public dialog: MatDialog,
    private backendService: BackendService,
    public authService: AuthenticationService,
    private store: Store,
    private homeApiService: HomeApicallService
  ) {
    this.store.select(selectSiteId).subscribe((siteId) => {
      this.site = siteId;
      console.log('home', this.site);
    });
    this.getTableData();
    if (this.site) {
      this.backendService
        .getTableGradesHeaders(this.site)
        .subscribe((grades: grade) => {
          this.grades = ['Name', ...grades.gradeNames];
           this.displayedColumns = ['pumpName'];
          let displayColumtemp = ['pumpName'];
          for (let i = 0; i < this.grades.length; i++) {
            if (i !== 0) {
              const littervalue = '.soldData.litersValue';
              const dollerValue = '.soldData.dollarsValue';
              displayColumtemp.push(
                this.grades[i] + littervalue,
                this.grades[i] + dollerValue
              );
            }
             this.displayedColumns = [...new Set(displayColumtemp)];
             console.log(this.displayedColumns);
             this.getTableData();
          }
        });
    }
  }

  ngOnInit(): void {
    //let val = this.authService.siteValue()

    // this.getTableData();
    this.getTableDatapost();
  }
  getKeys(obj) {
    return Object.keys(obj);
  }
  openDialog(element) {
    console.log(element);
    const dialogRef = this.dialog.open(PumpInfoDailogComponent, {
      data: { data: element },
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '80%',
      panelClass: 'full-screen-modal',
      disableClose: true,
    });
  }
  getTableData() {
    this.backendService.getAllTableData(this.site).subscribe(
      (response: any) => {
     this.dataSource = response;
      },
      (error) => (this.errorMessage = error as any)
    );
  }
  getTableDatapost() {
    let data = {
      site: this.site,
    };
    // this.backendService.getTabledataPost('pumpData', data).subscribe(
    //   (response) => {
    //     console.log(response);
    //     // this.dataSource = response;
    //   },
    //   (error) => (this.errorMessage = error as any)
    // );
  }
  resolveEnum(num: number) {
    if (num % 2 === 1) return 'DOLLARS';
    else {
      return 'LITERS';
    }
  }

  getDisplay(eleObj: any, disObj: any) {
    var test = disObj.split('.').reduce(function (o, key) {
      return o[key];
    }, eleObj);
    if (test === -1) {
      return (test = '');
    }
    return test;
  }
  getDisplayColumns() {
    for (var i = 0; i < this.grades.length; i++) {
      if (i !== 0) {
        const littervalue = '.soldData.litersValue';
        const dollerValue = '.soldData.litersValue';
        this.displayedColumns.push(
          this.grades[i] + littervalue,
          this.grades[i] + dollerValue
        );
      }
      return this.displayColumns;
    }
    console.log(this.displayColumns);
  }
}
// const ELEMENT_DATA: any[] = [
//   {
//     pumpId: 1,
//     pumpName: 'PUMP 1',

//     ULP: {
//       gradeId: 1,
//       gradeName: 'ULP',
//       soldData: {
//         dollarsValue: 53,
//         litersValue: 147,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     P95: {
//       gradeId: 2,
//       gradeName: 'P-95',
//       soldData: {
//         dollarsValue: 0,
//         litersValue: 2,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     DIS: {
//       gradeId: 3,
//       gradeName: 'DIS',
//       soldData: {
//         dollarsValue: 1034,
//         litersValue: 737,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//   },
//   {
//     pumpId: 2,
//     pumpName: 'PUMP 2',

//     ULP: {
//       gradeId: 1,
//       gradeName: 'ULP',
//       soldData: {
//         dollarsValue: 161234234234234,
//         litersValue: 23423423423423423423,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     P95: {
//       gradeId: 2,
//       gradeName: 'P-95',
//       soldData: {
//         dollarsValue: 0,
//         litersValue: 0,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     DIS: {
//       gradeId: 3,
//       gradeName: 'DIS',
//       soldData: {
//         dollarsValue: 457,
//         litersValue: 0,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//   },
//   {
//     pumpId: 3,
//     pumpName: 'PUMP 3',
//     ULP: {
//       gradeId: 1,
//       gradeName: 'ULP',
//       soldData: {
//         dollarsValue: 235,
//         litersValue: 317,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     P95: {
//       gradeId: 2,
//       gradeName: 'P-95',
//       soldData: {
//         dollarsValue: 0,
//         litersValue: 81,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     DIS: {
//       gradeId: 3,
//       gradeName: 'DIS',
//       soldData: {
//         dollarsValue: 1150,
//         litersValue: -1636,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//   },
//   {
//     pumpId: 4,
//     pumpName: 'PUMP 4',

//     ULP: {
//       gradeId: 1,
//       gradeName: 'ULP',
//       soldData: {
//         dollarsValue: 303,
//         litersValue: 0,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     P95: {
//       gradeId: 2,
//       gradeName: 'P-95',
//       soldData: {
//         dollarsValue: 148,
//         litersValue: 0,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     DIS: {
//       gradeId: 3,
//       gradeName: 'DIS',
//       soldData: {
//         dollarsValue: 1688,
//         litersValue: 0,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//   },
//   {
//     pumpId: 5,
//     pumpName: 'PUMP 5',

//     ULP: {
//       gradeId: 1,
//       gradeName: 'ULP',
//       soldData: {
//         dollarsValue: 293,
//         litersValue: 410,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     P95: {
//       gradeId: 2,
//       gradeName: 'P-95',
//       soldData: {
//         dollarsValue: 54,
//         litersValue: 69,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     DIS: {
//       gradeId: 3,
//       gradeName: 'DIS',
//       soldData: {
//         dollarsValue: 706,
//         litersValue: 3588,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//   },
//   {
//     pumpId: 6,
//     pumpName: 'PUMP 6',

//     ULP: {
//       gradeId: 1,
//       gradeName: 'ULP',
//       soldData: {
//         dollarsValue: 402,
//         litersValue: 0,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     P95: {
//       gradeId: 2,
//       gradeName: 'P-95',
//       soldData: {
//         dollarsValue: 76,
//         litersValue: 0,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//     DIS: {
//       gradeId: 3,
//       gradeName: 'DIS',
//       soldData: {
//         dollarsValue: 1443,
//         litersValue: 0,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//   },
//   {
//     pumpId: 7,
//     pumpName: 'PUMP 7',

//     ULP: {
//       gradeId: 1,
//       gradeName: 'ULP',
//       soldData: {
//         dollarsValue: '',
//         litersValue: '',
//         closingDateTime: '',
//       },
//     },
//     P95: {
//       gradeId: 2,
//       gradeName: 'P-95',
//       soldData: {
//         dollarsValue: '',
//         litersValue: '',
//         closingDateTime: '',
//       },
//     },
//     DIS: {
//       gradeId: 3,
//       gradeName: 'DIS',
//       soldData: {
//         dollarsValue: 1125,
//         litersValue: 562,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//   },
//   {
//     pumpId: 8,
//     pumpName: 'PUMP 8',

//     ULP: {
//       gradeId: 1,
//       gradeName: 'ULP',
//       soldData: {
//         dollarsValue: '',
//         litersValue: '',
//         closingDateTime: '',
//       },
//     },
//     P95: {
//       gradeId: 2,
//       gradeName: 'P-95',
//       soldData: {
//         dollarsValue: '',
//         litersValue: '',
//         closingDateTime: '',
//       },
//     },
//     DIS: {
//       gradeId: 3,
//       gradeName: 'DIS',
//       soldData: {
//         dollarsValue: 901,
//         litersValue: 451,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//   },
//   {
//     pumpId: 9,
//     pumpName: 'PUMP 9',

//     ULP: {
//       gradeId: 1,
//       gradeName: 'ULP',
//       soldData: {
//         dollarsValue: '',
//         litersValue: '',
//         closingDateTime: '',
//       },
//     },
//     P95: {
//       gradeId: 2,
//       gradeName: 'P-95',
//       soldData: {
//         dollarsValue: '',
//         litersValue: '',
//         closingDateTime: '',
//       },
//     },
//     DIS: {
//       gradeId: 3,
//       gradeName: 'DIS',
//       soldData: {
//         dollarsValue: 1176,
//         litersValue: 605,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//   },
//   {
//     pumpId: 10,
//     pumpName: 'PUMP 10',

//     ULP: {
//       gradeId: 1,
//       gradeName: 'ULP',
//       soldData: {
//         dollarsValue: '',
//         litersValue: '',
//         closingDateTime: '',
//       },
//     },
//     P95: {
//       gradeId: 2,
//       gradeName: 'P-95',
//       soldData: {
//         dollarsValue: '',
//         litersValue: '',
//         closingDateTime: '',
//       },
//     },
//     DIS: {
//       gradeId: 3,
//       gradeName: 'DIS',
//       soldData: {
//         dollarsValue: 947,
//         litersValue: 474,
//         closingDateTime: '2022-10-11T00:00:00.000Z',
//       },
//     },
//   },
// ];
