import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { countries } from '../../logreg/paises-data';
import { Countries } from '../../logreg/paises';
import { ServiciosService } from '../../../servicios/servicios.service';
import Swal from 'sweetalert2';
import { AdminService } from '../../../servicios/admin.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: '../../panel-admin/usuarios/usuarios.component.css'
})
export class MiPerfilComponent implements OnInit{
  datoCambio:{ [key: string]: any } = {};
  datoCambioEMP:{ [key: string]: string } = {};
  datoCambioCheck:{ [key: string]: string } = {};
  datoCambioEMPCheck:{ [key: string]: string } = {};
  flagH:boolean=false;
  Paises:Countries[]=countries;
  paisI:number=1;

  constructor(public api:ServiciosService, public api2:AdminService){}

  ngOnInit(): void {
    let dato={
      "token":localStorage.getItem('token'),
      "tipo":1,
    }
    this.api.getDatos(dato).subscribe({
      next:(value)=> {
        if(value.ok){
          this.datoCambio=JSON.parse(JSON.stringify(value.userDatos[0]));
          this.datoCambioCheck=JSON.parse(JSON.stringify(value.userDatos[0]));
          console.log(this.datoCambio);
          if(value.userDatos[0].dato_empresa){
            this.datoCambioEMP=JSON.parse(JSON.stringify(value.userDatos[0].dato_empresa));
            this.datoCambioEMPCheck=JSON.parse(JSON.stringify(value.userDatos[0].dato_empresa));
            console.log(this.datoCambioEMP);
          }
          this.getPais(false)
        }
      },
      error:(err)=> {
      },
    })
  }

  checkCambio(key:string){
    this.flagH=this.datoCambio[key].toString()!=this.datoCambioCheck[key].toString();
  }

  getPais(flag:boolean){
    if(flag) this.datoCambio['provincia']=''
    for (let i = 0; i < this.Paises.length; i++) {
      if(this.Paises[i].name==this.datoCambio['pais']) this.paisI=i;
    }
  }

  actualizar(){
    let datos;
    switch (this.datoCambio['tipo']) {
      case 'emp':        
        datos={
          'persona_responsable': this.datoCambioEMP['persona_responsable'],
          'cuil_cuit': this.datoCambio['cuil_cuit'],
          'telefono': this.datoCambio['telefono'],
          'actividad': this.datoCambio['actividad'],
          'razon_social': this.datoCambioEMP['razon_social'],
          'nombre': this.datoCambio['nombre'],
          'como_encontro': this.datoCambio['como_encontro'],
          'pais': this.datoCambio['pais'],
          'provincia': this.datoCambio['provincia'],
          'ciudad': this.datoCambio['ciudad'],
          'postal': this.datoCambio['postal'],
          'domicilio': this.datoCambio['domicilio'],
        }
        break; 
      case 'user': 
        datos={
          'nombre': this.datoCambio['nombre'],
          'cuil_cuit': this.datoCambio['cuil_cuit'],
          'telefono': this.datoCambio['telefono'],
          'actividad': this.datoCambio['actividad'],
          'como_encontro': this.datoCambio['como_encontro'],
          'pais': this.datoCambio['pais'],
          'provincia': this.datoCambio['provincia'],
          'ciudad': this.datoCambio['ciudad'],
          'postal': this.datoCambio['postal'],
          'domicilio': this.datoCambio['domicilio'],
          'tipo': 'user'
        }
        break;
    }
    
    let dato={
      'token':localStorage.getItem('token'),
      "campos":datos,
      'tipo':1,
      'id':this.datoCambio['_id'],
    }
    this.api2.actualizarUser(dato).subscribe({
      next: (value:any) => {
        if(value.ok) Swal.fire({title:'Informacion actualizada con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
      error(err:any) {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
      },		
    });

  }
}