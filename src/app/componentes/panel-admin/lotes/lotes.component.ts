import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CrearLoteComponent } from "./crear-lote/crear-lote.component";

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule, CrearLoteComponent],
  templateUrl: './lotes.component.html',
  styleUrl: '../usuarios/usuarios.component.css'
})
export class LotesComponent {

}
