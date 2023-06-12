import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.indexOf('token') === -1) {
      const baseUrl = environment.baseUrl;
      req = req.clone({ url: `${baseUrl}/${req.url}` });
      // return next.handle(apiReq);
    }
    console.log(req);

    return next.handle(req);
  }
}
