import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../_services';

import { Store } from '@ngrx/store';
import { AppAction } from '../app.action';
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
    private store:Store
  
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
    
    this.isValidating = true;
    // this.isloading = true;
    this.authenticationService.login(this.model).subscribe(
      () => {
        // this.isAuthenticated =  true;
        console.log(' next action here ... ');
        const userData = JSON.parse(localStorage.getItem('FUEL_INVENTORY'));
        if (userData && userData.token) {
          this.store.dispatch(AppAction.getSitesDropdown());
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
