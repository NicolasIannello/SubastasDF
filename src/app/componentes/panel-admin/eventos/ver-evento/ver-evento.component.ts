import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../../../../servicios/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-evento.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class VerEventoComponent {
  @Output() messageEvent = new EventEmitter<boolean>();
  evento:{[key: string]: any}={lotes:[]};
  lotes:Array<any>=[];

  constructor(public api:AdminService) {}

  cerrarModal() {
    this.evento={};
    this.lotes=[];
    this.messageEvent.emit(false);
  }

  init(ev:any){
    console.log(ev);
    
    this.lotes=[]
    this.evento=ev;
    for (let i = 0; i < ev.lotes.length; i++) {
      let datos={
        'uuid':ev.lotes[i].uuid_lote,
        'token':localStorage.getItem('token'),
        'tipo':1
      }      
      this.api.cargarLote(datos).subscribe({
        next:(value)=> {
          this.lotes.push(value.lote[0]);
        },
        error:(err)=> {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        },
      })      
    }
  }
}
