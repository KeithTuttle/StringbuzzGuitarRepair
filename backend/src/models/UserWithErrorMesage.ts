export class UserWithErrorMessage{
    user: User | null = null;
    error: string = "";

    constructor(user: User | null, error: string) {
        this.user = user;
        this.error = error;
    }
}

export class User {
    username: string = "";
    pins: Array<Pin> = []
}

export class Pin {
    name: string = "";
    long: number = 0;
    lat: number = 0;
    description: string = "";
}
