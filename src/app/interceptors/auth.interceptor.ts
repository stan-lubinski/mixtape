import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authService = inject(AuthService);

  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem('access_token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if (err.status === 401) {
          return this.handle401(request, next, token);
        }
        throw err;
      })
    );
  }

  handle401(
    request: HttpRequest<any>,
    next: HttpHandler,
    token: string | null
  ) {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (token) {
      return this.authService.refreshAccessToken(code!).pipe(
        switchMap((res) => {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${res.access_token}`,
            },
          });
          return next.handle(request);
        })
      );
      // .subscribe((res) => {
      //   request = request.clone({
      //     setHeaders: {
      //       Authorization: `Bearer ${res.access_token}`,
      //     },
      //   });
      //   return next.handle(request);
      // });
    } else {
      return this.authService.getAccessToken(environment.client_id, code!).pipe(
        switchMap((res) => {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${res.access_token}`,
            },
          });
          return next.handle(request);
        })
      );
      // .subscribe((res) => {
      //   request = request.clone({
      //     setHeaders: {
      //       Authorization: `Bearer ${res.access_token}`,
      //     },
      //   });
      //   return next.handle(request);
      // });
    }

    // return next.handle(request);
  }
}
