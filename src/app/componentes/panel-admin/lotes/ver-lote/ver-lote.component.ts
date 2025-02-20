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
      let dato={
        'token':localStorage.getItem('token'),
        'lote':this.lote['uuid'],
        'evento':'null',
        'tipo':1
      }
      this.api.ofertaDatos(dato).subscribe({
        next:(value)=> {
            this.Ofertas=value.ofertaDB
        },
        error(err) { 
        },
      })
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
    "<div style='width:33rem; font-family:Arial'>"+
      "<div style='display:flex'; text-align:right;>"+
        "<div style='width:50%; text-align:left; font-size:small;'> Admin: "+this.api.getUserAdmin()+"</div>"+
        "<div style='width:50%; text-align:right; font-size:small;'>"+new Date().toLocaleString()+"</div>"+
      "</div>"+ 
      "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Titulo</div>"+
      "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>"+this.lote['titulo']+"</div>"+
      // "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Descripcion</div>"+
      // "<div style='border: 1px solid rgb(48, 131, 220, 0.2); font-size:small;'>"+this.lote['descripcion']+"</div>"+
      // "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Aclaracion</div>"+
      // "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>"+(this.lote['aclaracion']=='' ? '-' : this.lote['aclaracion'])+"</div>"+
      "<div style='display:flex; background-color:#3083dc; color:#F9F9F9; text-align:center;'>"+
        "<div style='width:50%'>Monto de arranque</div>"+
        "<div style='width:34%'>Incremento</div>"+
        "<div style='width:50%'>Monto esperado</div>"+
      "</div>"+
      "<div style='display:flex'; text-align:center;>"+
        "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:50%; text-align:center;'>"+this.lote['moneda']+" "+this.lote['precio_base']+"</div>"+
        "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:34%; text-align:center;'>"+this.lote['moneda']+" "+this.lote['incremento']+"</div>"+
        "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:50%; text-align:center;'>"+((this.lote['precio_salida']!='null' && this.lote['precio_salida']!='') ? this.lote['moneda']+' '+this.lote['precio_salida'] : '-')+"</div>"+
      "</div>"+
      // "<div style='display:flex; background-color:#3083dc; color:#F9F9F9; text-align:center;'>"+
      //   "<div style='width:33%'>Fecha de cierre</div>"+
      //   "<div style='width:34%'>Ofertas</div>"+
      //   "<div style='width:34%'>Estado</div>"+
      // "</div>"+
      // "<div style='display:flex'; text-align:center;>"+
      //   "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:33%; text-align:center;'>"+this.lote['evento']['fecha_cierre']+" "+this.lote['evento']['hora_cierre']+"</div>"+
      //   "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:34%; text-align:center;'>"+this.Ofertas.length+"</div>"+
      //   "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:34%; text-align:center;'>"+(this.lote['evento']['estado']==2? 'Finalizado':"En proceso")+"</div>"+
      // "</div>"+
      // "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Estado</div>"+
      // "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>"+(this.lote['disponible'] ? 'Disponible' : 'No disponible')+"</div>"+
      "<div style='display:flex; background-color:#3083dc; color:#F9F9F9; text-align:center;'>"+
        "<div style='width:33%'>Visitas</div>"+
        "<div style='width:33%'>Ganador</div>"+
        "<div style='width:33%'>Mayor oferta</div>"+
      "</div>"+
      "<div style='display:flex'; text-align:center;>"+
        "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:33%; text-align:center;'>"+this.lote['visitas']+"</div>"+
        "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:33%; text-align:center;'>"+(this.lote['ganador']=='' ? '-':this.lote['ganador'])+"</div>"+
        "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:33%; text-align:center;'>"+(this.lote['precio_ganador']=='' ? '-':this.lote['precio_ganador'])+"</div>"+
      "</div>"+
      // "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Terminos y condiciones</div>"+
      // "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>"+this.lote['pdf']['name']+"</div>"+
      "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Imagenes</div>"+
      "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center'>";
    
    //for (let i = 0; i < this.imagenes.length; i++) {
      html+="<img src='"+this.imagenes[0].link+"' style='width: 150px;'>";
    //}
    html+="<br><span>Se muestra 1 imagen de "+this.imagenes.length+" totales</span>";
    html+=
    "</div>"+
    "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Ofertas</div>"+
    "<div style='display: flex; background-color:#3083dc; color:#F9F9F9; text-align:center;'>"+
        "<div style='width:20%'>Fecha</div>"+
        "<div style='width:45%'>Usuario</div>"+
        "<div style='width:15%'>Metodo</div>"+
        "<div style='width:20%'>CUIL/CUIT</div>"+
        "<div style='width:20%'>Monto</div>"+
    "</div>";
    if(this.Ofertas.length==0) {
      html+="<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>No hay ofertas</div>"
    }else{
      let cantidad=this.Ofertas.length>5 ? 5 : this.Ofertas.length;
      for (let i = 0; i < cantidad; i++) {
        html+="<div style='display: flex; text-align:center;'>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:20%; font-size:smaller;'>"+this.Ofertas[i]['fecha']+"</div>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:45%; font-size:smaller;'>"+this.Ofertas[i]['mail']+"</div>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:15%; font-size:smaller;'>"+this.Ofertas[i]['tipo']+"</div>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:20%; font-size:smaller;'>"+this.Ofertas[i]['user']['cuil_cuit']+"</div>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:20%; font-size:smaller;'>"+this.Ofertas[i]['cantidad']+"</div>"+
        "</div>";
      }
      html+="<br><span>Se muestra 5 ofertas de "+this.Ofertas.length+" totales</span>";
    }


    html+="</div>"

    doc.html(html, {
      callback: (doc: jsPDF) => {
        doc.save(this.lote['titulo'].includes('.') ? this.lote['titulo']+".pdf" : this.lote['titulo']);
      },
      margin: [35, 0, 0, 35],
      autoPaging:'text'
    });
  }
}
