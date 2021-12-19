export class InstrumentWithErrorMessage{
    instrument: Instrument | null = null;
    error: string = "";

    constructor(user: Instrument | null, error: string) {
        this.instrument = user;
        this.error = error;
    }
}

export class Instrument {
    type: string;
    instrumentModel: string;
    color: string;
    year: string;
    hasCase: boolean;
    user: string;
    serialNum: string;
    image: any;
}
