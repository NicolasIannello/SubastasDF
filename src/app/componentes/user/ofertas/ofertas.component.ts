import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../../servicios/servicios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ofertas.component.html',
  styleUrl: '../../panel-admin/usuarios/usuarios.component.css'
})
export class OfertasComponent implements OnInit{
  Ofertas:any=[];
  pagina:number=0;
  pagU:number=0;
  index:number=0;

  constructor(public api:ServiciosService){}

  ngOnInit(): void {
    let dato={
      "token":localStorage.getItem('token'),
      "tipo":1,
    }
    this.api.getOfertas(dato).subscribe({
      next:(value)=> {
        if(value.ok) this.Ofertas=value.ofertaDB;
        this.pagU=Math.ceil(this.Ofertas.length/20)
      },
      error:(err)=> {
      },
    })
  }

  principio(){
    this.pagina=0;
    this.index=0
  }
  atras(){
    if(this.pagina>0){
      this.pagina--;
      this.index-=20;
    }
  }
  siguiente(){    
    if(this.pagina<this.pagU-1){
      this.pagina++;
      this.index+=20;
    }
  }
  final(){
    this.pagina=this.pagU-1
    this.index=(this.pagU-1)*20;
  }
}