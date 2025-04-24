import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Countries } from '../../logreg/paises';
import { countries } from '../../logreg/paises-data';
import { LogregComponent } from "../../logreg/logreg.component";
import { ExcelService } from '../../../servicios/excel.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, LogregComponent],
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
  mostrarCrear:boolean=false;
  mostrarCrearAdmin:boolean=false;
  mostrarCrearNormal:boolean=false;
  userAdmin:string="";
  passwordAdmin:string="";
  ordenar:string="_id";
  orden:string="1";
  datoBuscar:string="";
  tipoBuscar:string="nombre";
  tipoBuscarUser:string="";
  mostrarReporte:boolean=false;
  passwordCambio:string="";
  passwordCambio2:string="";
  tabla:number=0;
  ordenarTC:string="_id";
  ordenTC:string="1";
  datoBuscarTC:string="";
  tipoBuscarTC:string="mail";
  paginaTC:number=0;

  constructor(public api: AdminService, public excel: ExcelService, @Inject(PLATFORM_ID) private platformId: Object){ }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
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
  }

  principio(){
    if(this.tabla==0) this.pagina=0;
    if(this.tabla==2) this.paginaTC=0;
    this.recargar()
  }
  atras(){
    if(this.pagina>0 && this.tabla==0){
      this.pagina--;
      this.recargar()
    }else if(this.paginaTC>0 && this.tabla==2){
      this.pagina--;
      this.recargar()
    }
  }
  siguiente(){    
    if(this.pagina<this.pagU-1 && this.tabla==0){
      this.pagina++;
      this.recargar()
    }else if(this.paginaTC<this.pagU-1 && this.tabla==2){
      this.pagina++;
      this.recargar()
    }
  }
  final(){
    if(this.tabla==0) this.pagina=this.pagU-1;
    if(this.tabla==2) this.paginaTC=this.pagU-1;
    this.recargar()
  }

  recargar(){
    let dato={
      'token':localStorage.getItem('token'),
      'tipo': 1
    }
    if(this.tabla==0){
      this.api.cargarUsersDesde(dato,this.pagina*20,this.ordenar,this.orden).subscribe({
        next: (value)=>{
          this.Usuarios = [...value.users];
          this.Total=value.total;
          this.pagU=Math.ceil(this.Total/20)
        },
        error: (err)=>{
          this.error=true;
        }
      })
    }else if(this.tabla==1){
      this.api.cargarAdmins(dato).subscribe({
        next:(value)=> {
            this.Usuarios=value.admins
        },
        error:(err)=> {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});            
        },
      })
    }else{
      this.api.cargarTC(dato,this.paginaTC*20,this.ordenarTC,this.ordenTC,this.datoBuscarTC,this.tipoBuscarTC).subscribe({
        next:(value)=> {
          this.Usuarios = [...value.tcs];
          this.Total=value.total;
          this.pagU=Math.ceil(this.Total/20)
        },
        error:(err)=> {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});            
        },
      })
    }
  }

  eliminar(id:string,nom:string,tipo:string){
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
          "tipo":1,
          "user":tipo
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

  crearUser(tipo:string){
    if(tipo=='tipo') {
      this.mostrarCrear=!this.mostrarCrear;
    }else{
      this.mostrarCrear=false;
    }
    if(tipo=='normal') this.mostrarCrearNormal=!this.mostrarCrearNormal;
    if(tipo=='admin') this.mostrarCrearAdmin=!this.mostrarCrearAdmin;
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
    if(this.passwordCambio!=this.passwordCambio2){
      Swal.fire({title:'Las contraseñas no coinciden', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      return;
    }
    let datos, tipo='user';
    switch (this.datoCambio['tipo']) {
      case 'emp':        
        datos={
          'persona_responsable': this.datoCambioEMP['persona_responsable'],
          'cuil_cuit': this.datoCambio['cuil_cuit'],
          'telefono': this.datoCambio['telefono'],
          'actividad': this.datoCambio['actividad'],
          'razon_social': this.datoCambioEMP['razon_social'],
          'nombre': this.datoCambio['nombre'],
          'como_encontro': this.datoCambio['como_encontro'],
          'mail': this.datoCambio['mail'],
          'pais': this.datoCambio['pais'],
          'provincia': this.datoCambio['provincia'],
          'ciudad': this.datoCambio['ciudad'],
          'postal': this.datoCambio['postal'],
          'domicilio': this.datoCambio['domicilio'],
          'habilitado': (this.datoCambio['habilitado']==true || this.datoCambio['habilitado']=='true') ? true : false,
          'grupo': this.datoCambio['grupo'],
          'tipo': 'emp'
        }
        break; 
      case 'viejo':
        tipo=this.datoCambio['tipo'];
        datos={
          'nombre': this.datoCambio['nombre'],
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
          'grupo': this.datoCambio['grupo'],
          'tipo': tipo
        }
        break;
      case 'user': 
        tipo=this.datoCambio['tipo'];
        datos={
          'nombre': this.datoCambio['nombre'],
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
          'grupo': this.datoCambio['grupo'],
          'tipo': tipo
        }
        break;
    }
    
    let dato={
      'token':localStorage.getItem('token'),
      "campos":datos,
      'tipo':1,
      'id':this.idCambio,
      'nuevaPass':this.passwordCambio
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

  crearAdmin(){
    let dato={
      'token':localStorage.getItem('token'),
      'tipo':1,
      'usuario':this.userAdmin,
      'pass':this.passwordAdmin,
    }

    this.api.crearAdmin(dato).subscribe({
      next: (value)=> {
          if(value.ok) Swal.fire({title:'Usuario admin creado con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          if(!value.ok) Swal.fire({title:value.msg, confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
      error: (err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
      },
    })
  }

  buscarDato(){
    let dato={
      'token':localStorage.getItem('token'),
      'tipo':1,
      'dato':this.datoBuscar,
      'datoTipo':this.tipoBuscar,
      'datoTipoUser':this.tipoBuscarUser,
    }

    this.api.buscarDato(dato).subscribe({
      next:(value)=> {
          if(value.ok){
            if(value.busqueda.length>0) {
              this.Usuarios=value.busqueda
            }else{
              Swal.fire({title:'No se encontro ningun resultado', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
            }
          }else{
            Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
          }
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
      },
    })
  }

  reporte(){
    this.mostrarReporte=!this.mostrarReporte
  }

  generarExcel(flag:boolean){
    let dato={
      'token':localStorage.getItem('token'),
      'tipo':1,
      'estado':flag,
    }

    this.api.excelUsuarios(dato).subscribe({
      next:(value)=> {
          if(value.ok){
            let hoy=new Date();
            let mes = hoy.getMonth()>8 ? (hoy.getMonth()+1) : "0"+(hoy.getMonth()+1);
            let dia = hoy.getDate()>9 ? hoy.getDate() : "0"+hoy.getDate()
            let fecha = dia+"-"+mes+"-"+hoy.getFullYear();
            let est = flag ? 'habilitados' : 'deshabilitados';

            this.excel.generateExcel(value.busqueda, "Usuarios "+est+" "+fecha);
          }else{
            Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
          }
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
      },
    })
  }

  cambiarTabla(flag:number){
    this.tabla=flag;
    this.recargar();
  }
}