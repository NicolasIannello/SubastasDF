import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import { ServiciosService } from '../../../servicios/servicios.service';
import { RouterModule } from '@angular/router';
import { SafeResourceUrl } from '@angular/platform-browser';
import { VerImagenComponent } from '../../ver-imagen/ver-imagen.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule, VerImagenComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{
  @Input() widthC: number | undefined;
  @Input() cap: number | undefined;
  Eventos:Array<any>=[];
  error:number=0
  verImg:boolean=false;
  imagenes: Array<{link:SafeResourceUrl,id:number}> = [];

  constructor(public api:AdminService, public api2:ServiciosService) {}

  handleMessage(message: boolean, tipo:string) {    
    this.verImg=message;
  }

  verImagen(id:number){
    this.verImg=true;
    this.imagenes=[];
    this.imagenes.push({link: this.Eventos[id].img.img, id: 0})
  }

  ngOnInit(): void {
    if(localStorage.getItem('token')!=null){
      let datos={
        'flag': true,
        'dato': 'home',
        'token':localStorage.getItem('token'),
        'tipo':1
      }      
      
      this.api.cargarEvento(datos).subscribe({
        next:(value)=> {          
          if(value.ok) this.Eventos=value.evento
          //if(!value.ok) this.error=1;
          //if(value.t && value.t==3) this.error=3
          this.error=value.t;
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
