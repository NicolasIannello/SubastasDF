import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import { ServiciosService } from '../../../servicios/servicios.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{
  @Input() widthC: number | undefined;
  @Input() cap: number | undefined;
  Eventos:Array<any>=[];
  error:number=0

  constructor(public api:AdminService, public api2:ServiciosService) {}

  ngOnInit(): void {
    let datos={
      'dato': 'home',
      'token':localStorage.getItem('token'),
      'tipo':1
    }      
    
    this.api.cargarEvento(datos).subscribe({
      next:(value)=> {          
        if(value.ok) this.Eventos=value.evento
        if(!value.ok) this.error=1;
        if(value.t && value.t==3) this.error=3
        console.log(this.Eventos);
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
  }
}
