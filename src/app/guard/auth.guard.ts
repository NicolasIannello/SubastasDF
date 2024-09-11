import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { ServiciosService } from '../servicios/servicios.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {
  constructor(private api: ServiciosService,) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if(!localStorage.getItem('token')) return false
    let datos={
      'token': localStorage.getItem('token'),
      'tipo': 3
    }
    this.api.checkTokenA(datos).subscribe({
      next: (value)=>{
        return value.ok;
      },
      error: (err)=>{
        return false;
      }
    })
  }
}