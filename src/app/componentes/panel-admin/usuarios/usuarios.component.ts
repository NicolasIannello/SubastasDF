import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{
  Usuarios:Array<any>=[];
  Total:number=0;
  pagina:number=0;
  pagU:number=0;
  error:boolean=false;
  
  constructor(public api: AdminService){ }

  ngOnInit(): void {
    let dato={
      'token':localStorage.getItem('token'),
      'tipo': 1
    }
    this.api.cargarUsers(dato).subscribe({
      next: (value)=>{
        this.Usuarios = [...value.users];
        this.Total=value.total;
        this.pagU=Math.ceil(this.Total/20)
      },
      error: (err)=>{
        this.error=true;
      }
    })
    
  }

  atras(){
    if(this.pagina>0){
      this.pagina--;
      this.recargar()
    }
  }
  siguiente(){    
    if(this.pagina<this.pagU-1){
      this.pagina++;
      this.recargar()
    }
  }

  recargar(){
    let dato={
      'token':localStorage.getItem('token'),
      'tipo': 1
    }
    this.api.cargarUsersDesde(dato,this.pagina*20).subscribe({
      next: (value)=>{
        this.Usuarios = [...value.users];
        this.Total=value.total;
        this.pagU=Math.ceil(this.Total/20)
      },
      error: (err)=>{
        this.error=true;
      }
    })
  }

  eliminar(id:string,nom:string){
    console.log(id);
    console.log(nom);
    Swal.fire({
      title: "Esta por borrar una cuenta",
      text: "¿Desea borrar la cuenta "+nom+" ?",
      showCancelButton: true,
      confirmButtonText: "Borrar",
      confirmButtonColor: "red",
      cancelButtonText: "Atras",
    }).then((result) => {
      if (result.isConfirmed) {
        let dato={
          "id":id,
          "token":localStorage.getItem('token'),
          "tipo":1
        }
        this.api.deleteUsers(dato).subscribe({
          next:(value)=> {
            if(value.ok) Swal.fire({title:'Usuario eliminado con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            this.recargar();
            },
          error:(err)=> {
            Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          },
        })
      }
    });
  }

}