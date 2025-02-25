import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { CrearEventoComponent } from "./crear-evento/crear-evento.component";
import { EditarEventoComponent } from "./editar-evento/editar-evento.component";
import { VerEventoComponent } from "./ver-evento/ver-evento.component";
import { ComunicadosComponent } from "./comunicados/comunicados.component";

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, CrearEventoComponent, EditarEventoComponent, VerEventoComponent, ComunicadosComponent],
  templateUrl: './eventos.component.html',
  styleUrl: '../usuarios/usuarios.component.css'
})
export class EventosComponent {
  crear:boolean=false;
  editar:boolean=false;
  ver:boolean=false;
  comunicados:boolean=false;
  datoBuscar:string="";
  tipoBuscar:string="nombre";
  error:boolean=false;
  total:number=-1;
  pagina:number=0;
  Eventos:Array<any>=[];
  pagU:number=0;
  ordenar:string="_id";
  orden:string="1";
  @ViewChild(EditarEventoComponent)editComp!:EditarEventoComponent;
  @ViewChild(VerEventoComponent)verComp!:VerEventoComponent;

  constructor(public api:AdminService) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  handleMessage(message: boolean, tipo:string) {    
    switch (tipo) {
      case 'crear': 
        this.crear=message;
        this.error=false;
        this.cargarEventos();
      break;
      case 'editar':
        this.editar=message;
        this.cargarEventos();
      break;
      case 'ver':
        this.ver=message;
      break;
      case 'comunicados':
        this.comunicados=message;
      break;
    }
  }

  buscarDato(){
    let dato={
      'token':localStorage.getItem('token'),
      'tipo':1,
      'dato':this.datoBuscar,
      'datoTipo':this.tipoBuscar,
      'datoTipoUser':'evento',
    }

    this.api.buscarDato(dato).subscribe({
      next:(value)=> {
          if(value.ok){
            if(value.busqueda.length>0) {
              this.Eventos=value.busqueda
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

  principio(){
    this.pagina=0;
    this.cargarEventos()
  }
  atras(){
    if(this.pagina>0){
      this.pagina--;
      this.cargarEventos()
    }
  }
  siguiente(){    
    if(this.pagina<this.pagU-1){
      this.pagina++;
      this.cargarEventos()
    }
  }
  final(){
    this.pagina=this.pagU-1
    this.cargarEventos()
  }

  cargarEventos(){
    let datos={
      'token':localStorage.getItem('token'),
      'tipo':1
    }
    this.api.cargarEventos(datos,this.pagina*20,this.ordenar,this.orden).subscribe({
      next:(value)=> {
          if(value.ok) {
            this.Eventos=value.eventos;
            this.total=value.total;
            this.pagU=Math.ceil(this.total/20)
          }else{
            this.error=true;
          }
      },
      error:(err)=> {
        this.error=true;
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }

  modal(evento:any,modal:string){
    switch (modal) {
      case 'editar':
        this.editar=true;
        this.editComp.init(evento,true)
      break;
      case 'ver':
        this.ver=true;
        this.verComp.init(evento)
      break;
    }
  }

  eliminar(nom:string,id:string){
    Swal.fire({
      title: "Esta por borrar un evento",
      text: '¿Desea borrar el evento: "'+nom+'"?',
      showCancelButton: true,
      confirmButtonText: "Borrar",
      confirmButtonColor: "red",
      cancelButtonText: "Atras",
    }).then((result) => {
      if (result.isConfirmed) {
        let dato={
          "uuid":id,
          "token":localStorage.getItem('token'),
          "tipo":1,
        }        
        this.api.borrarEvento(dato).subscribe({
          next:(value)=> {
            if(value.ok) Swal.fire({title:'Lote eliminado con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            this.cargarEventos()
          },
          error:(err)=> {
            Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          },
        })
      }
    });
  }
}
