import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
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
  datos:Array<any>=     ['','Autos y motos','','','Subasta',true,true];
  alertas:Array<string>=['',''             ,'','',''       ,'',''];
  img:any|null=[];
  sources:any='';
  @ViewChild('imagen') inputImagen!: ElementRef;

  constructor(public api:AdminService) {}

  cerrarModal() {
    this.datos=  ['','Autos y motos','','','Subasta',true,true];
    this.alertas=['',''             ,'','',''       ,''];  
    this.inputImagen.nativeElement.value = "";
    this.img=[];
    this.sources='';  
    this.messageEvent.emit(false);
  }

  crearEvento(){    
    let flag=true;
    for (let i = 0; i < this.datos.length; i++) {      
      if(this.datos[i]==='') flag=false;
      this.alertas[i]= (this.datos[i]==='') ? 'Campo obligatorio' : '';
    }
    if(this.img==null || this.img.length==0) flag=false;
    this.alertas[7]= (this.img==null || this.img.length==0) ? 'Campo obligatorio' : '';

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
            const formData = new FormData();
            formData.append('uuid', value.uuid);  
            formData.append('img', this.img[0]);  
            formData.append('caso', 'nuevo');
            formData.append('token', localStorage.getItem('token')!);  
            formData.append('tipo', '1');	
            this.api.imagenEvento(formData).then(resp =>{
              if(resp.ok){
                Swal.fire({title:'Evento creado con exito',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
              }else{
                Swal.fire({title:'Error en la carga de imagen',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
              }
              this.cerrarModal();
            }, (err)=>{				
              Swal.fire({title:'Error en la carga de imagen',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
              this.cerrarModal();   
            });
          }else{
            Swal.fire({title:value.msg,confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
          }
        },
        error:(err)=> {
          Swal.fire({title:'Ocurrio un error',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          this.cerrarModal();
        },
      });
    }
  }

  showImg(event: Event){
		this.sources='';
    this.img=null;
    const element = event.currentTarget as HTMLInputElement;
		this.img=element.files;    
    
    const reader = new FileReader();
    reader.readAsDataURL(element.files![0]);

    reader.onloadend = ()=>{
      this.sources=reader.result;
    }
	}
}
