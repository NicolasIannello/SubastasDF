import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datos-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './datos-user.component.html',
  styleUrl: './datos-user.component.css'
})
export class DatosUserComponent {
  nomapel:string="";
  cuitcuil:string="";
  cel:string="";
  actividad:string="";
  mail1:string="";
  mail2:string="";
  pass1:string="";
  pass2:string="";
  como:string="Google";
  campos:Array<string>=[this.nomapel,this.cuitcuil,this.cel,this.actividad,this.mail1,this.mail2,this.pass1,this.pass2];
  alertas:Array<string>=[];
  type:string="password";
  flag1:boolean=true;

  verificar1(){
    for (let i = 0; i < this.campos.length; i++) {
      if(this.campos[i]=="" ) this.flag1=false;
      this.alertas[i] = this.campos[i]=="" ? "El campo es obligatorio" : "";      
    }
    if(this.campos[4]!=this.campos[5]) {
      this.flag1=false;
      this.alertas[4] = this.alertas[5] = "Los E-mails no coinciden";
    }
    if(this.campos[6]!=this.campos[7]) {
      this.flag1=false;
      this.alertas[6] = this.alertas[7] = "Las contraseñas no coinciden";
    }

    if(this.flag1){
      
    }
  }

  mostrar(){
    this.type = this.type=="password" ? "text" : "password";
  }
}
