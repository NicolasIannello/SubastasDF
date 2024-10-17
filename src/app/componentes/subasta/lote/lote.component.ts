import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiciosService } from '../../../servicios/servicios.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from "../../../servicios/html.pipe";
import { CommonModule } from '@angular/common';
import { VerImagenComponent } from '../../ver-imagen/ver-imagen.component';

@Component({
  selector: 'app-lote',
  standalone: true,
  imports: [SanitizeHtmlPipe, CommonModule, VerImagenComponent],
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

  constructor(public api: ServiciosService, private sanitizer: DomSanitizer){}

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  handleMessage(message: boolean) {    
    this.verImg=message;
  }

  cerrarModal() {
    this.lote=[]
    this.evento=[]
    this.imagenes=[];
    this.pdf=null;
    this.messageEvent.emit(false);
  }

  cargarImagenes(imgs:Array<any>, pdf:any){
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
    })
    console.log('init');
    
  }

  verImagen(id:number){
    this.verImg=true;
    this.imgID=(id-1);    
  }

}
