import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable(
  
)
export class ErrorHandlerService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error=>{
      if(error.status===401)
      {return throwError(error.statusText);
      }
      const serverError=error.error;
      let modelStatusError='';
      if(serverError.errors&&typeof serverError.errors==='object' ){

      }
      return throwError(modelStatusError||serverError||'server Error');
    }));
  }
}
export  const  ErrorInterceptorProvider= {
  provide:HTTP_INTERCEPTORS,
  useClass:ErrorHandlerService,
  multi:true
};