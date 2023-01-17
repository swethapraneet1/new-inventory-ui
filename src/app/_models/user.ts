/* Defines the User entity */
export class User {
    id: number;
    token: string;
    username: string;
    firstname: string;
    lastname: string;
    email:string;
    isAuthenticated: boolean;
    role:[]
}
