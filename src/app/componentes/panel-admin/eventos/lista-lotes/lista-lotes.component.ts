import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AdminService } from '../../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { VerLoteComponent } from '../../lotes/ver-lote/ver-lote.component';

@Component({
  selector: 'app-lista-lotes',
  standalone: true,
  imports: [CommonModule, VerLoteComponent],
  templateUrl: './lista-lotes.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class ListaLotesComponent{
  @Output() messageEvent = new EventEmitter<{message:boolean,lotes:Array<string>}>();
  Lotes:Array<any>=[];
  ver:boolean=false;
  loteModal:Array<any>=[];
  @ViewChild(VerLoteComponent)verComp!:VerLoteComponent;

  constructor(public api:AdminService) {}

  init(){
    this.cargarLotes();    
  }

  handleMessage(message: boolean) {    
    this.ver=message;
    this.loteModal=[];
  }

  cerrarModal(flag:boolean) {
    let lotes=[];
    if(flag){
      for (let i = 0; i < this.Lotes.length; i++) {
        if(this.Lotes[i].agregar) lotes.push(this.Lotes[i].uuid)
      }
    }
    this.Lotes=[];
    this.messageEvent.emit({message:false,lotes:lotes});
  }

  cargarLotes(){
    let datos={
      'token':localStorage.getItem('token'),
      'tipo':1
    }
    this.api.cargarLotes(datos,0,'_id','1',true).subscribe({
      next:(value)=> {
          if(value.ok) {
            this.Lotes=value.lotes;         
          }
      },
      error:(err)=> {
      },
    })
  }

  verLote(id:string){
    this.ver=!this.ver;
    this.loteModal=[];
    let datos={
      'uuid':id,
      'token':localStorage.getItem('token'),
      'tipo':1
    }
    this.api.cargarLote(datos).subscribe({
      next:(value)=> {
        this.loteModal=value.lote[0];
        this.verComp.cargarImagenes(value.lote[0].img/*, value.lote[0].pdf*/);
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }
}
