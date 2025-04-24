import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import { ServiciosService } from '../../../servicios/servicios.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SafeResourceUrl } from '@angular/platform-browser';
import { VerImagenComponent } from '../../ver-imagen/ver-imagen.component';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, RouterModule, VerImagenComponent],
  templateUrl: './eventos.component.html',
  styleUrl: '../../logreg/datos-acceso/datos-acceso.component.css'
})
export class EventosUserComponent implements OnInit{
  Eventos:Array<any>=[];
  error:number=0
  verImg:boolean=false;
  imagenes: Array<{link:SafeResourceUrl,id:number}> = [];

  constructor(public api:AdminService, public api2:ServiciosService, @Inject(PLATFORM_ID) private platformId: Object) {}

  handleMessage(message: boolean, tipo:string) {    
    this.verImg=message;
  }

  verImagen(id:number){
    this.verImg=true;
    this.imagenes=[];
    this.imagenes.push({link: this.Eventos[id].img.img, id: 0})
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if(localStorage.getItem('token')!=null){
        let datos={
          'flag': true,
          'dato': 'eventos',
          'token':localStorage.getItem('token'),
          'modalidad': '',//window.location.href.includes(link) ? 'Subasta' : 'Licitacion',
          'estado': 2,
          'tipo':1
        }      
      
        this.api.cargarEvento(datos).subscribe({
          next:(value)=> {          
            if(value.ok) this.Eventos=value.evento
            if(!value.ok) this.error=1;
            if(value.t && value.t==3) this.error=3
            for (let i = 0; i < this.Eventos.length; i++) {
              this.api2.cargarArchivo(this.Eventos[i].img.img,'evento').then(resp=>{						
                if(resp!=false){
                  this.Eventos[i].img.img=resp.url;
                }
              })
            }
          },
          error:(err)=> {
            this.error= !err.error.ok ? 1 : 2
          },
        })  
      }else{
        this.error=1
      }
    }
  }
}
