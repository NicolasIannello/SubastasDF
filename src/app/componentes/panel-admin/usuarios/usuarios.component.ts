import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Countries } from '../../logreg/datos-user/paises';
import { countries } from '../../logreg/datos-user/paises-data';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{
  Usuarios:Array<any>=[];
  Total:number=0;
  pagina:number=0;
  pagU:number=0;
  error:boolean=false;
  mostrar:boolean=false;
  datoMostrar:{ [key: string]: string } = {};
  datoMostrarEMP:{ [key: string]: string } = {};
  mostrarCambio:boolean=false;
  datoCambio:{ [key: string]: any } = {};
  datoCambioEMP:{ [key: string]: string } = {};
  datoCambioCheck:{ [key: string]: string } = {};
  datoCambioEMPCheck:{ [key: string]: string } = {};
  Paises:Countries[]=countries;
  paisI:number=1;
  flagH:boolean=false;
  idCambio:string="";
  
  constructor(public api: AdminService){ }

  ngOnInit(): void {
    let dato={
      'token':localStorage.getItem('token'),
      'tipo': 1
    }
    this.api.cargarUsers(dato).subscribe({
      next: (value)=>{
        this.Usuarios = [...value.users];
        this.Total=value.total;
        this.pagU=Math.ceil(this.Total/20)
      },
      error: (err)=>{
        this.error=true;
      }
    })
    
  }

  atras(){
    if(this.pagina>0){
      this.pagina--;
      this.recargar()
    }
  }
  siguiente(){    
    if(this.pagina<this.pagU-1){
      this.pagina++;
      this.recargar()
    }
  }

  recargar(){
    let dato={
      'token':localStorage.getItem('token'),
      'tipo': 1
    }
    this.api.cargarUsersDesde(dato,this.pagina*20).subscribe({
      next: (value)=>{
        this.Usuarios = [...value.users];
        this.Total=value.total;
        this.pagU=Math.ceil(this.Total/20)
      },
      error: (err)=>{
        this.error=true;
      }
    })
  }

  eliminar(id:string,nom:string){
    Swal.fire({
      title: "Esta por borrar una cuenta",
      text: "¿Desea borrar la cuenta "+nom+" ?",
      showCancelButton: true,
      confirmButtonText: "Borrar",
      confirmButtonColor: "red",
      cancelButtonText: "Atras",
    }).then((result) => {
      if (result.isConfirmed) {
        let dato={
          "id":id,
          "token":localStorage.getItem('token'),
          "tipo":1
        }
        this.api.deleteUsers(dato).subscribe({
          next:(value)=> {
            if(value.ok) Swal.fire({title:'Usuario eliminado con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            this.recargar();
            },
          error:(err)=> {
            Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          },
        })
      }
    });
  }

  ver(i:number){
    this.mostrar=!this.mostrar    
    if(i>=0){
      this.datoMostrar=this.Usuarios[i];
      if(this.Usuarios[i]["dato_empresa"]) this.datoMostrarEMP=this.Usuarios[i]["dato_empresa"];
    }else{
      this.datoMostrar={}; this.datoMostrarEMP={};
    }
  }

  verCambio(i:number,id:string){
    this.flagH=false
    this.mostrarCambio=!this.mostrarCambio   
    this.idCambio=id;
    if(i>=0){
      this.datoCambio=JSON.parse(JSON.stringify(this.Usuarios[i]));
      this.datoCambioCheck=JSON.parse(JSON.stringify(this.Usuarios[i]));
      if(this.Usuarios[i]["dato_empresa"]) {
        this.datoCambioEMP=JSON.parse(JSON.stringify(this.Usuarios[i]["dato_empresa"]));
        this.datoCambioEMPCheck=JSON.parse(JSON.stringify(this.Usuarios[i]["dato_empresa"]));
      }
    }else{
      this.datoCambio={}; this.datoCambioCheck={}; this.datoCambioEMP={}; this.datoCambioEMPCheck={}; this.idCambio='';
    }    
    this.getPais(false)
  }

  checkCambio(key:string){
    this.flagH=this.datoCambio[key].toString()!=this.datoCambioCheck[key].toString();
  }

  getPais(flag:boolean){
    if(flag) this.datoCambio['provincia']=''
    for (let i = 0; i < this.Paises.length; i++) {
      if(this.Paises[i].name==this.datoCambio['pais']) this.paisI=i;
    }
  }

  actualizar(){
    let datos, tipo='user';
    switch (this.datoCambio['tipo']) {
      case 'emp':
        datos={
          'nombre_comercial': this.datoCambioEMP['nombre_comercial'],
          'cuil_cuit': this.datoCambio['cuil_cuit'],
          'telefono': this.datoCambio['telefono'],
          'actividad': this.datoCambio['actividad'],
          'razon_social': this.datoCambioEMP['razon_social'],
          'nombre_apellido': this.datoCambio['nombre_apellido'],
          'como_encontro': this.datoCambio['como_encontro'],
          'mail': this.datoCambio['mail'],
          'pais': this.datoCambio['pais'],
          'provincia': this.datoCambio['provincia'],
          'ciudad': this.datoCambio['ciudad'],
          'postal': this.datoCambio['postal'],
          'domicilio': this.datoCambio['domicilio'],
          'habilitado': (this.datoCambio['habilitado']==true || this.datoCambio['habilitado']=='true') ? true : false,
          'tipo': 'emp'
        }
        break; 
      case 'viejo':
        tipo=this.datoCambio['tipo'];
        datos={
          'nombre_apellido': this.datoCambio['nombre_apellido'],
          'cuil_cuit': this.datoCambio['cuil_cuit'],
          'telefono': this.datoCambio['telefono'],
          'actividad': this.datoCambio['actividad'],
          'como_encontro': this.datoCambio['como_encontro'],
          'mail': this.datoCambio['mail'],
          'pais': this.datoCambio['pais'],
          'provincia': this.datoCambio['provincia'],
          'ciudad': this.datoCambio['ciudad'],
          'postal': this.datoCambio['postal'],
          'domicilio': this.datoCambio['domicilio'],
          'habilitado': (this.datoCambio['habilitado']==true || this.datoCambio['habilitado']=='true') ? true : false,
          'tipo': tipo
        }
        break;
      case 'user': 
        tipo=this.datoCambio['tipo'];
        datos={
          'nombre_apellido': this.datoCambio['nombre_apellido'],
          'cuil_cuit': this.datoCambio['cuil_cuit'],
          'telefono': this.datoCambio['telefono'],
          'actividad': this.datoCambio['actividad'],
          'como_encontro': this.datoCambio['como_encontro'],
          'mail': this.datoCambio['mail'],
          'pais': this.datoCambio['pais'],
          'provincia': this.datoCambio['provincia'],
          'ciudad': this.datoCambio['ciudad'],
          'postal': this.datoCambio['postal'],
          'domicilio': this.datoCambio['domicilio'],
          'habilitado': (this.datoCambio['habilitado']==true || this.datoCambio['habilitado']=='true') ? true : false,
          'tipo': tipo
        }
        break;
    }
    
    let dato={
      'token':localStorage.getItem('token'),
      "campos":datos,
      'tipo':1,
      'id':this.idCambio
    }
    this.api.actualizarUser(dato).subscribe({
      next: (value:any) => {
        Swal.fire({title:'Usuario actualizado con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        this.recargar(); 
        this.verCambio(-1,'')
      },
      error(err:any) {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
      },		
    });

  }
}