import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosService } from '../../servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-pass',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-pass.component.html',
  styleUrl: '../logreg/datos-acceso/datos-acceso.component.css'
})
export class CambiarPassComponent{
  verificado:boolean|null=null;
  token:string|null=null;
  pass1:string="";
  pass2:string="";
  type:string="password";
  alertas:string="";

  constructor(public ruta:ActivatedRoute, public api: ServiciosService, private router: Router){ }

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
          if(value.ok) {
            //Swal.fire({title:'Contraseña cambiada con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            Swal.fire({
              title: "Contraseña cambiada con exito",
              showCancelButton: false,
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#3083dc",
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/']);                
              }
            });
          }
          if(!value.ok) {
            //Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            Swal.fire({
              title: "Ocurrio un error",
              showCancelButton: false,
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#3083dc",
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/']);
              }
            });
          }
        },
        error(err:any) {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
        },		
      });
    }
  }
}