import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../../servicios/servicios.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favoritos.component.html',
  styleUrl: '../../panel-admin/usuarios/usuarios.component.css'
})
export class FavoritosComponent implements OnInit{
  Favoritos:any=[];

  constructor(public api:ServiciosService){}

  ngOnInit(): void {
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