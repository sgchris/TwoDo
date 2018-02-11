import { Component, OnInit } from '@angular/core';
import { TwodoAuthService } from './../twodo-auth.service'

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

    constructor(public twodoAuthService: TwodoAuthService) { }

    ngOnInit() {

    }

    login() {
        this.twodoAuthService.login();
    }

    logout() {
        this.twodoAuthService.logout();
    }

}
