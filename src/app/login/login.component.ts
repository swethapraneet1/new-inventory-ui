import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../_services';

import { Store } from '@ngrx/store';
import { AppAction } from '../app.action';
import { getUserDetails } from '../app.selectors';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
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
  // isloading = true;
  // isAuthenticated = false;
  selectedOption: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private store: Store
  ) {}

  ngOnInit() {
    // this.authenticationService.logout();
    this.model.username = 'karthik';
    this.model.password = 'karthik';
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'loading';
    // this.isloading = false;
    // this.isAuthenticated =  false;
  }

  login() {
    this.store.dispatch(AppAction.getUserDetails({ user: this.model }));
    this.isValidating = true;
    // this.isloading = true
    this.authenticationService.login(this.model).subscribe(
      () => {
        // this.isAuthenticated =  true;
        console.log(' next action here ... ');
        const userData = JSON.parse(localStorage.getItem('FUEL_INVENTORY'));
        console.log('user', userData);
        if (userData && userData.token) {
          this.store.dispatch(AppAction.getSitesDropdown());
         // this.store.dispatch(AppAction.getTotalGrades());
        }
      },
      (error) => {
        console.log(error);
        this.isValidating = false;
      },
      () => {
        this.isValidating = false;
        console.log('login ' + this.returnUrl);
        this.isAuth.emit(true);
        this.router.navigate([this.returnUrl]);
      }
    );
  }
}
