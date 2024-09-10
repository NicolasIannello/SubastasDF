import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiciosService } from '../../servicios/servicios.service';

@Component({
  selector: 'app-verificacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verificacion.component.html',
  styleUrl: './verificacion.component.css'
})
export class VerificacionComponent implements OnInit{
  verificado:boolean|null=null;
  token:string|null=null;

  constructor(public ruta:ActivatedRoute, public api: ServiciosService){ }

  ngOnInit(): void {
    this.token = this.ruta.snapshot.paramMap.get('token');    
    let dato={
      'token':this.token,
      'tipo':2
    }
    this.api.validarCuenta(dato).subscribe({
      next: (value:any) => {
        this.verificado=value.ok
      },
      error(err:any) {
        localStorage.removeItem('token')
      },		
    });
  }
}
