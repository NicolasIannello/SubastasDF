import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../../servicios/servicios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-web',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './web.component.html',
  styleUrl: '../../logreg/datos-acceso/datos-acceso.component.css'
})
export class WebComponent implements OnInit{
  campos:Array<{id:number, texto:string, clase:boolean}>=[{id:-10,texto:"",clase:true},{id:-10,texto:"",clase:true},{id:-10,texto:"",clase:true},{id:-10,texto:"",clase:true}];
  campos2:Array<{id:number, texto:string}>=[{id:-10,texto:""},{id:-10,texto:""},{id:-10,texto:""},{id:-10,texto:""}];
  let:string="";
  
  constructor(public api:ServiciosService, public apiAdmin:AdminService) { }

  ngOnInit(): void {
    this.api.cargarWeb().subscribe({
      next:(value)=> {
        if(value.ok){
          for (let i = 0; i < value.datos.length; i++) {
            this.campos[i]= Object.assign( { }, value.datos[i])
            this.campos[i].texto= this.campos[i].texto.replace(/\\n/g, '\n');
            this.campos[i].clase=true;
            this.campos2[i]= Object.assign( { }, value.datos[i])
            this.campos2[i].texto= this.campos2[i].texto.replace(/\\n/g, '\n');
          }
        }
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }

  actualizar(id:number,id2:number){
    if(this.campos[id].texto==this.campos2[id].texto && this.campos[id2].texto==this.campos2[id2].texto){      
      Swal.fire({title:'Los datos no han cambiado', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      return;
    }

    let dato={
      'token':localStorage.getItem('token'),
      'tipo':1,
      'campo1':this.campos[id],
      'campo2':this.campos[id2]
    }
    this.apiAdmin.actualizarWeb(dato).subscribe({
      next:(value)=> {
          console.log(value);
          if(value.ok){
            Swal.fire({title:'Datos cambiados con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          }
      },
      error:(err)=> { 
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }
}
