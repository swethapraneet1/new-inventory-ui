import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { User } from '../_models';
import { BackendService } from './backend.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { DailogBoxComponent } from '../dailog-box/dailog-box.component';
import { Store } from '@ngrx/store';
import { AppAction } from '../app.action';
import { getUserDetails, selectSiteId } from '../app.selectors';

// const APP_USER_PROFILE = 'NG_CRM_USER_2.0';
const APP_USER_PROFILE = 'FUEL_INVENTORY';
@Injectable()
export class AuthenticationService {
  selectedOption: string;
  sharedSiteData: string;
  constructor(
    private http: HttpClient,
    private backend: BackendService,
    private dialog: MatDialog,
    private store: Store
  ) {}

  login(user: any) {
    // return this.store.select(getUserDetails).map((users) => {
    //   if(users){
    //   let data = <any>users.res;
    //   const userData = {
    //     id: data.id,
    //     token: data.roles[0],
    //     username: data.username,
    //     firstname: data.username,
    //     email: data.email,
    //   };
    //   let user = <User>userData;
    //   // console.log('token', data.token);
    //   if (user && data.token) {
    //     let dialogRef = this.dialog.open(DailogBoxComponent, {
    //       data: { name: user.firstname },
    //     });
    //     dialogRef.disableClose = true;
    //     dialogRef.afterClosed().subscribe((result) => {
    //       this.selectedOption = result;
    //       this.pageRedirection();

    //       // store user details and token in local storage to keep user logged in between page refreshes
    //       user.token = data.token;
    //       user.isAuthenticated = true;
    //       localStorage.setItem(APP_USER_PROFILE, JSON.stringify(user));
    //       const userData = JSON.parse(localStorage.getItem('FUEL_INVENTORY'));
    //       if (userData && userData.token) {
    //         this.store.dispatch(AppAction.getSitesDropdown());
    //       }
    //     });
    //   }
    // }
    // });
    return this.backend.login('signin', user).map((response: Response) => {
      // console.log('auth', 'response', response);
      // login successful if there's a token in the response
      let data = <any>response;
      const userData = {
        id: data.id,
        token: data.roles[0],
        username: data.username,
        firstname: data.username,
        email: data.email,
      };
      let user = <User>userData;
      // console.log('token', data.token);
      if (user && data.token) {
        let dialogRef = this.dialog.open(DailogBoxComponent, {
          data: { name: user.firstname },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
          this.selectedOption = result;
          this.pageRedirection();
          // store user details and token in local storage to keep user logged in between page refreshes
          user.token = data.token;
          user.isAuthenticated = true;
          localStorage.setItem('FUEL_INVENTORY', JSON.stringify(user));
          sessionStorage.setItem('FUEL_INVENTORY', JSON.stringify(user));
          const userData = JSON.parse(localStorage.getItem('FUEL_INVENTORY'));
          console.log('authenticationuserdata', userData);
          if (userData && userData.token) {
            this.store.dispatch(AppAction.getSitesDropdown());
            this.store.dispatch(AppAction.getTotalGrades());
          }
        });
      }
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('FUEL_INVENTORY');
  }

  isAuthenticated() {
    let user = this.getUser(); // <User>JSON.parse(localStorage.getItem(APP_USER_PROFILE));
    if(user === null){
      this.store.select(selectSiteId).subscribe((user)=>{
      user = user;
      })
    }
    return user && user.isAuthenticated ? true : false;
  }

  getUser() {
    let user;
    user = <User>JSON.parse(localStorage.getItem('FUEL_INVENTORY'));
    if(user === null){
      this.store.select(selectSiteId).subscribe((user)=>{
      user = user;
      })
    }
    // console.log('auth',user);
    return user;
  }
  pageRedirection() {
    return this.selectedOption;
  }

  siteValue() {
    return this.sharedSiteData;
  }
}
