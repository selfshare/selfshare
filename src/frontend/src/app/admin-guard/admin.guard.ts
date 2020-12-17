import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {SecurityService} from '../service/security/security.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private securityService: SecurityService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (state.url === '/login') {
      return this.checkNotLoggedIn();
    } else {
      return this.checkLoggedIn();
    }

  }

  private checkNotLoggedIn(): any | UrlTree {
    return this.securityService.authenticate().pipe(map(response => {
      if (response.code === 200) {
        return this.router.parseUrl('/dashboard');
      } else {
        return true;
      }
    }));
  }


  private checkLoggedIn(): any | UrlTree {
      return this.securityService.authenticate().pipe(map(response => {
        if (response.code === 200) {
          return true;
        } else {
          return this.router.parseUrl('/login');
        }
      }));
  }
}
