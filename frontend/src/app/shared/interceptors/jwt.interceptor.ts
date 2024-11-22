import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {SessionService} from "../services/session.service";

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const sessionService = inject(SessionService);
  const isLogged = sessionService.isLogged;
  const token = sessionService.sessionInformation?.token;

  if (isLogged) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(request);
};
