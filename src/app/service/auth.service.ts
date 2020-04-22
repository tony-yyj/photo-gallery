import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {ResponseInterface} from "../interface/http.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private _http: HttpClient,
    ) {
    }

    public login(params: string): Observable<ResponseInterface<any>> {
        return this._http.post(environment.apiUrl + '/api/rest/post/userLoginUIService/loginApp', params, {
            responseType: 'json',
        }) as Observable<any>
    }
}
