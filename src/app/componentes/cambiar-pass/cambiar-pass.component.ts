import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiciosService } from '../../servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-pass',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-pass.component.html',
  styleUrl: '../logreg/datos-emp/datos-emp.component.css'
})
export class CambiarPassComponent{
  verificado:boolean|null=null;
  token:string|null=null;
  pass1:string="";
  pass2:string="";
  type:string="password";
  alertas:string="";

  constructor(public ruta:ActivatedRoute, public api: ServiciosService){ }

  mostrar(){
    this.type = this.type=="password" ? "text" : "password";
  }
  cambiar(){
    this.alertas = this.pass1!=this.pass2 ? "Las contraseñas no coinciden" : "";
    if(this.pass2=="" || this.pass1=="") this.alertas="Complete los campos";
    if(this.alertas==""){
      this.token = this.ruta.snapshot.paramMap.get('token');    
      let dato={
        'token':this.token,
        "pass":this.pass1,
        'tipo':4
      }
      this.api.cambiarPass(dato).subscribe({
        next: (value:any) => {
          if(value.ok) Swal.fire({title:'Contraseña cambiada con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        },
        error(err:any) {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
        },		
      });
    }
  }
}