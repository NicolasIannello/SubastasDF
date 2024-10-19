import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiciosService } from '../../../servicios/servicios.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from "../../../servicios/html.pipe";
import { CommonModule } from '@angular/common';
import { VerImagenComponent } from '../../ver-imagen/ver-imagen.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lote',
  standalone: true,
  imports: [SanitizeHtmlPipe, CommonModule, VerImagenComponent, FormsModule],
  templateUrl: './lote.component.html',
  styleUrl: '../../panel-admin/usuarios/usuarios.component.css'
})
export class LoteComponent{
  verImg:boolean=false;
  @Output() messageEvent = new EventEmitter<boolean>();
  @Input() lote:{[key: string]: any}=[];
  @Input() evento:{[key: string]: any}=[];
  imagenes: Array<{link:SafeResourceUrl,id:number}> = [];
  pdf:SafeResourceUrl|null=null;
  imgID:number=-1;
  dateFin:Date|null=null;
  dateHoy:Date|null=null;
  flagTimer:boolean=false;
  totalDays:number=0;
  remHours:number=0;
  remMinutes:number=0;
  remSeconds:number=0;
  oferta:number|null=null;
  ofertaAuto:number|null=null;
  ofertaAutoExiste:number|null=null;
  programar:boolean=false;
  precio_actual:number|null=null;
  cantidad_ofertas:number|null=null;
  ganador:string|null=null;

  constructor(public api: ServiciosService, private sanitizer: DomSanitizer){}

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  handleMessage(message: boolean) {    
    this.verImg=message;
  }

  cerrarModal() {
    this.imagenes=[];
    this.pdf=null;
    this.flagTimer=false;
    this.oferta=null;
    this.ofertaAuto=null
    this.programar=false;
    this.precio_actual=null;
    this.cantidad_ofertas=null;
    this.ganador=null;
    this.messageEvent.emit(false);
  }

  cargarImagenes(imgs:Array<any>, pdf:any){
    this.flagTimer=true;
    this.imagenes=[];
    for (let i = 1; i < imgs.length+1; i++) {      
      this.imagenes.push({link:'', id:i});
    }
    this.pdf=null;
    for (let i = 0; i < imgs.length; i++) {      
      this.api.cargarArchivo(imgs[i].img,'lotes').then(resp=>{						
        if(resp!=false){
          this.imagenes[imgs[i].orden-1]={link:resp.url, id:(imgs[i].orden)};
        }
      })
    }    
    this.api.cargarArchivo(pdf.pdf,'pdfs').then(resp=>{						
      if(resp!=false){
        this.pdf=this.transform(resp.url);
      }
      this.dateFin= new Date(Date.parse(this.evento['fecha_cierre']+' '+this.evento['hora_cierre']));
      this.dateHoy= new Date();
      this.countDown()
      let dato={
        'token':localStorage.getItem('token'),
        'lote':this.lote['uuid'],
        'evento':this.evento['uuid'],
        'tipo':1
      }
      this.api.ofertaDatos(dato).subscribe({
        next:(value)=> {
            this.precio_actual=value.precio;
            this.cantidad_ofertas=value.cantidad;
            this.ganador=value.ganador
        },
        error:(err)=> { },
      })
      this.api.getOfertaAuto(dato).subscribe({
        next:(value)=> {
          if(value.ok) this.ofertaAutoExiste=value.cantidad
        },
        error:(err)=> { },
      })
    })    
  }

  verImagen(id:number){
    this.verImg=true;
    this.imgID=(id-1);    
  }

  countDown(){
    const milliDiff: number = (this.dateHoy!.getTime()- this.dateFin!.getTime())*-1;
    
    const totalSeconds = Math.floor(milliDiff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    this.totalDays = Math.floor(totalHours / 24);    
    this.remSeconds = totalSeconds % 60;
    this.remMinutes = totalMinutes % 60;
    this.remHours = totalHours % 24;

    this.timer();
  }

  timer(){
    this.remSeconds--
    if(this.remSeconds<0) {
      this.remMinutes--;
      this.remSeconds=60;
    }
    if(this.remMinutes<0){ 
      this.remHours--;
      this.remMinutes=60
    }
    if(this.remHours<0) {
      this.totalDays--
      this.remHours=24;
    }
    if(this.totalDays<0) this.flagTimer=false;
    
    if(this.flagTimer) setTimeout( ()=>this.timer(), 1000);
  }

  ofertar(){
    if(this.oferta!=null && this.oferta>=this.lote['precio_base'] && (this.precio_actual==null || this.oferta>this.precio_actual)){
      let dato={
        'token':localStorage.getItem('token'),
        'cantidad':this.oferta,
        'lote':this.lote['uuid'],
        'evento':this.evento['uuid'],
        'tipo':1
      }

      this.api.ofertar(dato).subscribe({
        next:(value)=>{
          if(value.ok) Swal.fire({title:'Oferta creada con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          if(!value.ok) Swal.fire({title: value.msg ? value.msg : 'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        },
        error:(err)=>{
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        },
      })
    }else{
      Swal.fire({title:'Oferta invalida', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
    }
  }

  programarOferta(){
    if(this.ofertaAuto!=null && this.ofertaAuto>=this.lote['precio_base'] && (this.precio_actual==null || this.ofertaAuto>this.precio_actual)){
      Swal.fire({
        title: "Oferta automatica", text: '¿Desea crear una oferta automatica para este lote?',
        showCancelButton: true, confirmButtonText: "Crear", confirmButtonColor:'#3083dc', cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          let dato={
            'token':localStorage.getItem('token'),
            'cantidad':this.ofertaAuto,
            'lote':this.lote['uuid'],
            'evento':this.evento['uuid'],
            'tipo':1
          }
    
          this.api.programarOferta(dato).subscribe({
            next:(value)=>{
              if(value.ok) {
                Swal.fire({title:'Oferta automatica creada con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
                this.ofertaAuto=null;
                this.api.getOfertaAuto(dato).subscribe({
                  next:(value)=> {
                    if(value.ok) this.ofertaAutoExiste=value.cantidad
                  },
                  error:(err)=> { },
                })
              }
              if(!value.ok) Swal.fire({title: value.msg ? value.msg : 'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            },
            error:(err)=>{
              Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            },
          }) 
        }
      });
    }else{
      Swal.fire({title:'Oferta invalida', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
    }
  }

  eliminarOferta(){
    Swal.fire({
      title: "Oferta automatica", text: '¿Desea eliminar la oferta automatica de este lote?',
      showCancelButton: true, confirmButtonText: "Eliminar", confirmButtonColor:'red', cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        let dato={
          'token':localStorage.getItem('token'),
          'lote':this.lote['uuid'],
          'evento':this.evento['uuid'],
          'tipo':1
        }
  
        this.api.eliminarOfertaAuto(dato).subscribe({
          next:(value)=>{
            if(value.ok) {
              Swal.fire({title:'Oferta automatica eliminada con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
              this.ofertaAutoExiste=null
            }
            if(!value.ok) Swal.fire({title: value.msg ? value.msg : 'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          },
          error:(err)=>{
            Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          },
        }) 
      }
    });
  }
}
