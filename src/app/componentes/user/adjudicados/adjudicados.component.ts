import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServiciosService } from '../../../servicios/servicios.service';
import { AtrasComponent } from "../../atras/atras.component";

@Component({
  selector: 'app-adjudicados',
  standalone: true,
  imports: [CommonModule, RouterModule, AtrasComponent],
  templateUrl: './adjudicados.component.html',
  styleUrl: '../../panel-admin/usuarios/usuarios.component.css'
})
export class AdjudicadosComponent implements OnInit{
  Adjudicados:any=[];

  constructor(public api:ServiciosService, @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      let dato={
        "token":localStorage.getItem('token'),
        "tipo":1,
      }
      this.api.getAdjudicados(dato).subscribe({
        next:(value)=> {        
          if(value.ok) this.Adjudicados=value.adjudicadosDB;        
        },
        error:(err)=> {
        },
      })
    }
  }
}