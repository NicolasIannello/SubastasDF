import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListaLotesComponent } from "../lista-lotes/lista-lotes.component";
import { AdminService } from '../../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { ServiciosService } from '../../../../servicios/servicios.service';

@Component({
  selector: 'app-editar-evento',
  standalone: true,
  imports: [FormsModule, CommonModule, ListaLotesComponent],
  templateUrl: './editar-evento.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class EditarEventoComponent {
  @Output() messageEvent = new EventEmitter<boolean>();
  evento:{[key: string]: any}={lotes:[]};
  eventoNuevo:{[key: string]: any}={lotes:[]}
  lotes:Array<any>=[];
  alertas:Array<string>=['','','','',''];
  lotesLista:boolean=false;
  @ViewChild(ListaLotesComponent)listaComp!:ListaLotesComponent;
  img:any|null=[];
  sources:any='';
  sources2:any='';
  @ViewChild('imagen') inputImagen!: ElementRef;

  constructor(public api:AdminService, public api2:ServiciosService) {}

  handleMessage(obj: {message:boolean,lotes:Array<string>}) {    
    this.lotesLista=obj.message;
    if(obj.lotes.length>0){
      let datos={
        'evento':this.evento['uuid'],
        'lotes':obj.lotes,
        'token':localStorage.getItem('token'),
        'tipo':1
      }
      this.api.agregarLotes(datos).subscribe({
        next: (value:any) => {
          if(value.ok) {
            Swal.fire({title:'Lotes agregados con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            this.cargarEvento(this.evento['uuid'])
          }
          if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        },
        error(err:any) {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
        },		
      });
    }
  }

  cerrarModal() {
    this.eventoNuevo={};
    this.evento={};
    this.alertas=['','','','',''];
    this.lotes=[];
    this.img=[];
    this.sources='';
    this.sources2='';
    this.inputImagen.nativeElement.value = "";
    this.messageEvent.emit(false);
  }

  actualizarEvento(){
    let flag=true;
    this.alertas[0]=this.eventoNuevo['nombre']=='' ? 'El campo es obligatorio' : '';
    this.alertas[1]=this.eventoNuevo['fecha_inicio']=='' ? 'El campo es obligatorio' : '';
    this.alertas[2]=this.eventoNuevo['fecha_cierre']=='' ? 'El campo es obligatorio' : '';
    if(this.eventoNuevo['nombre']=='' || this.eventoNuevo['fecha_inicio']=='' || this.eventoNuevo['fecha_cierre']=='') flag=false;

    if(flag){
      let datos={
        'uuid':this.eventoNuevo['uuid'],
        'campos':{
          'categoria': this.eventoNuevo['categoria'],
          'eventos': this.eventoNuevo['eventos'],
          //'fecha_cierre': this.eventoNuevo['fecha_cierre'],
          //'fecha_inicio': this.eventoNuevo['fecha_inicio'],
          //'hora_inicio': this.eventoNuevo['hora_inicio'],
          //'hora_cierre': this.eventoNuevo['hora_cierre'],
          'segundos_cierre': this.eventoNuevo['segundos_cierre'],  
          'home': this.eventoNuevo['home'],
          'inicio_automatico': this.eventoNuevo['inicio_automatico'],
          'mostrar_precio':this.eventoNuevo['mostrar_precio'],
          'mostrar_ganadores':this.eventoNuevo['mostrar_ganadores'],
          'mostrar_ofertas':this.eventoNuevo['mostrar_ofertas'],
          'grupo':this.eventoNuevo['grupo'],
          'modalidad': this.eventoNuevo['modalidad'],
          'nombre': this.eventoNuevo['nombre'],
          'publicar_cierre': this.eventoNuevo['publicar_cierre'],
        },
        'token':localStorage.getItem('token'),
        'tipo':1
      }
      this.api.actualizarEvento(datos).subscribe({
        next: (value:any) => {
          if(value.ok) Swal.fire({title:'Evento actualizado con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          if(this.img.length==0 && this.img.length==0) this.cerrarModal();
        },
        error(err:any) {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
        },
      });
      if(this.img!=null && this.img.length!=0){
        const formData = new FormData();
        formData.append('uuid', this.evento['uuid']);  
        formData.append('img', this.img[0]);  
        formData.append('caso', 'edit');
        formData.append('token', localStorage.getItem('token')!);  
        formData.append('tipo', '1');	
        this.api.imagenEvento(formData).then(resp =>{
          if(resp.ok){
            Swal.fire({title:'Evento creado con exito',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
          }else{
            Swal.fire({title:'Error en la carga de imagen',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
          }
          this.cerrarModal();
        }, (err)=>{				
          Swal.fire({title:'Error en la carga de imagen',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
          this.cerrarModal();   
        });
      }
    }
  }

  init(ev:any,flag:boolean){
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
    if(flag) this.eventoNuevo= Object.assign( { }, this.evento);
  }

  lotesListaModal(){
    this.lotesLista=true;
    this.listaComp.init();
  }

  eliminar(id:string,nom:string){
    Swal.fire({
      title: "Esta por desvincular un lote",
      text: '¿Desea desvincular el lote: "'+nom+'"?',
      showCancelButton: true,
      confirmButtonText: "Desvincular",
      confirmButtonColor: "red",
      cancelButtonText: "Atras",
    }).then((result) => {
      if (result.isConfirmed) {
        let dato={
          "lote":id,
          "token":localStorage.getItem('token'),
          "tipo":1,
        }        
        this.api.quitarLote(dato).subscribe({
          next: (value:any) => {
            if(value.ok) {
              Swal.fire({title:'Lotes quitado con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
              this.cargarEvento(this.evento['uuid'])
            }
            if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          },
          error(err:any) {
            Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
          },		
        });
      }
    });
  }

  cargarEvento(uuid:string){
    let datos={
      'dato':uuid,
      'token':localStorage.getItem('token'),
      'tipo':1
    }      
    this.api.cargarEvento(datos).subscribe({
      next:(value)=> {          
        this.evento=value.evento[0];
        this.init(this.evento,false)
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })    
  }

  showImg(event: Event){
		this.sources2='';
    this.img=null;
    const element = event.currentTarget as HTMLInputElement;
		this.img=element.files;    
    
    const reader = new FileReader();
    reader.readAsDataURL(element.files![0]);

    reader.onloadend = ()=>{
      this.sources2=reader.result;
    }
	}
}
