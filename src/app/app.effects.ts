import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import { of } from 'rxjs';
import {Store} from '@ngrx/store';
import { AppAction } from './app.action';
import { BackendService  } from './_services';
@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private dashboardService: BackendService,  private store: Store) {}

  getSiteDropdown$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppAction.getSitesDropdown),
      switchMap(() =>
        this.dashboardService.getAllSites().pipe(
            //  map((data: grade[]) => { //enable with original url
            map((response) => {
              return response;
            }),

          map(({ response }) => AppAction.getSitesDropdownSuccess({ dropdown:response })),
          catchError(error => of(AppAction.getSitesDropdownError({ error })))
        )
      )
    )
  );

}
