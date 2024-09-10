import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ServiciosService } from '../../../servicios/servicios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-azul',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './azul.component.html',
  styleUrl: '../navbar.component.css'
})
export class AzulComponent  implements OnInit{
  activa:string='inicio';
  @Input() widthC: number | undefined;
  @Input() cap: number | undefined;
  mail:string="";
  pass:string="";
  type:string="password";
  User:string="";

  constructor(private router: Router, public api: ServiciosService){ }

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      let dato={
        'token': localStorage.getItem('token'),
        'tipo': 1
      }
      this.api.checkToken(dato).subscribe({
        next: (value:any) => {
          if (value.ok) {
            localStorage.setItem('token',value.token);
            this.User=value.nombre;
          }else{
            localStorage.removeItem('token')
          }
        },
        error(err:any) {
          localStorage.removeItem('token')
        },		
      });
    }
  }

  activar(tab:string){
    this.activa=tab;
  }

  login(){
    if(this.pass==""){
      Swal.fire({title:'Ingrese una contraseña', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      return;
    }
    let datos={
      "mail":this.mail,
      "pass":this.pass
    }
    this.api.login(datos).subscribe({
      next: (value:any)=> {
        localStorage.setItem('token',value.token);
        this.User=value.user;
        if (value.ok) {
          
        }else{
          if(!value.validado) {
            Swal.fire({title:'Revise su correo electronico', text:"Hemos enviado un mail de verificacion al correo: "+value.mail, confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          }else if(!value.habilitado) {
            Swal.fire({title:'Cuenta deshabilitada', text:"Su cuenta debe ser habilitada por un administrador", confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          }
        }
      },
      error(err:any) {
        Swal.fire({title:'Ocurrio un error',text:err.error.msg, confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },		
    });
  }

  logout(){
    localStorage.removeItem('token');
    window.location.reload();
  }
}
