import { Component, OnInit } from '@angular/core';
import { TwodoAuthService } from './../twodo-auth.service'
import { WebapiService } from './../webapi.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

    constructor(
        public twodoAuthService: TwodoAuthService,
        public webapi: WebapiService
    ) { }

    ngOnInit() {

    }

    login() {
        this.twodoAuthService.login();
    }

    logout() {
        this.twodoAuthService.logout();
    }

}
