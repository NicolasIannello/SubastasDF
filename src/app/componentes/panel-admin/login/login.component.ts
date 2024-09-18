import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiciosService } from '../../../servicios/servicios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: '../../logreg/datos-acceso/datos-acceso.component.css'
})
export class LoginComponent implements OnInit{
  alertas:Array<string>=['',''];
  campos:Array<string>=['',''];
  type:string='password';
  User:string="";

  constructor(public api:ServiciosService){}

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      let dato={
        'token': localStorage.getItem('token'),
        'tipo': 1
      }
      this.api.checkTokenA(dato).subscribe({
        next: (value:any) => {
          if (value.ok) {
            localStorage.setItem('token',value.token);
            this.User=value.user;
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

  ingresar(){    
    this.alertas[0] = this.campos[0]=="" ? "El campo es obligatorio" : "";
    this.alertas[1] = this.campos[1]=="" ? "El campo es obligatorio" : "";

    let datos={
      'user': this.campos[0],
      'pass': this.campos[1],
    }
    if(this.campos[0]!='' && this.campos[1]!=''){
      this.api.loginA(datos).subscribe({
        next: (value)=>{
          if(value.ok){
            localStorage.setItem('token',value.token)
            this.User=value.user
          }
          if(!value.ok)localStorage.removeItem('token')
        },
        error: (err)=>{
          localStorage.removeItem('token')
        }
      })
    }
  }

  mostrar(){
    this.type = this.type=="password" ? "text" : "password";
  }
  logout(){
    localStorage.removeItem('token');
    window.location.reload();
  }
}
