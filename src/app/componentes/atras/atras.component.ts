import { Component } from '@angular/core';
import { ServiciosService } from '../../servicios/servicios.service';

@Component({
  selector: 'app-atras',
  standalone: true,
  imports: [],
  templateUrl: './atras.component.html',
  styleUrl: '../panel-admin/usuarios/usuarios.component.css'
})
export class AtrasComponent {

  constructor(public api:ServiciosService){}

  atras(){
    window.location.href=this.api.getLastPage()
  }
}
