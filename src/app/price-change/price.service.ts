import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Rx from 'rxjs/Rx';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfigService } from '../app.config.service';
interface grade {
  id: number;
  name: string;
}
let sampleJson = {
  siteId: 1,
  gradeId: 1,
  closingDateTime: '2023-01-30 07:14:34.234',
  dipsValue: 10000,
  pumps: [
    {
      pumpId: 1,
      literValue: 123,
      dollarValue: 131,
    },
    {
      pumpId: 2,
      literValue: 456,
      dollarValue: 789,
    },
    {
      pumpId: 3,
      literValue: 987,
      dollarValue: 654,
    },
  ],
};
let pumps = [
  {
    pumpId: 1,
    pumpName:'pump1',
    literValue: 123,
    dollarValue: 131,
  },
  {
    pumpId: 2,
    pumpName:'pump2',
    literValue: 456,
    dollarValue: 789,
  },
  {
    pumpId: 3,
    pumpName:'pump3',
    literValue: 987,
    dollarValue: 654,
  },
];
const grades: grade[] = [
  { id: 1, name: 'grade1' },
  { id: 2, name: 'grade2' },
  { id: 3, name: 'grade3' },
];
@Injectable({
  providedIn: 'root',
})
export class ApicallService {
  baseUrl: string;
  constructor(
    private httpClient: HttpClient,
    private appConfig: AppConfigService
  ) {
    this.baseUrl = appConfig.getBaseURL();
  }
  getGradeNames(site) {
    // getGradeNames(site): Observable<grade[]> { // enable on original url
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append(
      'X-RapidAPI-Key',
      '1108554cc1mshf11c17c4fea2b3dp179054jsn2446fb7a8965'
    );
    // return this.httpClient.post(this.baseUrl + `grade`+ `/` +site,  { headers })
    return this.httpClient
      .post(
        'https://reqres.in/api/posts',
        {
          name: 'morpheus',
          job: 'leader',
        },
        { headers }
      )
      .pipe(
        //  map((data: grade[]) => { //enable with original url
        map((data) => {
          //   return data;
          return grades;
        }),
        catchError((error) => {
          return throwError('Capital not found!');
        })
      );
  }
  getFormInput(site) {
    // getGradeNames(site): Observable<grade[]> { // enable on original url
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append(
      'X-RapidAPI-Key',
      '1108554cc1mshf11c17c4fea2b3dp179054jsn2446fb7a8965'
    );
    // return this.httpClient.post(this.baseUrl + `grade`+ `/` +site,  { headers })
    return this.httpClient
      .post(
        'https://reqres.in/api/posts',
        {
          name: 'morpheus',
          job: 'leader',
        },
        { headers }
      )
      .pipe(
        //  map((data: grade[]) => { //enable with original url
        map((data) => {
          //   return data;
          return pumps;
        }),
        catchError((error) => {
          return throwError('Capital not found!');
        })
      );
  }
  SaveForm(object) {
    // getGradeNames(site): Observable<grade[]> { // enable on original url
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append(
      'X-RapidAPI-Key',
      '1108554cc1mshf11c17c4fea2b3dp179054jsn2446fb7a8965'
    );
    // return this.httpClient.post(this.baseUrl + `grade`+ `/` +object,  { headers })
    return this.httpClient
      .post(
        'https://reqres.in/api/posts',
        {
          name: 'morpheus',
          job: 'leader',
        },
        { headers }
      )
      .pipe(
        //  map((data: grade[]) => { //enable with original url
        map((data) => {
          //   return data;
          console.log("priceservice",data)
          return data;
        }),
        catchError((error) => {
          return throwError('Capital not found!');
        })
      );
  }
}
