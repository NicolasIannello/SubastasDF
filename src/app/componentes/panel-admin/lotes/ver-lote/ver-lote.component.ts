import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SanitizeHtmlPipe } from '../../../../servicios/html.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServiciosService } from '../../../../servicios/servicios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-lote',
  standalone: true,
  imports: [SanitizeHtmlPipe, CommonModule],
  templateUrl: './ver-lote.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class VerLoteComponent{
  @Output() messageEvent = new EventEmitter<boolean>();
  @Input() lote:{[key: string]: any}=[];
  imagenes: Array<{link:SafeResourceUrl,id:number}> = [];
  pdf:SafeResourceUrl|null=null;

  constructor(public api: ServiciosService, private sanitizer: DomSanitizer){}

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  cerrarModal() {
    this.imagenes=[];
    this.pdf=null;
    this.messageEvent.emit(false);
  }

  cargarImagenes(imgs:Array<any>, pdf:any){
    this.imagenes=[];
    this.pdf=null;

    for (let i = 0; i < imgs.length; i++) {      
      this.api.cargarArchivo(imgs[i].img,'lotes').then(resp=>{						
        if(resp!=false){
          this.imagenes.push({link:resp.url, id:i+1});
        }
      })
    }    
    this.api.cargarArchivo(pdf.pdf,'pdfs').then(resp=>{						
      if(resp!=false){
        this.pdf=this.transform(resp.url);
      }
    })
  }
}
