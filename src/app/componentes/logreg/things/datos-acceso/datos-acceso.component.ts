import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatosEmpComponent } from "../../datos-emp/datos-emp.component";
import { DatosDomicilioComponent } from "../datos-domicilio/datos-domicilio.component";
import { DatosUserComponent } from "../../datos-user/datos-user.component";
import { Countries } from '../../datos-user/paises';
import { countries } from '../../datos-user/paises-data';

@Component({
  selector: 'app-datos-acceso',
  standalone: true,
  imports: [FormsModule, CommonModule, DatosEmpComponent, DatosDomicilioComponent, DatosUserComponent],
  templateUrl: './datos-acceso.component.html',
  styleUrl: './datos-acceso.component.css'
})
export class DatosAccesoComponent{
  @Input() tipo!:string;
  Paises:Countries[]=countries;
  mail1:string="";
  mail2:string="";
  pass1:string="";
  pass2:string="";
  camposA:Array<string>=[this.mail1,this.mail2,this.pass1,this.pass2];
  alertasA:Array<string>=[];
  camposEmp:Array<string>=[];
  alertasEmp:Array<string>=[];
  camposUser:Array<string>=[];
  alertasUser:Array<string>=[];
  camposDom:Array<any>=[];
  alertasDom:Array<string>=[];
  type:string="password";
  paso:number=1;
  flag1:boolean=true;
  flag2:boolean=true;

  handleMessage(message: Array<any>, tipo:string) {    
    switch (tipo) {
      case 'emp': this.camposEmp=message; break;
      case 'user': this.camposUser=message; break;
      case 'dom': this.camposDom=message; break;
    }
  }

  verificar1(){
    this.flag1=true;
    for (let i = 0; i < this.camposA.length; i++) {
      if(this.camposA[i]=="" ) this.flag1=false;
      this.alertasA[i] = this.camposA[i]=="" ? "El campo es obligatorio" : "";      
    }
    if(this.tipo=="emp"){
      for (let i = 0; i < this.camposEmp.length; i++) {
        if(this.camposEmp[i]=="" ) this.flag1=false;
        this.alertasEmp[i] = this.camposEmp[i]=="" ? "El campo es obligatorio" : "";      
      }
    }else{
      for (let i = 0; i < this.camposUser.length; i++) {
        if(this.camposUser[i]=="" ) this.flag1=false;
        this.alertasUser[i] = this.camposUser[i]=="" ? "El campo es obligatorio" : "";      
      }
    }
    if(this.camposA[0]!=this.camposA[1]) {
      this.flag1=false;
      this.alertasA[0] = this.alertasA[1] = "Los E-mails no coinciden";
    }
    if(this.camposA[2]!=this.camposA[3]) {
      this.flag1=false;
      this.alertasA[2] = this.alertasA[3] = "Las contraseñas no coinciden";
    }
    
    if(this.flag1) this.paso=2;
  }

  verificar2(){
    this.flag2=true;
    if(this.camposDom[0]==1000){
      this.alertasDom[0]="Seleccione un pais";
      this.flag2=false;
    }else if(this.camposDom[1]==1000){
      this.alertasDom[1]="Seleccione una provincia";
      this.alertasDom[0]="";
      this.flag2=false;
    }else{
      this.alertasDom[1]="";
      for (let i = 2; i < this.camposDom.length; i++) {
        if(this.camposDom[i]=="") this.flag2=false;
        this.alertasDom[i] = this.camposDom[i]=="" ? "Campo obligatorio" : "";      
      }
    }

    if(this.flag2){      
      switch (this.tipo) {
        case 'emp':
          let datosEmp={
            'nombreComercial': this.camposEmp[0],
            'cuilcuit': this.camposEmp[1],
            'celular': this.camposEmp[2],
            'actividad': this.camposEmp[3],
            'razonSocial': this.camposEmp[4],
            'personaResponsable': this.camposEmp[5],
            'mail': this.camposA[0],
            'pass': this.camposA[2],
            'pais': this.Paises[this.camposDom[0]].name,
            'estado': this.Paises[this.camposDom[0]].states[this.camposDom[1]],
            'ciudad': this.camposDom[2],
            'cPostal': this.camposDom[3],
            'domicilio': this.camposDom[4],
          }

          break;
      
        case 'user':
          let datosUser={
            'nomapel': this.camposEmp[0],
            'cuilcuit': this.camposEmp[1],
            'celular': this.camposEmp[2],
            'actividad': this.camposEmp[3],
            'mail': this.camposA[0],
            'pass': this.camposA[2],
            'pais': this.Paises[this.camposDom[0]].name,
            'estado': this.Paises[this.camposDom[0]].states[this.camposDom[1]],
            'ciudad': this.camposDom[2],
            'cPostal': this.camposDom[3],
            'domicilio': this.camposDom[4],
          }
          break;
      }
    }
  }

  mostrar(){
    this.type = this.type=="password" ? "text" : "password";
  }
  atras(){
    this.paso=1;
  }
}
