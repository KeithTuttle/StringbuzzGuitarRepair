"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pin = exports.User = exports.UserWithErrorMessage = void 0;
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
        this.username = "";
        this.pins = [];
    }
}
exports.User = User;
class Pin {
    constructor() {
        this.name = "";
        this.long = 0;
        this.lat = 0;
        this.description = "";
    }
}
exports.Pin = Pin;
//# sourceMappingURL=UserWithErrorMesage.js.map