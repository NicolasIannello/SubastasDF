import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ServiciosService } from '../../../servicios/servicios.service';
import { RouterModule } from '@angular/router';
import { AtrasComponent } from "../../atras/atras.component";

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterModule, AtrasComponent],
  templateUrl: './favoritos.component.html',
  styleUrl: '../../panel-admin/usuarios/usuarios.component.css'
})
export class FavoritosComponent implements OnInit{
  Favoritos:any=[];

  constructor(public api:ServiciosService, @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      let dato={
        "token":localStorage.getItem('token'),
        "tipo":1,
      }
      this.api.getFavoritos(dato).subscribe({
        next:(value)=> {
          if(value.ok) this.Favoritos=value.favoritoDB; 
        },
        error:(err)=> {
        },
      })
    }
  }

}