import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{
  Usuarios:Array<any>=[];
  
  constructor(public api: AdminService){ }

  ngOnInit(): void {
    let dato={
      'token':localStorage.getItem('token'),
      'tipo': 1
    }
    this.api.cargarUsers(dato).subscribe({
      next: (value)=>{
        this.Usuarios = [...value.users, ...value.emps, ...value.viejos];                
      },
      error: (err)=>{
      }
    })
  }

}