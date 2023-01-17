import { createAction, props } from '@ngrx/store';
import { User } from '../app/_models/user';
interface ErrorResponse {
  status: number;
  error: Error;
  headers: any;
}
export const setSiteSelection = createAction(
  '[app][site][set] Set Site Id',
  props<{ siteId: any }>()
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
export const getGradeDropDown = createAction(
  '[app][site][grade] Get the Grade dropdown',
  props<{ siteId: any }>()
);
export const getGradeDropdownSuccess = createAction(
  '[app][site][get] Get the Grade dropdown success',
  props<{ gradeDropdown: any }>()
);
export const getGradeDropdownError = createAction(
  '[app][site][get] Get the Grade dropdown failure',
  props<{ error: ErrorResponse[] }>()
);
export const getUserDetails = createAction(
  '[app][user][getUserDetails] Get the GetUserDetails ',
  props<{ user: any }>()

);
export const getUserDetailsSuccess = createAction(
  '[app][user][getUserDetails] Get the GetUserDetails success',
  props<{ user: {} }>()

);
export const getUserDetailsError = createAction(
  '[app][user][getUserDetails] Get the  GetUserDetails failure',
  props<{ error: ErrorResponse[] }>()
);
export const AppAction = {
  setSiteSelection,
  getSitesDropdown,
  getSitesDropdownSuccess,
  getSitesDropdownError,
  getGradeDropDown,
  getGradeDropdownSuccess,
  getGradeDropdownError,
  getUserDetails,
  getUserDetailsSuccess,
  getUserDetailsError
};
