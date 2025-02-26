import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiciosService } from '../../../servicios/servicios.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { VerImagenComponent } from '../../ver-imagen/ver-imagen.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SocketService } from '../../../servicios/socket.service';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-lote',
  standalone: true,
  imports: [CommonModule, VerImagenComponent, FormsModule, MatExpansionModule],
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
  flag2:boolean=true;
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
  fav:boolean=false;
  blink:string="datoLote";
  same:boolean=false;

  constructor(public api: ServiciosService, private sanitizer: DomSanitizer, public socketIo:SocketService){}

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  handleMessage(message: boolean) {    
    this.verImg=message;
  }

  cerrarModal() {
    this.blink="datoLote";
    this.same=false;
    this.imagenes=[];
    this.pdf=null;
    this.flagTimer=false;
    this.oferta=null;
    this.ofertaAuto=null
    this.programar=false;
    this.precio_actual=null;
    this.cantidad_ofertas=null;
    this.ganador=null;
    this.ofertaAutoExiste=null;
    this.fav=false;
    this.flag2=true;
    this.messageEvent.emit(false);
  }

  cargarImagenes(imgs:Array<any>, pdf:any){
    this.socketIo.onMessage().subscribe((message:any) => {      
      for (let i = 0; i < message.eventolotes.length; i++) {
        if(this.lote['uuid']==message.eventolotes[i].lote.uuid){
          this.cantidad_ofertas=message.nro;
          this.precio_actual=message.cantidad;
          this.ganador=message.user._id
          this.flag2=false;
          this.dateFin= new Date(Date.parse(message.eventolotes[i].lote.fecha_cierre+' '+message.eventolotes[i].lote.hora_cierre));
          this.dateHoy= new Date();
          this.countDown();
          this.blink="datoLote";
          this.same=this.ganador==this.api.getUserId();
          setTimeout( ()=>this.blink="datoLote blink", 250);
        } 
      }
    });
    this.socketIo.sendMessage(this.evento['uuid']);

    if(this.evento['estado']==1) this.flagTimer=true;
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
        this.pdf=this.transform(resp.url+'#toolbar=0');
      }
      this.dateFin= new Date(Date.parse(this.lote['fecha_cierre']+' '+this.lote['hora_cierre']));
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
            this.same=this.ganador==this.api.getUserId();            
        },
        error:(err)=> { },
      })
      this.api.getOfertaAuto(dato).subscribe({
        next:(value)=> {
          if(value.ok) this.ofertaAutoExiste=value.cantidad
        },
        error:(err)=> { },
      })
      this.api.getFavorito(dato).subscribe({
        next:(value)=> {
          this.fav=value.favDB!=0;
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

    if(this.flag2) this.timer();
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
      Swal.fire({
        title: "Esta por realizar una oferta", text: 'Antes de ofertar asegure haber leido los terminos y condiciones del lote',
        showCancelButton: true, confirmButtonText: "Crear", confirmButtonColor:'#3083dc', cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
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
        }
      });
    }else{
      Swal.fire({title:'Oferta invalida', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
    }
  }

  programarOferta(){
    if(this.ofertaAuto!=null && this.ofertaAuto>=this.lote['precio_base'] && (this.precio_actual==null || this.ofertaAuto>this.precio_actual)){
      Swal.fire({
        title: "Esta por programar una oferta automatica", text: 'Antes de programar una oferta automatica asegure haber leido los terminos y condiciones del lote',
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

  setFavorito(){
    let dato={
      'token':localStorage.getItem('token'),
      'lote':this.lote['uuid'],
      'evento':this.evento['uuid'],
      'tipo':1
    }
    this.api.setFavorito(dato).subscribe({
      next:(value)=> {
        this.fav= !this.fav;
      },
      error:(err)=> { },
    })
  }
}
