import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../servicios/token.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard {
  realRole: string[] = [];
  constructor(private tokenService: TokenService, private router: Router) { }
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole: string[] = next.data["expectedRole"];
    this.realRole = this.tokenService.getRole();
    if (!this.tokenService.isLogged() || !expectedRole.some(r => this.realRole.includes(r))) {
      this.router.navigate(["/gestion_aulas"]);
      return false;
    }
    return true;
  }
}