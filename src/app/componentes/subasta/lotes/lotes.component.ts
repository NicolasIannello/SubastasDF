import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../../../servicios/servicios.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LoteComponent } from "../lote/lote.component";
import { environment } from '../../../../environments/environment';

const link=environment.link;

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
  dateFin:Array<Date|null>=[];
  dateHoy:Date|null=null;
  flagTimer:Array<boolean>=[];
  stringCierre:Array<string>=[];
  flag2:Array<boolean>=[];
  totalDays:Array<number>=[];
  remHours:Array<number>=[];
  remMinutes:Array<number>=[];
  remSeconds:Array<number>=[];

  constructor(public ruta:ActivatedRoute, private router: Router, public api: AdminService, public api2:ServiciosService){ }

  ngOnInit(): void {
    this.dateHoy= new Date();
    let datos={
      'flag': false,
      'dato': this.ruta.snapshot.paramMap.get('id'),
      'token':localStorage.getItem('token'),
      'modalidad': window.location.href.includes(link) ? 'Subasta' : 'Remate',
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
            next:(value2)=> {              
              this.lotes[i]=value2.lote[0]
              //this.lotes.push(value2.lote[0]);
              for (let j = 0; j < this.evento['vistas'].length; j++) {
                if(this.evento['vistas'][j].uuid_lote == this.lotes[i].uuid) this.lotes[i].estadoV='Visto'
              }
              for (let j = 0; j < this.evento['ofertas'].length; j++) {
                if(this.evento['ofertas'][j].uuid_lote == this.lotes[i].uuid) this.lotes[i].estadoV='Ofertado'
              }
              this.api2.cargarArchivo(value2.lote[0].img[0].img,'lotes').then(resp=>{						
                if(resp!=false){                  
                  this.imagenes[i]={link:resp.url};
                  //this.imagenes.push({link:resp.url});
                }
              })
              int++;              
              this.dateFin[i]= new Date(Date.parse(value2.lote[0]['fecha_cierre']+' '+value2.lote[0]['hora_cierre']));
              this.flag2[i]=true;
              this.stringCierre[i]='';
              if(this.lotes[i].estado==1) this.flagTimer[i]=true;
              if(int==value.evento[0].lotes.length) this.countDown();
              if(this.ruta.snapshot.paramMap.get('id2') && this.ruta.snapshot.paramMap.get('id2')==value2.lote[0].uuid){
                this.verLote(value2.lote[0])
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

  countDown(){
    let flagloop = false;
    for (let id = 0; id < this.dateFin.length; id++) {
      const milliDiff: number = (this.dateHoy!.getTime()- this.dateFin[id]!.getTime())*-1;
    
      const totalSeconds = Math.floor(milliDiff / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);

      this.totalDays[id] = Math.floor(totalHours / 24);    
      this.remSeconds[id] = totalSeconds % 60;
      this.remMinutes[id] = totalMinutes % 60;
      this.remHours[id] = totalHours % 24;
            
      if(this.flag2[id]) flagloop=true;
    }
    this.timer()
  }

  timer(){
    let flagloop = false;
    for (let id = 0; id < this.dateFin.length; id++) {
      this.remSeconds[id]--
      if(this.remSeconds[id]<0) {
        this.remMinutes[id]--;
        this.remSeconds[id]=60;
      }
      if(this.remMinutes[id]<0){ 
        this.remHours[id]--;
        this.remMinutes[id]=60
      }
      if(this.remHours[id]<0) {
        this.totalDays[id]--
        this.remHours[id]=24;
      }
      
      if(this.totalDays[id]<0) {
        this.flagTimer[id]=false;
      }
      
      if(this.flagTimer[id]) flagloop=true;
    }
    if(flagloop) setTimeout( ()=>this.timer(), 1000);
  }
}
