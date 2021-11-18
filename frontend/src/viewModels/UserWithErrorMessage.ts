

export class UserWithErrorMessage{
    user: User | null = null;
    error: string = "";
}

export class User {
    email: string = "";
    firstName: string = "";
    lastName: string = "";
}