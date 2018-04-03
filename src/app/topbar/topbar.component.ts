import { Component, OnInit } from '@angular/core';
import { GrinotesAuthService } from './../grinotes-auth.service'
import { WebapiService } from './../webapi.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

    constructor(
        public grinotesAuthService: GrinotesAuthService,
        public webapi: WebapiService
    ) { }

    ngOnInit() {

    }

    login() {
        this.grinotesAuthService.login();
    }

    logout() {
        this.grinotesAuthService.logout();
    }

}
