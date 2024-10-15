import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../../../servicios/servicios.service';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lotes.component.html',
  styleUrl: '../../panel-admin/usuarios/usuarios.component.css'
})
export class LotesUserComponent implements OnInit{
  lotes:Array<any>=[]
  imagenes: Array<{link:SafeResourceUrl}> = [];

  constructor(public ruta:ActivatedRoute, public api: AdminService, public api2:ServiciosService){ }

  ngOnInit(): void {
    let datos={
      'flag': false,
      'dato': this.ruta.snapshot.paramMap.get('id'),
      'token':localStorage.getItem('token'),
      'tipo':1
    }      
    this.api.cargarEvento(datos).subscribe({
      next:(value)=> {        
        for (let i = 0; i < value.evento[0].lotes.length; i++) {          
          let datos={
            'uuid':value.evento[0].lotes[i].uuid_lote,
            'token':localStorage.getItem('token'),
            'tipo':1
          }      
          this.api.cargarLote(datos).subscribe({
            next:(value)=> {
              console.log(value.lote[0].img[0].img);
              
              this.lotes.push(value.lote[0]);
              this.api2.cargarArchivo(value.lote[0].img[0].img,'lotes').then(resp=>{						
                if(resp!=false){                  
                  this.imagenes.push({link:resp.url});
                }
              })
            },
            error:(err)=> {
              Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            },
          })      
        }   
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })  
  }
}
