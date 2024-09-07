import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Countries } from './paises';
import { countries } from './paises-data';

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
  pais:number=1000;
  state:number=1000;
  Paises:Countries[]=countries;
  ciudad:string="";
  cpostal:string="";
  dom:string="";
  campos2:Array<string>=[this.ciudad,this.cpostal,this.dom];
  alertas2:Array<string>=[];
  flag2:boolean=true;
  paso:number=1;

  verificar1(){
    this.flag1=true;
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

    if(this.flag1)this.paso=2;
  }

  verificar2(){
    this.flag2=true;
    if(this.pais==1000){
      this.alertas2[3]="Seleccione un pais";
      this.flag2=false;
    }else if(this.state==1000){
      this.alertas2[4]="Seleccione una provincia";
      this.alertas2[3]="";
      this.flag2=false;
    }else{
      this.alertas2[4]="";
      for (let i = 0; i < this.campos2.length; i++) {
        if(this.campos2[i]=="") this.flag2=false;
        this.alertas2[i] = this.campos2[i]=="" ? "Campo obligatorio" : "";      
      }
    }

    if(this.flag2){
      
    }
  }

  mostrar(){
    this.type = this.type=="password" ? "text" : "password";
  }
  atras(){
    this.paso=1;
  }
}
