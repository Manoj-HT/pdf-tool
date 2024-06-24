import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  let cleanUrl = req.url == "/login" || req.url =="/config.json" || req.url == "/create-user"
  let storage = inject(LocalStorageService)
  if(cleanUrl){
    return next(req);
  }
  let token = storage.getToken();
  req = req.clone({
    setHeaders : {
      "Authorization" : `Bearer ${token}`
    }
  })
  return next(req)
};
