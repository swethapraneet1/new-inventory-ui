import { createReducer, on } from '@ngrx/store';
import { AppAction } from './app.action';

interface AppState {

  siteId: string;
}

const initialState: AppState = {
  siteId: '1'
};

export const appReducer = createReducer(
  initialState,
  on(AppAction.setSiteSelection, (state, {siteId}) => ({
    ...state,
    siteId,
  })),
);

/**
 * Convert roles array to permission object
 * @example [{ role: 'Routing-read' }, { role: 'Alarms-write' }, { role: 'Alarms-read' }] =>
 *   { Routing: { read: true }, Alarms: { read: true, write: true }}
 */

