import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SanitizeHtmlPipe } from '../../../../servicios/html.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServiciosService } from '../../../../servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { VerImagenComponent } from "../../../ver-imagen/ver-imagen.component";
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-ver-lote',
  standalone: true,
  imports: [SanitizeHtmlPipe, CommonModule, VerImagenComponent],
  templateUrl: './ver-lote.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class VerLoteComponent{
  @Output() messageEvent = new EventEmitter<boolean>();
  @Input() lote:{[key: string]: any}=[];
  imagenes: Array<{link:SafeResourceUrl,id:number}> = [];
  pdf:SafeResourceUrl|null=null;
  verImg:boolean=false;
  imgID:number=-1;
  Ofertas:Array<any>=[];

  constructor(public api: ServiciosService, private sanitizer: DomSanitizer){}

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  handleMessage(message: boolean, tipo:string) {    
    this.verImg=message;
  }

  cerrarModal() {
    this.imagenes=[];
    this.pdf=null;
    this.Ofertas=[]
    this.messageEvent.emit(false);
  }

  cargarImagenes(imgs:Array<any>, pdf:any){
    this.imagenes=[];
    this.pdf=null;
    let index=1
    for (let i = 0; i < imgs.length; i++) {      
      this.api.cargarArchivo(imgs[i].img,'lotes').then(resp=>{						
        if(resp!=false){
          this.imagenes.push({link:resp.url, id:index});
          index++;
        }
      })
    }    
    this.api.cargarArchivo(pdf.pdf,'pdfs').then(resp=>{						
      if(resp!=false){
        this.pdf=this.transform(resp.url);
      }
    })
  }

  verImagen(id:number){
    this.verImg=true;
    this.imgID=(id-1);    
  }

  async generarExcel(){
    //const pdfData = this.myModal.nativeElement;

    // const canvas = this.html2canvas(pdfData, {
    //   onrendered: function (canvas:any) {
    //     document.body.appendChild(canvas);
    //   },
    //   allowTaint: true,
    //   useCORS: true,
    //   height: 10000
    // });
    // var imgData = (await canvas).toDataURL('image/png');
    // var imgWidth = 210; 
    // var pageHeight = 295;  
    // var imgHeight = (await canvas).height * imgWidth / (await canvas).width;
    // var heightLeft = imgHeight;
    // var doc = new jsPDF('p', 'mm');
    // var position = 10; // give some top padding to first page
    
    // doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    // heightLeft -= pageHeight;
    
    // while (heightLeft >= 0) {
    //   position += heightLeft - imgHeight; // top padding for other pages
    //   doc.addPage();
    //   doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    //   heightLeft -= pageHeight;
    // }
    // doc.save( 'file.pdf');
    //------------------------------------------------------------------
    // const doc = new jsPDF({
    //   unit: 'px',
    //   format: [595, 842]
    // });
    //const doc = new jsPDF('p', 'mm');
    const doc = new jsPDF('p', 'pt', 'a4');

    let html=
    "<div style='width:33rem'>"+
      "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Titulo</div>"+
      "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>"+this.lote['titulo']+"</div>"+
      "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Descripcion</div>"+
      "<div style='border: 1px solid rgb(48, 131, 220, 0.2);'>"+this.lote['descripcion']+"</div>"+
      "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Aclaracion</div>"+
      "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>"+(this.lote['aclaracion']=='' ? '-' : this.lote['aclaracion'])+"</div>"+
      "<div style='display:flex; background-color:#3083dc; color:#F9F9F9; text-align:center;'>"+
        "<div style='width:33%'>Precio Base</div>"+
        "<div style='width:34%'>Incremento</div>"+
        "<div style='width:33%'>Precio Salida</div>"+
      "</div>"+
      "<div style='display:flex'; text-align:center;>"+
        "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:33%; text-align:center;'>"+this.lote['moneda']+" "+this.lote['precio_base']+"</div>"+
        "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:34%; text-align:center;'>"+this.lote['moneda']+" "+this.lote['incremento']+"</div>"+
        "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:33%; text-align:center;'>"+((this.lote['precio_salida']!='null' && this.lote['precio_salida']!='') ? this.lote['moneda']+' '+this.lote['precio_salida'] : '-')+"</div>"+
      "</div>"+
      "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Estado</div>"+
      "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>"+(this.lote['disponible'] ? 'Disponible' : 'No disponible')+"</div>"+
      "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Imagenes</div>"+
      "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center'>";
    
    for (let i = 0; i < this.imagenes.length; i++) {
      html+="<img src='"+this.imagenes[i].link+"' style='width: 150px;'>";
    }
    html+=
    "</div>"+
    "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Ofertas</div>"+
    "<div style='display: flex; background-color:#3083dc; color:#F9F9F9; text-align:center;'>"+
        "<div style='width:20%'>Fecha</div>"+
        "<div style='width:20%'>Evento</div>"+
        "<div style='width:20%'>Usuario</div>"+
        "<div style='width:20%'>Metodo</div>"+
        "<div style='width:20%'>Estado</div>"+
        "<div style='width:20%'>Monto</div>"+
    "</div>";
    if(this.Ofertas.length==0) html+="<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>No hay ofertas</div>"


    html+="</div>"

    doc.html(html, {
      callback: (doc: jsPDF) => {
        doc.save(this.lote['titulo']);
      },
      margin: [40, 200, 60, 40]
    });
  }
}
