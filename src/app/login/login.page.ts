import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {CodeEnum} from "../enum/code.enum";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    constructor(
        private _authService: AuthService,
        private _router: Router,
    ) {
    }

    ngOnInit() {
    }

    submit() {
        // this._authService.login('["huanan_admin","abc123","c187088ba879ce65b3db85810331ef4f"]').subscribe(res =>{
        //     if (res.code === CodeEnum.SUCCESS) {
        //         // 登录成功，跳转
        //     }
        //     console.log(res);
        // });
        this._router.navigateByUrl('/tabs');

    }

}
