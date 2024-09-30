import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CrearLoteComponent } from "./crear-lote/crear-lote.component";
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { VerLoteComponent } from "./ver-lote/ver-lote.component";
import { FormsModule } from '@angular/forms';
import { EditarLoteComponent } from "./editar-lote/editar-lote.component";

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule, CrearLoteComponent, VerLoteComponent, FormsModule, EditarLoteComponent],
  templateUrl: './lotes.component.html',
  styleUrl: '../usuarios/usuarios.component.css'
})
export class LotesComponent implements OnInit{
  crear:boolean=false;
  ver:boolean=false;
  editar:boolean=false;
  error:boolean=false;
  Lotes:Array<any>=[];
  total:number=-1;
  pagina:number=0;
  ordenar:string="_id";
  orden:string="1";
  loteModal:Array<any>=[];
  @ViewChild(VerLoteComponent)verComp!:VerLoteComponent;
  @ViewChild(EditarLoteComponent)editComp!:EditarLoteComponent;
  datoBuscar:string="";
  tipoBuscar:string="titulo";
  pagU:number=0;

  constructor(public api:AdminService) {}

  ngOnInit(): void {
    this.cargarLotes();
  }

  handleMessage(message: boolean, tipo:string) {    
    switch (tipo) {
      case 'crear': 
        this.crear=message;
        this.cargarLotes(); 
      break;
      case 'ver': 
        this.ver=message;
        this.loteModal=[];
      break;
      case 'editar': 
        this.editar=message;
        this.loteModal=[];
      break;
    }
  }

  cargarLotes(){
    let datos={
      'token':localStorage.getItem('token'),
      'tipo':1
    }
    this.api.cargarLotes(datos,this.pagina*20,this.ordenar,this.orden).subscribe({
      next:(value)=> {
          if(value.ok) {
            this.Lotes=value.lotes;
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

  verLote(id:string,tipo:number){
    if(tipo==1) this.ver=!this.ver;
    if(tipo==2) this.editar=!this.editar;
    this.loteModal=[];
    let datos={
      'uuid':id,
      'token':localStorage.getItem('token'),
      'tipo':1
    }
    this.api.cargarLote(datos).subscribe({
      next:(value)=> {
        this.loteModal=value.lote[0];
        if(tipo==1) this.verComp.cargarImagenes(value.lote[0].img, value.lote[0].pdf);
        if(tipo==2) this.editComp.cargarImagenes(value.lote[0].img, value.lote[0].pdf);
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }

  eliminar(id:string,nom:string){
    Swal.fire({
      title: "Esta por borrar un lote",
      text: '¿Desea borrar el lote: "'+nom+'"?',
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
        this.api.borrarLote(dato).subscribe({
          next:(value)=> {
            if(value.ok) Swal.fire({title:'Lote eliminado con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            this.cargarLotes();
          },
          error:(err)=> {
            Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          },
        })
      }
    });
  }

  buscarDato(){
    let dato={
      'token':localStorage.getItem('token'),
      'tipo':1,
      'dato':this.datoBuscar,
      'datoTipo':this.tipoBuscar,
      'datoTipoUser':'lote',
    }

    this.api.buscarDato(dato).subscribe({
      next:(value)=> {
          console.log(value);          
          if(value.ok){
            if(value.busqueda.length>0) {
              this.Lotes=value.busqueda
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
    this.cargarLotes()
  }
  atras(){
    if(this.pagina>0){
      this.pagina--;
      this.cargarLotes()
    }
  }
  siguiente(){    
    if(this.pagina<this.pagU-1){
      this.pagina++;
      this.cargarLotes()
    }
  }
  final(){
    this.pagina=this.pagU-1
    this.cargarLotes()
  }
}
