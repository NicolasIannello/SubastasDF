import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Countries } from '../paises';
import { countries } from '../paises-data';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datos-domicilio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './datos-domicilio.component.html',
  styleUrl: './datos-domicilio.component.css'
})
export class DatosDomicilioComponent {
  Paises:Countries[]=countries;
  campos:Array<any>=[1000,1000,'','',''];
  @Input() alertasDom:Array<string>=[];
  @Output() messageEvent = new EventEmitter<Array<any>>();

  ngOnInit(): void {
    this.sendDatosDom();
  }

  sendDatosDom() {
    this.messageEvent.emit(this.campos,);
  }
}
