import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../../servicios/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './crear-evento.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class CrearEventoComponent {
  @Output() messageEvent = new EventEmitter<boolean>();
  datos:Array<any>=     ['','Autos y motos','','','Remates',true,true];
  alertas:Array<string>=['',''             ,'','',''       ,''];

  constructor(public api:AdminService) {}

  cerrarModal() {
    this.datos=  ['','Autos y motos','','','Remates',true,true];
    this.alertas=['',''             ,'','',''       ,''];  
    this.messageEvent.emit(false);
  }

  crearEvento(){    
    let flag=true;
    for (let i = 0; i < this.datos.length; i++) {      
      if(this.datos[i]==='') flag=false;
      this.alertas[i]= (this.datos[i]==='') ? 'Campo obligatorio' : '';
    }

    if(flag){
      let datos={
        'nombre': this.datos[0],
        'categoria': this.datos[1],
        'fecha_inicio': this.datos[2],
        'fecha_cierre': this.datos[3],
        'modalidad': this.datos[4],
        'publicar_cierre': this.datos[5],
        'inicio_automatico': this.datos[6],
        'token': localStorage.getItem('token')!,
        'tipo': '1',
      };

      this.api.crearEvento(datos).subscribe({
        next:(value)=> {
          if(value.ok){
            Swal.fire({title:'Evento creado con exito',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
          }else{
            Swal.fire({title:value.msg,confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
          }
          this.cerrarModal();   
        },
        error:(err)=> {
          Swal.fire({title:'Ocurrio un error',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          this.cerrarModal();
        },
      });
    }
  }

}
