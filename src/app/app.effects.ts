import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppAction } from './app.action';
import { BackendService } from './_services';
import { selectSiteId } from './app.selectors';
@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private dashboardService: BackendService,
    private store: Store
  ) {}

  getSiteDropdown$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppAction.getSitesDropdown),
      switchMap(() =>
        this.dashboardService.getAllSites().pipe(
          //  map((data: grade[]) => { //enable with original url
          map((response) => {
            return {
              res: response,
            };
          }),

          // map(({ res }) => AppAction.getSitesDropdownSuccess({ dropdown:res })),
          map((res) => AppAction.getSitesDropdownSuccess({ dropdown: res })),
          catchError((error) => of(AppAction.getSitesDropdownError({ error })))
        )
      )
    )
  );
  getGradeDropdown$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppAction.getGradeDropDown),
      withLatestFrom(this.store.select(selectSiteId)),
      switchMap(([action, siteId]) =>
        this.dashboardService.getGradeDropdown(action.siteId).pipe(
          //  map((data: grade[]) => { //enable with original url
          map((response) => {
            return {
              res: response,
            };
          }),

          // map(({ res }) => AppAction.getSitesDropdownSuccess({ dropdown:res })),
          map((res) =>
            AppAction.getGradeDropdownSuccess({ gradeDropdown: res })
          ),
          catchError((error) => of(AppAction.getGradeDropdownError({ error })))
        )
      )
    )
  );
  getUserDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(AppAction.getUserDetails),
      switchMap((action) =>
        this.dashboardService.logins(action.user).pipe(
          //  map((data: grade[]) => { //enable with original url
          map((response) => {
            return {
              res: response,
            };
          }),

          // map(({ res }) => AppAction.getSitesDropdownSuccess({ dropdown:res })),
          map((res) => AppAction.getUserDetailsSuccess({ user: res })),
          catchError((error) => of(AppAction.getUserDetailsError({ error })))
        )
      )
    )
  );
  getTotalGrades$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppAction.getTotalGrades),
      switchMap(() =>
        this.dashboardService.getAllGrades().pipe(
          map((response) => {
            return {
              res: response,
            };
          }),
          map((res) => AppAction.getTotalGradesSuccess({ grades: res })),
          catchError((error) => of(AppAction.getTotalGradesError({ error })))
        )
      )
    )
  );
}
