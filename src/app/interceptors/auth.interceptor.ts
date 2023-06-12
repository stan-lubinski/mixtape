import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem('access_token');

    if (token && request.url.indexOf('token') === -1) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      // } else if (this.route.snapshot.queryParamMap.get('code')) {
      //   const code = this.route.snapshot.queryParamMap.get('code');
      //   const sub = this.authService.getAccessToken(environment.client_id, code!).subscribe(res => {
      //     request = request.clone({
      //         setHeaders: {
      //           Authorization: `Bearer ${res.access_token}`,
      //         },
      //       });
      //   })
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
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
      // localStorage.removeItem('access_token');

      return this.authService.refreshAccessToken().pipe(
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
    } else if (code) {
      return this.authService.getAccessToken(code!).pipe(
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
      return next.handle(request);
    }
  }
}
