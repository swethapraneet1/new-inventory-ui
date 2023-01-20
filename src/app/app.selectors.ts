import { createSelector } from '@ngrx/store';



export const selectApp = state => state.app;
export const selectSiteId = createSelector(
  selectApp,
  state => state.siteId
);
export const getSiteDropdwon = createSelector(
  selectApp,
  state => state.dropdown

);
export const getGradeDropdwon = createSelector(
  selectApp,
  state => state.gradeDropdown

);
export const getUserDetails = createSelector(
  selectApp,
  state => state.user

);
export const getTotalGrades = createSelector(
  selectApp,
  state => state.grades

);
