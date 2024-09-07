import { Component } from '@angular/core';
import { DatosUserComponent } from "./datos-user/datos-user.component";
import { CommonModule } from '@angular/common';
import { DatosAccesoComponent } from "./things/datos-acceso/datos-acceso.component";

@Component({
  selector: 'app-logreg',
  standalone: true,
  imports: [DatosUserComponent, CommonModule, DatosAccesoComponent],
  templateUrl: './logreg.component.html',
  styleUrl: './logreg.component.css'
})
export class LogregComponent {
  tipo:string="user";

  cambiarTipo(tipo:string){
    this.tipo=tipo;
  }
}
