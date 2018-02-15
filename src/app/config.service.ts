import { Injectable } from '@angular/core';

declare var $ :any;

@Injectable()
export class ConfigService {
    // define constants
    API_BASE_URL: string = "http://localhost/grinotes.com/src/api/";

    FACEBOOK_APP_ID: string = "398979010545997";

    // window dimensions
    public winHeight;
    public winWidth;

    constructor() {
        this.setWindowDimensions();
        $(window).on('resize', callbackFn => this.setWindowDimensions())
        //window.addEventListener('resize', this.setWindowDimensions);
    }

    // take the dimensions from "window"
    setWindowDimensions() {
        this.winHeight = window.innerHeight;
        this.winWidth = window.innerWidth;
    }

}
