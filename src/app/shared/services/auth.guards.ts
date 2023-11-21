import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { Observable, of } from "rxjs";


export const canActivate: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuth()) {
    return of(true)
  } else {
    router.navigate(['auth'])
    return of(false)
  }

}

