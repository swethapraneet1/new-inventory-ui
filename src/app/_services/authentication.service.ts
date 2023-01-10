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


const APP_USER_PROFILE = 'NG_CRM_USER_2.0';
@Injectable()
export class AuthenticationService {
  selectedOption: string;
  sharedSiteData:string;
  constructor(
    private http: HttpClient,
    private backend: BackendService,
    private dialog: MatDialog
  ) {}

  login(user: any) {
    return this.backend.login('token', user).map((response: Response) => {
      console.log("auth",'response', response);
      // login successful if there's a token in the response
      let data = <any>response;
      let user = <User>data.user;
      console.log(data.access_token);
      if (user && data.access_token) {
        let dialogRef = this.dialog.open(DailogBoxComponent, {
          data: { name: user.firstname },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
          this.selectedOption = result;
          this.pageRedirection();
          // store user details and token in local storage to keep user logged in between page refreshes
          user.token = data.access_token;
          user.isAuthenticated = true;
          localStorage.setItem(APP_USER_PROFILE, JSON.stringify(user));
        });
      }
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(APP_USER_PROFILE);
  }

  isAuthenticated() {
    let user = this.getUser(); // <User>JSON.parse(localStorage.getItem(APP_USER_PROFILE));
    return user && user.isAuthenticated ? true : false;
  }

  getUser() {
    let user = <User>JSON.parse(localStorage.getItem(APP_USER_PROFILE));
    return user;
  }
  pageRedirection() {
    return this.selectedOption;
  }
  
  siteValue(){
    return this.sharedSiteData;

  }
}
