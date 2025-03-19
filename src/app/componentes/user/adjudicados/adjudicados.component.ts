import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(public api:ServiciosService){}

  ngOnInit(): void {
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