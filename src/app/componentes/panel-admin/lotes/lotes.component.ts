import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CrearLoteComponent } from "./crear-lote/crear-lote.component";
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule, CrearLoteComponent],
  templateUrl: './lotes.component.html',
  styleUrl: '../usuarios/usuarios.component.css'
})
export class LotesComponent implements OnInit{
  crear:boolean=false;
  error:boolean=false;
  Lotes:Array<any>=[];
  total:number=0;
  pagina:number=0;
  ordenar:string="_id";
  orden:string="1";

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
}
