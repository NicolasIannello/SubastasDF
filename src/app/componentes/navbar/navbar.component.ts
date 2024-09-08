import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ServiciosService } from '../../servicios/servicios.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  activa:string='inicio';
  @Input() widthC: number | undefined;
  @Input() cap: number | undefined;
  menuOpen:boolean=false;
  menuOpen2:boolean=false;
  mail:string="";
  pass:string="";
  type:string="password";

  constructor(private router: Router, public api: ServiciosService){ }

  activar(tab:string){
    this.activa=tab;
    this.router.navigate(['/'+tab]);    
    this.menuOpen=false;
    this.menuOpen2=false;
  }

  open(){
    this.menuOpen=!this.menuOpen;
  }
  open2(){
    this.menuOpen2=!this.menuOpen2;
    this.activa= this.menuOpen2? "login" : '';
    this.mail=""; this.pass="";
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
      next(value:any) {
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
}
