import { Grade,Site } from './common.model';
export const grade: Grade[] = [
    { id: 1, name: 'grade1' },
    { id: 2, name: 'grade2' },
    { id: 3, name: 'grade3' },
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