import { Component, OnInit, Input } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PumpInfoDailogComponent } from '../pump-info-dailog/pump-info-dailog.component';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../_services';
import { getLocaleDateFormat } from '@angular/common';
import { AuthenticationService } from '../_services';
import { Store } from '@ngrx/store';
import { setSiteSelection } from '../../app/app.action';
import { selectSiteId,getSiteDropdwon,getUserDetails } from '../../app/app.selectors';
interface sites {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  @Input() viewValue: string;
  //code for dropdown =
  sites: sites[] = [
    { value: '1', viewValue: 'site1' },
    { value: '2', viewValue: 'site2' },
    { value: '3', viewValue: 'site3' },
  ];
  // selectedSites = this.sites[0].value;
  //end of code for sites dropdown
  //new code//
  name = 'Angular 5';
  displayedColumns = ['Title', 'grade1', 'grade2', 'grade3', 'id'];
  displayedColumns2 = ['liters', 'price'];
  displayedColumns3 = ['Rules'];
  errorMessage = '';
  responseData: [];
  site: string;
  // dataSource: any; enable when request with backend server
  date = new Date();

  dataSource = new MatTableDataSource<any>(ELEMENT_DATA); //disiable when request with backend server
  getdata(data) {
    return new MatTableDataSource<any>(data);
  }
  //end of new code//

  constructor(
    public dialog: MatDialog,
    private backendService: BackendService,
    public authService: AuthenticationService,
    private store: Store
  ) {}

  ngOnInit(): void {
    //let val = this.authService.siteValue()
   
    this.store.select(selectSiteId).subscribe((siteId) => {
      this.site = siteId;
      console.log('home', this.site);
    });
    this.store.select(getUserDetails).subscribe((user)=>{
      console.log('home',user)
    })
    this.getTableData();
    this.getTableDatapost();
  }
  getKeys(obj) {
    return Object.keys(obj);
  }
  toggleRow(element: { expanded: boolean }) {
    console.log('toggled', element);
    // Uncommnet to open only single row at once
    // ELEMENT_DATA.forEach(row => {
    //   row.expanded = false;
    // })
    element.expanded = !element.expanded;
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
    this.backendService.getAllTableData().subscribe(
      (response) => {
        //  this.dataSource = response; enable when make request from backend
      },
      (error) => (this.errorMessage = error as any)
    );
  }
  getTableDatapost() {
    let data = {
      site: this.site,
    };
    this.backendService.getTabledataPost('pumpData', data).subscribe(
      (response) => {
        console.log(response);
        // this.dataSource = response;
      },
      (error) => (this.errorMessage = error as any)
    );
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
            price: '$20',
            liters: '10lts',
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
            liters: '250lts',
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
            liters: '50lts',
          },
        ],
      },
    ],

    Title: 'PUMP1',
    pumpId: '1',
    pumpName: 'pump 1',
  },

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
            liters: '10lts',
          },
        ],
      },
      {
        gradeId: '2',
        gradeName: 'grade 2',
        differenceData: [
          {
            date: '22-12-2022',
            price: '$40',
            liters: '30lts',
          },
        ],
      },
      {
        gradeId: '3',
        gradeName: 'grade 3',
        differenceData: [
          {
            date: '22-12-2022',
            price: '$80',
            liters: '30lts',
          },
        ],
      },
    ],

    Title: 'PUMP2',
    pumpId: '1',
    pumpName: 'pump 2',
  },
  {
    Group: 1,
    grade: [
      {
        gradeId: '1',
        gradeName: 'grade 1',
        differenceData: [
          {
            date: '22-12-2022',
            price: '$60',
            liters: '80lts',
          },
        ],
      },
      {
        gradeId: '2',
        gradeName: 'grade 2',
        differenceData: [
          {
            date: '22-12-2022',
            price: '$20',
            liters: '20lts',
          },
        ],
      },
      {
        gradeId: '3',
        gradeName: 'grade 3',
        differenceData: [
          {
            date: '22-12-2022',
            price: '$60',
            liters: '10lts',
          },
        ],
      },
    ],

    Title: 'PUMP3',
    pumpId: '1',
    pumpName: 'pump 3',
  },
];
