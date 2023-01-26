import { Injectable, Injector } from '@angular/core';
import { Location } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { User } from '../_models';
import db from './demo.db';
import { AuthenticationService } from './authentication.service';
import {
  HttpClient,
  HttpRequest,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { AppConfigService } from '../app.config.service';
import { RestService } from './model.service';
const sitesApi = '/sites';
@Injectable()
export class BackendService {
  baseUrl: string;
  ds: any;
  authService: AuthenticationService;
  constructor(
    private http: HttpClient,
    private location: Location,
    private injector: Injector,
    private appConfig: AppConfigService,
    private restService: RestService
  ) {
    this.ds = Object.assign({}, db) || {};
    // console.log(this.ds);
    this.baseUrl = this.appConfig.getBaseURL();
    // console.log('baseURL', this.baseUrl);
  }
  ngOnInit() {
    this.authService = this.injector.get(AuthenticationService);
  }
  login(action: any, user: User) {
    return this.http.post(
      this.baseUrl + action,
      JSON.stringify(user),
      this.form()
    );
  }
  getAllSites() {
    return this.http.get(this.baseUrl + 'sites', this.jwt());
  }
  getAllGrades() {
    return this.http.get(this.baseUrl + 'grades', this.jwt());
    // return this.restService.get('/grades');
  }
  // Home page Table loading//
  getAllTableData(site) {
    let action = 'home/';
    return this.http.get(this.baseUrl + action + site, this.jwt());
  }
  getTabledataPost(site) {
    let action = 'home/';
    return this.http.get(this.baseUrl + action + site, this.jwt());
  }
  getGradeDropdown(site) {
    let action = 'grades/';
    return this.http.get(this.baseUrl + action + site + '/site', this.jwt());
  }
  getPumpDetails() {
    return this.http.get(this.baseUrl + 'pumps', this.jwt());
  }
  SaveForm(obj) {
    return this.http.post(this.baseUrl + 'pricechange', obj, this.jwt());
  }
  SaveFormClosingDay(obj) {
    return this.http.post(this.baseUrl + 'closingday', obj, this.jwt());
  }
  deliveryUpdateSave(action: string, data) {
    return this.http.post(this.baseUrl + 'deliveryupdate', data, this.jwt());
  }
  getGradeWisePumpDetails(grade, site) {
    let action = 'pumps/';
    return this.http.get(
      this.baseUrl + action + site + '/site/' + grade + '/grade',
      this.jwt()
    );
  }
  //private helper methods
  private form() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':
        'https://fuel-inventory-backend.onrender.com/api/v1/',
    });
    return { headers: headers };
  }
  getTableGradesHeaders(siteId) {
    let action = 'grades/names/';
    return this.http.get(this.baseUrl + action + siteId + '/site', this.jwt());
  }
  getSalesList(site){
    return  this.http.get(this.baseUrl + 'saledetails/' + site , this.jwt());
  }
  SaveSalesList(obj){
    return this.http.post(this.baseUrl + 'saledetails', obj, this.jwt());
  }
  private jwt() {
    // create authorization header with jwt token
    // let user = this.authService.getUser() //JSON.parse( );
    // if (user && user.token) {
    //   let headers = { 'Authorization': 'Bearer ' + user.token };
    //   return { headers } ;
    // }
    //  create authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('FUEL_INVENTORY'));
    if (user && user.token) {
      // let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
      // return new RequestOptions({ headers: headers });
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':
          'https://fuel-inventory-backend.onrender.com/api/v1/',
        Authorization: 'Bearer ' + user.token,
      });
      return { headers };
    }
  }

  // private handleError(error: Response) {
  //   console.error(error);
  //   return Observable.throw(error.json() || 'Server error');
  // }
}
