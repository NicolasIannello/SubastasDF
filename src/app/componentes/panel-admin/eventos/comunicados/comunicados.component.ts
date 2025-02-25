import { Component, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../../../../servicios/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comunicados.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class ComunicadosComponent {
  @Output() messageEvent = new EventEmitter<boolean>();
  grupo:string='general';
  texto:string='';
  asunto:string='';

  constructor(public api:AdminService) {}

  cerrarModal() {
    this.texto='';
    this.asunto='';
    this.messageEvent.emit(false);
  }

  comunicar(){
    let datos={
      'token':localStorage.getItem('token'),
      'tipo':1,
      'texto':this.texto,
      'texto2':this.texto.replace(/\n/g, '<br>'),
      'asunto': this.asunto
    }      
    
    this.api.comunicar(datos).subscribe({
      next:(value)=> {
        if(value.ok){
          Swal.fire({title:'Comunicado enviado con exito',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
          this.cerrarModal();
        }else{
          Swal.fire({title:'Ocurrio un error' ,confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
        }
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })  
  }
}
