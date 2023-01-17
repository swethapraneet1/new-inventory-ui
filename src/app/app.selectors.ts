import { createSelector } from '@ngrx/store';



export const selectApp = state => state.app;
export const selectSiteId = createSelector(
  selectApp,
  state => state.siteId
);
export const getSiteDropdwon = createSelector(
  selectApp,
  state=>state.dropdown

)
