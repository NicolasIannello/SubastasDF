import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  nlotes:number=0;
  loteModal:any=[];
  ver:boolean=false;
  @ViewChild(LoteComponent)loteComp!:LoteComponent;

  constructor(public ruta:ActivatedRoute, private router: Router, public api: AdminService, public api2:ServiciosService){ }

  ngOnInit(): void {
    let datos={
      'flag': false,
      'dato': this.ruta.snapshot.paramMap.get('id'),
      'token':localStorage.getItem('token'),
      'tipo':1
    }      
    let int = 0;
    this.api.cargarEvento(datos).subscribe({
      next:(value)=> {        
        this.evento=value.evento[0]
        this.nlotes=this.evento['lotes'].length
        this.error=value.t;        
        for (let i = 0; i < value.evento[0].lotes.length; i++) {          
          let datos={
            'uuid':value.evento[0].lotes[i].uuid_lote,
            'token':localStorage.getItem('token'),
            'tipo':1
          }      
          this.api.cargarLote(datos).subscribe({
            next:(value)=> {              
              this.lotes[i]=value.lote[0]
              //this.lotes.push(value.lote[0]);
              for (let j = 0; j < this.evento['vistas'].length; j++) {
                if(this.evento['vistas'][j].uuid_lote == this.lotes[i].uuid) this.lotes[i].estado='Visto'
              }
              for (let j = 0; j < this.evento['ofertas'].length; j++) {
                if(this.evento['ofertas'][j].uuid_lote == this.lotes[i].uuid) this.lotes[i].estado='Ofertado'
              }
              this.api2.cargarArchivo(value.lote[0].img[0].img,'lotes').then(resp=>{						
                if(resp!=false){                  
                  this.imagenes[i]={link:resp.url};
                  //this.imagenes.push({link:resp.url});
                }
              })
              int++;              
              if(this.ruta.snapshot.paramMap.get('id2') && this.ruta.snapshot.paramMap.get('id2')==value.lote[0].uuid){
                this.verLote(value.lote[0])
              }
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
    if(this.ruta.snapshot.paramMap.get('id2')){
      this.router.navigate(['evento',this.ruta.snapshot.paramMap.get('id')])
    }
    this.loteModal=[];
    this.ver=message; 
  }

  verLote(lote:any){
    if(!this.ruta.snapshot.paramMap.get('id2')) this.router.navigate(['evento',this.ruta.snapshot.paramMap.get('id'),'lote',lote.uuid])
    this.ver=true;
    this.loteModal=lote;    
    this.loteComp.cargarImagenes(this.loteModal.img, this.loteModal.pdf);
    let datos={
      'uuid_evento':this.ruta.snapshot.paramMap.get('id'),
      'uuid_lote':lote.uuid,
      'token':localStorage.getItem('token'),
      'tipo':1
    }      
    this.api2.setVista(datos).subscribe({ })      
  }
}
