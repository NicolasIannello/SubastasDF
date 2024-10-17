import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../../../servicios/servicios.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LoteComponent } from "../lote/lote.component";

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule, RouterModule, LoteComponent],
  templateUrl: './lotes.component.html',
  styleUrl: '../../panel-admin/usuarios/usuarios.component.css'
})
export class LotesUserComponent implements OnInit{
  lotes:Array<any>=[]
  imagenes: Array<{link:SafeResourceUrl}> = [];
  error:number=0
  evento:any=[];
  loteModal:any=[];
  ver:boolean=false;
  @ViewChild(LoteComponent)loteComp!:LoteComponent;

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
        this.evento=value.evento[0]
        this.error=value.t;        
        for (let i = 0; i < value.evento[0].lotes.length; i++) {          
          let datos={
            'uuid':value.evento[0].lotes[i].uuid_lote,
            'token':localStorage.getItem('token'),
            'tipo':1
          }      
          this.api.cargarLote(datos).subscribe({
            next:(value)=> {              
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

  handleMessage(message: boolean) {    
    this.loteModal=[];
    this.ver=message; 
  }

  verLote(lote:any){
    this.ver=true;
    this.loteModal=lote;    
    console.log(this.loteModal);
    
    this.loteComp.cargarImagenes(this.loteModal.img, this.loteModal.pdf);
  }
}
