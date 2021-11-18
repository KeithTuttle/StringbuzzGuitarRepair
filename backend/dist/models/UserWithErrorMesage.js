"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserWithErrorMessage = void 0;
class UserWithErrorMessage {
    constructor(user, error) {
        this.user = null;
        this.error = "";
        this.user = user;
        this.error = error;
    }
}
exports.UserWithErrorMessage = UserWithErrorMessage;
class User {
    constructor() {
        this.email = "";
        this.firstName = "";
        this.lastName = "";
    }
}
exports.User = User;
//# sourceMappingURL=UserWithErrorMesage.js.map