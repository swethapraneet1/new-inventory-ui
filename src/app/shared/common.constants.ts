import { Grade,Site } from './common.model';
export const grade: Grade[] = [
    { gradeId: '1', gradeName: 'grade1' },
    { gradeId: '2', gradeName: 'grade2' },
    { gradeId: '3', gradeName: 'grade3' },
]
export const site: Site[] = [
    { siteId: '1', siteName: 'site' },
    { siteId: '2', siteName: 'site2' },
    { siteId: '3', siteName: 'site3' },
]
export interface deliveryUpdate {
    grade : Grade[],
    sites: Site[],
    doctType:number,
    timeStamp:string,
    amount:number,
    company:string;


}