import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiciosService } from '../../../servicios/servicios.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from "../../../servicios/html.pipe";
import { CommonModule } from '@angular/common';
import { VerImagenComponent } from '../../ver-imagen/ver-imagen.component';
import { FormsModule } from '@angular/forms';

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
  oferta:number=0;

  constructor(public api: ServiciosService, private sanitizer: DomSanitizer){}

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  handleMessage(message: boolean) {    
    this.verImg=message;
  }

  cerrarModal() {
    //this.lote=[]
    //this.evento=[]
    this.imagenes=[];
    this.pdf=null;
    this.flagTimer=false;
    this.oferta=0;
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
      this.oferta=this.lote['precio_base'];
      this.countDown()
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

}
