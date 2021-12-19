export class InstrumentWithErrorMessage{
    instrument: Instrument | null = null;
    error: string = "";
}

export class ImageFile{
    destination: string = "";
    encoding: string = "";
    fieldname: string = "";
    filename: string = "";
    mimetype: string = "";
    originalname: string = "";
    path: string = "";
    size: number = 0;
}

export class Instrument {
    image: ImageFile = new ImageFile();
    type: string = "";
    instrumentModel: string = "";
    color: string = "";
    year: number = 0;
    serialNum: string = "";
    hasCase: boolean = false;
    user: string = "";

    constructor(image: ImageFile, type: string, color: string, year: string, serialNum: string, hasCase: boolean, email: string){
        this.image = image;
        this.type = type;
        this.color = color;
        this.year = parseInt(year, 10);
        this.serialNum = serialNum;
        this.hasCase = hasCase;
        this.user = email;
    }
}