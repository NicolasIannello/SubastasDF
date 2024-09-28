import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CrearLoteComponent } from "./crear-lote/crear-lote.component";
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { VerLoteComponent } from "./ver-lote/ver-lote.component";

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule, CrearLoteComponent, VerLoteComponent],
  templateUrl: './lotes.component.html',
  styleUrl: '../usuarios/usuarios.component.css'
})
export class LotesComponent implements OnInit{
  crear:boolean=false;
  ver:boolean=false;
  error:boolean=false;
  Lotes:Array<any>=[];
  total:number=0;
  pagina:number=0;
  ordenar:string="_id";
  orden:string="1";
  loteModal:Array<any>=[];
  @ViewChild(VerLoteComponent)verComp!:VerLoteComponent;

  constructor(public api:AdminService) {}

  ngOnInit(): void {
    this.cargarLotes();
  }

  handleMessage(message: boolean, tipo:string) {    
    switch (tipo) {
      case 'crear': 
        this.crear=message;
        this.cargarLotes(); 
      break;
      case 'ver': 
        this.ver=message;
        this.loteModal=[];
      break;
    }
  }

  cargarLotes(){
    let datos={
      'token':localStorage.getItem('token'),
      'tipo':1
    }
    this.api.cargarLotes(datos,this.pagina*20,this.ordenar,this.orden).subscribe({
      next:(value)=> {
          if(value.ok) {
            this.Lotes=value.lotes;
            this.total=value.total;
          }else{
            this.error=true;
          }
      },
      error:(err)=> {
        this.error=true;
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }

  verLote(id:string){
    this.ver=!this.ver;
    let datos={
      'uuid':id,
      'token':localStorage.getItem('token'),
      'tipo':1
    }
    this.api.cargarLote(datos).subscribe({
      next:(value)=> {
        this.loteModal=value.lote[0];
        this.verComp.cargarImagenes(value.lote[0].img, value.lote[0].pdf);
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }
}
