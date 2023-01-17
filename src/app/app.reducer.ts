import { createReducer, on } from '@ngrx/store';
import { AppAction } from './app.action';

interface AppState {

 // siteId: number;
  dropdown: any;
}

const initialState: AppState = {
  //siteId: 1,
 dropdown:[]
};

export const appReducer = createReducer(
  initialState,
  on(AppAction.setSiteSelection, (state, {siteId}) => ({
    ...state,
    siteId,
  })),
  on(AppAction.getSitesDropdownSuccess, (state, { dropdown }) => ({
    ...state,
    dropdown,
    loading: false,
  })),
  on(AppAction.getSitesDropdownError, (state, error) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AppAction.getGradeDropdownSuccess, (state, { gradeDropdown }) => ({
    ...state,
    gradeDropdown,
    loading: false,
  })),
  on(AppAction.getGradeDropdownError, (state, error) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AppAction.getUserDetailsSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(AppAction.getGradeDropdownError, (state, error) => ({
    ...state,
    error,
    loading: false,
  })),
);

/**
 * Convert roles array to permission object
 * @example [{ role: 'Routing-read' }, { role: 'Alarms-write' }, { role: 'Alarms-read' }] =>
 *   { Routing: { read: true }, Alarms: { read: true, write: true }}
 */

