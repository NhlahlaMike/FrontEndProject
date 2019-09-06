import { UserService } from './../shared/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private service: UserService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    // check if the user is logged in
    if (localStorage.getItem('token') != null) {
      // tslint:disable-next-line:no-string-literal
      // verify roles
      // const roles = next.data['permittedRoles'] as Array<string>;
      const roles = next.data.permittedRoles as Array<string>;
      if (roles) {
        if (this.service.roleMatch(roles)) { return true; } else {
          this.router.navigate(['/forbidden']);
          return false;
        }
      }
      return true;
    } else {
      this.router.navigate(['/user/login']);
      return false;
    }

  }
}
