import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { ServiciosService } from '../../../../servicios/servicios.service';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-ver-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-evento.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class VerEventoComponent {
  @Output() messageEvent = new EventEmitter<boolean>();
  evento:{[key: string]: any}={lotes:[]};
  lotes:Array<any>=[];
  sources:any='';

  constructor(public api:AdminService, public api2:ServiciosService) {}

  cerrarModal() {
    this.evento={};
    this.lotes=[];
    this.messageEvent.emit(false);
  }

  init(ev:any){    
    this.lotes=[]
    this.evento=ev;
    for (let i = 0; i < ev.lotes.length; i++) {
      let datos={
        'uuid':ev.lotes[i].uuid_lote,
        'token':localStorage.getItem('token'),
        'tipo':1
      }      
      this.api.cargarLote(datos).subscribe({
        next:(value)=> {
          this.lotes.push(value.lote[0]);
        },
        error:(err)=> {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        },
      })      
    }
    this.api2.cargarArchivo(ev.img.img,'evento').then(resp=>{						
      if(resp!=false){
        this.sources=resp.url;
      }
    })
  }

  async generarExcel(){
    const doc = new jsPDF('p', 'pt', 'a4');

    let dato={
      'token': localStorage.getItem('token'),
      'tipo': 1
    }
    this.api2.checkTokenA(dato).subscribe({
      next: (value:any) => {
        if (value.ok) {
          let User=value.user;

          let html="<div style='width:33rem; font-family:Arial'>"+
          "<div style='display:flex'; text-align:right;>"+
          "<div style='width:50%; text-align:left; font-size:small;'> Admin: "+User+"</div>"+
            "<div style='width:50%; text-align:right; font-size:small;'>"+new Date().toLocaleString()+"</div>"+
          "</div>"+ 
          "<div style='display:flex; background-color:#3083dc; color:#F9F9F9; text-align:center;'>"+
            "<div style='width:33%'>Nombre</div>"+
            "<div style='width:34%'>Fecha de cierre</div>"+
            "<div style='width:33%'>Visibilidad</div>"+
          "</div>"+
          "<div style='display:flex'; text-align:center;>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:33%; text-align:center;'>"+this.evento['nombre']+"</div>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:34%; text-align:center;'>"+this.evento['fecha_cierre']+" "+this.evento['hora_cierre']+"</div>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:33%; text-align:center;'>"+this.evento['grupo']+"</div>"+
          "</div>"+
          "<div style='display:flex; background-color:#3083dc; color:#F9F9F9; text-align:center;'>"+
            "<div style='width:50%'>Modalidad</div>"+
            "<div style='width:50%'>Estado</div>"+
          "</div>"+
          "<div style='display:flex'; text-align:center;>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:50%; text-align:center;'>"+this.evento['modalidad']+"</div>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:50%; text-align:center;'>"+(this.evento['estado']==2? 'Finalizado':"En proceso")+"</div>"+
          "</div>"+
          "<div style='display:flex; background-color:#3083dc; color:#F9F9F9; text-align:center;'>"+
            "<div style='width:50%'>Configuracion</div>"+
            "<div style='width:50%'>Imagen de portada</div>"+
          "</div>"+
          "<div style='display:flex'; text-align:center;>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:50%; text-align:center;'>"+
              "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>Segundos entre cierres: "+this.evento['segundos_cierre']+"</div>"+
              "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>Mostrar precio: "+(this.evento['mostrar_precio']?'Si':'No')+"</div>"+
              "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>Mostrar ganadores: "+(this.evento['mostrar_ganadores']?'Si':'No')+"</div>"+
              "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>Mostrar ofertas: "+(this.evento['mostrar_ofertas']?'Si':'No')+"</div>"+
              "<div style='border: 1px solid rgb(48, 131, 220, 0.2); text-align:center;'>Mostrar fecha de cierre: "+(this.evento['publicar_cierre']?'Si':'No')+"</div>"+
            "</div>"+
            "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:50%; text-align:center;'>"+
              "<img src='"+this.sources+"' style='width: 90px;'>"+
            "</div>"+
          "</div>"+
          "<div style='background-color:#3083dc; color:#F9F9F9; text-align:center;'>Lotes</div>"+
          "<div style='display:flex; background-color:#3083dc; color:#F9F9F9; text-align:center; font-size:x-small;'>"+
            "<div style='width:20%'; font-size:x-small;>Titulo</div>"+
            "<div style='width:15%'; font-size:x-small;>Precio base</div>"+
            "<div style='width:15%'; font-size:x-small;>Oferta ganadora</div>"+
            "<div style='width:5%'; font-size:x-small;>Ofertas</div>"+
            "<div style='width:30%'; font-size:x-small;>Ganador</div>"+
            "<div style='width:15%'; font-size:x-small;>CUIL/CUIT</div>"+
          "</div>";
          let flag=0;
          for (let i = 0; i < this.lotes.length; i++) {
            let dato={
              'token':localStorage.getItem('token'),
              'lote':this.lotes[i]['uuid'],
              'evento':'null',
              'tipo':1
            }
            let oferta
            this.api2.ofertaDatos(dato).subscribe({
              next:(value)=> {
                  oferta=value.ofertaDB
                  html+="<div style='display:flex'; text-align:center;>"+
                    "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:20%; font-size:x-small; text-align:center;'>"+this.lotes[i]['titulo']+"</div>"+
                    "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:15%; font-size:x-small; text-align:center;'>"+this.lotes[i]['precio_base']+"</div>"+
                    "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:15%; font-size:x-small; text-align:center;'>"+(oferta[0] ? oferta[0].cantidad : "-")+"</div>"+
                    "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:5%; font-size:x-small; text-align:center;'>"+oferta.length+"</div>"+
                    "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:30%; font-size:x-small; text-align:center;'>"+this.lotes[i]['ganador']+"</div>"+
                    "<div style='border: 1px solid rgb(48, 131, 220, 0.2); width:15%; font-size:x-small; text-align:center;'>"+(oferta[0] ? oferta[0].user.cuil_cuit : "-")+"</div>"+
                  "</div>";
                  flag++;
                  if(flag==this.lotes.length){
                    html+="</div>"

                    doc.html(html, {
                      callback: (doc: jsPDF) => {
                        doc.save(this.evento['nombre'].includes('.') ? this.evento['nombre']+".pdf" : this.evento['nombre']);
                      },
                      margin: [35, 0, 0, 35],
                      autoPaging:'text'
                    });
                  }
              },
              error(err) { 
              },
            })
          }
        }else{
          localStorage.removeItem('token')
        }
      },
      error(err:any) {
        localStorage.removeItem('token')
      },		
    });
  }

}
