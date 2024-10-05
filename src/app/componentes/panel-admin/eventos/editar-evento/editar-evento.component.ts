import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-evento',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './editar-evento.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class EditarEventoComponent {
  @Output() messageEvent = new EventEmitter<boolean>();
  evento:{[key: string]: any}={lotes:[]};
  eventoNuevo:{[key: string]: any}={lotes:[]}
  alertas:Array<string>=['','','','',''];

  cerrarModal() {
    this.eventoNuevo={};
    this.evento={};
    this.alertas=['','','','',''];
    this.messageEvent.emit(false);
  }

  actualizarEvento(){
    console.log(this.evento);
  }

  init(ev:any){
    this.evento=ev;
    this.eventoNuevo= Object.assign( { }, this.evento);
  }
}
