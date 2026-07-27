import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1. Retrieve JWT string from local storage
    const token = localStorage.getItem('token'); 

    let clonedReq = req;

    // 2 & 3. If token is present, clone request and add Authorization header
    if (token) {
      clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 4. Handle request and catch errors (401, 404)
    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Redirect to login page on unauthorized error
          this.router.navigate(['/login']);
        } else if (error.status === 404) {
          // Redirect to not found page on 404 error
          this.router.navigate(['/not-found']);
        }
        return throwError(() => error);
      })
    );
  }
}