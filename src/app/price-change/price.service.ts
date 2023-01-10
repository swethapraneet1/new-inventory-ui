import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, } from '@angular/common/http';
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
interface grade {
    gradeId: string;
    gradeName: string;
  }
@Injectable({
  providedIn: 'root'
})

export class ApicallService {
  constructor(private httpClient: HttpClient) {}

  getGradeNames(): Observable<grade[]>{
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append(
      'X-RapidAPI-Key',
      '1108554cc1mshf11c17c4fea2b3dp179054jsn2446fb7a8965'
    );
    return this.httpClient.post('https://reqres.in/api/posts', {
        "name": "morpheus",
        "job": "leader"
    }, { headers })
      .pipe(
           map((data: grade[]) => {
             return data;
             console.log("price",data);
           }), catchError( error => {
             return throwError( 'Capital not found!' );
           })
        )
    }
}