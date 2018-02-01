import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    // define constants
    API_BASE_URL: string = "http://localhost/TwoDo/src/api/";

    // window dimensions
    public winHeight;
    public winWidth;

    constructor() {
        this.setWindowDimensions();
        window.addEventListener('resize', this.setWindowDimensions);
    }

    // take the dimensions from "window"
    setWindowDimensions() {
        this.winHeight = window.innerHeight;
        this.winWidth = window.innerWidth;
    }

}
