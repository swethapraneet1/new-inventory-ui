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
import 'rxjs/add/operator/finally';
import { Observable, Subscription } from 'rxjs';
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
  isLoading: boolean;
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
  date = new Date();
  grades: string[] = [];
  dataSource =[];
  subs: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private backendService: BackendService,
    public authService: AuthenticationService,
    private store: Store,
    private homeApiService: HomeApicallService
  ) {
     this.subs.push(
      this.store.select(selectSiteId).subscribe((siteId) => {
        this.site = siteId;
        console.log('home', this.site);
        this.getTableData();
        this.getTableHeaderValues()
  
      }),
     )
  }

  ngOnInit(): void {
    //let val = this.authService.siteValue()
    // this.getTableData();
    this.getTableHeaderValues()
    //this.getTableData();
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
    this.backendService.getAllTableData(this.site).finally(() => this.isLoading = false).subscribe(
      (response: any) => {
     this.dataSource = response;
      },
      (error) => (this.errorMessage = error as any)
    );
  }
  getTableDatapost() { // this method is used when ther is more info icon need to fetch data using this method
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
  getTableHeaderValues(){
    if (this.site) {
     return  this.backendService
        .getTableGradesHeaders(this.site).finally(() => this.isLoading = false)
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
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
