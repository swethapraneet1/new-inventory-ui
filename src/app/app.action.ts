import { createAction, props } from '@ngrx/store';



export const setSiteSelection = createAction('[app][site][set] Set Site Id', props<{ siteId: string }>());

export const AppAction = {setSiteSelection };
