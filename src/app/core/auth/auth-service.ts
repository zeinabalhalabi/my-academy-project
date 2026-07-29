import { Injectable, inject} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { catchError, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

export type UserRole = 'user' | 'admin';

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    userRole: UserRole;
    //password: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private cookieService = inject(CookieService);
    private http = inject(HttpClient);
    private router = inject(Router);

    private tokenKey = 'auth_token';
    currentUser: IUser | undefined;
    
    constructor(){
        this.restoreSession();
    }
    getToken(): string {
        return this.cookieService.get(this.tokenKey);
    }
    setToken(token: string): void {
        this.cookieService.set(this.tokenKey, token, {path : '/', expires: 7});
    }
    //token decoding functionality
    
    private decodeAndSetUser(token: string): void {
        try {
            // Decodes the payload payload portion of a standard JWT
            const payload = token.split('.')[1];
            const decodedJson = atob(payload); 
            this.currentUser = JSON.parse(decodedJson);
        } catch (e) {
            console.error('Failed to decode token');
            this.currentUser = undefined;
        }
    }
    //restores user state on page refresh
    private restoreSession(): void {
        const token = this.getToken();
        if (token) {
            this.decodeAndSetUser(token);
        }
    }

    
    register(payload: IUser): Observable<IUser> {
        return this.http.post<IUser>(
            'http://localhost:4000/api/auth/register', payload);
    }
    authentication(
        email: string,
        password: string
    ): Observable <string | undefined > {
        return this.http
        .post<{token: string}>(
            'http://localhost:4000/api/auth/login',
            { email, password }
        ).pipe(
           tap((res) => {
                    if (!res.token) return;
                    this.setToken(res.token);
                    this.router.navigate(['/']);
                }),
                map((res) => res.token),
                catchError((error) => throwError(() => error)) 
        );
    }

    fetchUserProfile(): Observable<IUser> {
        
        return this.http.get<IUser>('http://localhost:4000/api/user').pipe(
            tap((user) => {
                this.currentUser = user;
            }),
            catchError((err) => {
                this.logout();
                return throwError(() => err);
            })
        );
    }
    isAuthenticated(): boolean{
        return !!this.getToken();
    }
    logout(): void {
        this.cookieService.delete(this.tokenKey, '/');
        this.currentUser = undefined;
        this.router.navigate(['/login']);
    }
}
