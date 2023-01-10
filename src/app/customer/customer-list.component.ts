import { Component, OnInit, ViewChild } from '@angular/core';

import { Customer } from './customer';
import { CustomerService } from './customer.service';
import { PagerService } from '../_services';
import { ConfirmDialog } from '../shared';
import * as _ from 'lodash';

import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { PumpInfoDailogComponent } from '../pump-info-dailog/pump-info-dailog.component';

const json = [{
    'name':'pump1',
     'liters':'100L',
     'price':'$200',
     'date':'20-12-2022'
},
{
    'name':'pump1',
     'liters':'50L',
     'price':'$600',
     'date':'20-12-2022'

},
{
    'name':'pump3',
     'liters':'80L',
     'price':'$700',
     'date':'20-12-2022'
}];


@Component({
    selector: 'customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css'],
    providers: [ConfirmDialog]
})
export class CustomerListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    pageTitle = 'HOME';
    imageWidth = 30;
    imageMargin = 2;
    showImage = false;
    listFilter: any = {};
    errorMessage: string;

    customers: Customer[];
    customerList: Customer[]; //
    displayedColumns = ['avatar', 'firstname', 'lastname', 'rewards', 'email', 'membership', 'id'];
    dataSource: any = null;
    dummydata:any;
    pager: any = {};
    pagedItems: any[];
    searchFilter: any = {
        firstname: '',
        lastname: '',
        email: ''
    };
    selectedOption: string;


    constructor(
        private customerService: CustomerService,
        // private pagerService: PagerService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar) {
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    freshDataList(customers: Customer[]) {
        this.customers = customers;

        this.dataSource = new MatTableDataSource(this.customers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
        const val =[{
            
        }]
        this.dummydata =[{
        "pump":'pump0',
        "liters":'10L',
        "Price":'$200'
        }]
        this.customerService.getCustomers()
            .subscribe(customers => {
                this.freshDataList(customers);
            },
            error => this.errorMessage = ( error as any));

        this.searchFilter = {};
        this.listFilter = {};
    }

    getCustomers(pageNum?: number) {
        this.customerService.getCustomers()
            .subscribe(customers => {
                this.freshDataList(customers);
            },
            error => this.errorMessage = ( error as any));
    }

    searchCustomers(filters: any) {
        if (filters) {
            this.customerService.getCustomers()
                .subscribe(customers => {
                    this.customers = customers;
                    console.log(this.customers.length);
                    this.customers = this.customers.filter((customer: Customer) => {
                        let match = true;

                        Object.keys(filters).forEach((k) => {
                            match = match && filters[k] ?
                                customer[k].toLocaleLowerCase().indexOf(filters[k].toLocaleLowerCase()) > -1 : match;
                        });
                        return match;
                    });
                    this.freshDataList(customers);
                },
                error => this.errorMessage = ( error as any));
        }

    }

    resetListFilter() {
        this.listFilter = {};
        this.getCustomers();
    }

    reset() {
        this.listFilter = {};
        this.searchFilter = {};
        this.getCustomers();

    }

    resetSearchFilter(searchPanel: any) {
        searchPanel.toggle();
        this.searchFilter = {};
        this.getCustomers();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 1500,
        });
    }

    openDialog(id: number) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = {
            top: '50',
            left: '50'
        };
        const dialogRef = this.dialog.open(PumpInfoDailogComponent,
           
             { data:{data:json} });
        dialogRef.disableClose = true;

        // dialogRef.config()
        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;

            // if (this.selectedOption === dialogRef.componentInstance.ACTION_CONFIRM) {
            //     this.customerService.deleteCustomer(id).subscribe(
            //         () => {
            //             this.customerService.getCustomers()
            //                 .subscribe(customers => {
            //                     this.freshDataList(customers);
            //                 },
            //                 error => this.errorMessage = <any>error);
            //             this.openSnackBar("The item has been deleted successfully. ", "Close");
            //         },
            //         (error: any) => {
            //             this.errorMessage = <any>error;
            //             console.log(this.errorMessage);
            //             this.openSnackBar("This item has not been deleted successfully. Please try again.", "Close");
            //         }
            //     );
            // }
        });
    }



}
