import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import {SecurityService} from '../../service/security/security.service';

@Injectable({
  providedIn: 'root'
})
export class SetupGuard implements CanActivate {

  constructor(private securityService: SecurityService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkSettingsExist();
  }

  private checkSettingsExist(): any | UrlTree {
    return this.securityService.checkSetupAvailable().pipe(map(response => {
      console.log(response);
      if (response.code === 200 && response.body) {
        return true;
      } else {
        return this.router.parseUrl('/');
      }
    }));
  }

}
