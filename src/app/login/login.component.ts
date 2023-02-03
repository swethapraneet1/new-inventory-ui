import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../_services';

import { Store } from '@ngrx/store';
import { AppAction } from '../app.action';
import { getUserDetails } from '../app.selectors';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { SaveDailogBoxComponent } from '../save-dailog-box/save-dailog-box.component';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() isAuth = new EventEmitter<boolean>();
  model: any = {};
  isValidating = false;
  returnUrl: string;
  isLoading = false;
  // isloading = true;
  // isAuthenticated = false;
  selectedOption: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private store: Store,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // this.authenticationService.logout();
    this.model.username = '';
    this.model.password = '';
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'loading';
    // this.isloading = false;
    // this.isAuthenticated =  false;
  }

  login() {
    this.isLoading = true;
    this.store.dispatch(AppAction.getUserDetails({ user: this.model }));
    this.isValidating = true;
    // this.isloading = true
    this.authenticationService.login(this.model).subscribe(
      () => {
        // this.isAuthenticated =  true;
        this.isLoading = false;
       // console.log(' next action here ... ');
        // const userData = JSON.parse(localStorage.getItem('FUEL_INVENTORY'));
        // console.log('user-login', userData);
        // if (userData && userData.token) {
        //   this.store.dispatch(AppAction.getSitesDropdown());
        //  // this.store.dispatch(AppAction.getTotalGrades());
        // }
      },
      (error) => {
        console.log(error);
        this.isValidating = false;
        const dialogRef = this.dialog.open(SaveDailogBoxComponent, {
          maxWidth: '400px',
          data: { name: 'Incorrect username or password ' },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          location.reload();
          // (this.form.get('products') as FormArray).clear();
          // this.formRest();
        });
        
      },
      () => {
        this.isValidating = false;
        console.log('login ' + this.returnUrl);
        this.isAuth.emit(true);
        this.router.navigate([this.returnUrl]);
      }
    );
  }
  ngOnDestroy() {
    this.isLoading = false;
  }
}
