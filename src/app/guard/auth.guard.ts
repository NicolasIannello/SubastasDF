import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ServiciosService } from '../servicios/servicios.service';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {
  constructor(private api: ServiciosService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (isPlatformBrowser(this.platformId)) {
      if(!localStorage.getItem('token')) {
        this.router.navigate(['/']);    
        console.log('rerurn');
        return false;
      }
      let datos={
        'token': localStorage.getItem('token'),
        'tipo': 3
      }
      this.api.checkTokenA(datos).subscribe({
        next: (value)=>{
          this.api.setUserAdmin(value.user);        
          console.log('rerurn 1');
          return value.ok;
        },
        error: (err)=>{
          this.router.navigate(['/']);
          console.log('rerurn 2');
          return false;
        }
      })
    }
  }
}