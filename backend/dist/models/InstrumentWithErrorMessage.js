"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instrument = exports.InstrumentWithErrorMessage = void 0;
class InstrumentWithErrorMessage {
    constructor(user, error) {
        this.instrument = null;
        this.error = "";
        this.instrument = user;
        this.error = error;
    }
}
exports.InstrumentWithErrorMessage = InstrumentWithErrorMessage;
class Instrument {
}
exports.Instrument = Instrument;
//# sourceMappingURL=InstrumentWithErrorMessage.js.map