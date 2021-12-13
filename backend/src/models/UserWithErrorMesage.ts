export class UserWithErrorMessage{
    user: User | null = null;
    error: string = "";

    constructor(user: User | null, error: string) {
        this.user = user;
        this.error = error;
    }
}

export class User {
    email: string = "";
    firstName: string = "";
    lastName: string = "";
}
