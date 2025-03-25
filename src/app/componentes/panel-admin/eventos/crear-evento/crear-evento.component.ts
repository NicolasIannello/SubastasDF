import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../../servicios/admin.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './crear-evento.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class CrearEventoComponent {
  @Output() messageEvent = new EventEmitter<boolean>();
  datos:Array<any>=     ['','Autos y motos','','','Subasta',true,true,'00:00','00:00',120,false,false,false,'general',[]];
  alertas:Array<string>=['',''             ,'','',''       ,'','',''];
  img:any|null=[];
  sources:any='';
  @ViewChild('imagen') inputImagen!: ElementRef;
  pdf:SafeResourceUrl|null=null;
  @ViewChild('pdfTC') inputPDF!: ElementRef;
  constructor(public api:AdminService, private sanitizer: DomSanitizer) {}

  cerrarModal() {
    this.datos=  ['','Autos y motos','','','Subasta',true,true,'00:00','00:00',120,false,false,false,'general',[]];
    this.alertas=['',''             ,'','',''       ,'',''];  
    this.inputImagen.nativeElement.value = "";
    this.img=[];
    this.sources='';  
    this.pdf=null;
    this.inputPDF.nativeElement.value = "";    
    this.messageEvent.emit(false);
  }

  crearEvento(){    
    let flag=true;
    for (let i = 0; i < this.datos.length; i++) {      
      if(i!=14 && this.datos[i]==='') flag=false;
      this.alertas[i]= (this.datos[i]==='') ? 'Campo obligatorio' : '';
    }
    if(this.img==null || this.img.length==0 || this.datos[14].length==0) flag=false;
    this.alertas[7]= (this.img==null || this.img.length==0) ? 'Campo obligatorio' : '';
    this.alertas[8]= (this.datos[14].length==0) ? 'Campo obligatorio' : '';

    if(flag){
      let datos={
        'nombre': this.datos[0],
        'categoria': this.datos[1],
        'fecha_inicio': this.datos[2],
        'fecha_cierre': this.datos[3],
        'hora_inicio': this.datos[7],
        'hora_cierre': this.datos[8],
        'segundos_cierre': this.datos[9],
        'modalidad': this.datos[4],
        'publicar_cierre': this.datos[5],
        'inicio_automatico': this.datos[6],
        'mostrar_precio':this.datos[10],
        'mostrar_ganadores':this.datos[11],
        'mostrar_ofertas':this.datos[12],
        'grupo':this.datos[13],
        'token': localStorage.getItem('token')!,
        'tipo': '1',
      };

      this.api.crearEvento(datos).subscribe({
        next:(value)=> {
          if(value.ok){
            const formData = new FormData();
            formData.append('uuid', value.uuid);  
            formData.append('img', this.img[0]);  
            formData.append('pdf', this.datos[14][0]);  
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

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  showPDF(event: Event){
    this.pdf=null;
    this.datos[14]=[]
    const element = event.currentTarget as HTMLInputElement;    
    if(element.files?.length!=undefined && element.files?.length>0){ 
      this.pdf= this.transform(URL.createObjectURL(element.files[0]));
      this.datos[14]=element.files;
    }    
	}
}
