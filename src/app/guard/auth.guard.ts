import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ServiciosService } from '../servicios/servicios.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {
  constructor(private api: ServiciosService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if(!localStorage.getItem('token')) {
      this.router.navigate(['/']);    
      return false
    }
    let datos={
      'token': localStorage.getItem('token'),
      'tipo': 3
    }
    this.api.checkTokenA(datos).subscribe({
      next: (value)=>{
        this.api.setUserAdmin(value.user);        
        return value.ok;
      },
      error: (err)=>{
        this.router.navigate(['/']);
        return false;
      }
    })
  }
}