import { createAction, props } from '@ngrx/store';
interface ErrorResponse {
    status: number;
    error: Error;
    headers: any;
  };
export const setSiteSelection = createAction(
  '[app][site][set] Set Site Id',
  props<{ siteId: number }>()
);
export const getSitesDropdown = createAction(
  '[app][site][get] Get the site dropdown'
);
export const getSitesDropdownSuccess = createAction(
  '[app][site][get] Get the site dropdown success',
  props<{ dropdown: any }>()
);
export const getSitesDropdownError = createAction(
  'app][site][get] Get the site dropdown failure',
  props<{ error: ErrorResponse[] }>()
);

export const AppAction = { setSiteSelection, getSitesDropdown, getSitesDropdownSuccess, getSitesDropdownError };
