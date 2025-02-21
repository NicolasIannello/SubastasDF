import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ver-imagen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-imagen.component.html',
  styleUrl: '../panel-admin/usuarios/usuarios.component.css'
})
export class VerImagenComponent {
  @Output() messageEvent = new EventEmitter<boolean>();
  @Input() imagen:number=0;
  @Input() imagenes: Array<{link:SafeResourceUrl,id:number}> = [];
  @Input() verImg:boolean=false;
  @Input() botones:boolean=true;

  cerrarModal() {
    this.messageEvent.emit(false);
  }

  atras(){
    if(this.imagen>0) this.imagen--;
  }
  siguiente(){
    if(this.imagen<this.imagenes.length-1) this.imagen++;
  }
}
