import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datos-emp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-emp.component.html',
  styleUrl: '../datos-acceso/datos-acceso.component.css'
})
export class DatosEmpComponent implements OnInit{
  camposEmp:Array<string>=['','','','','','','Google'];
  @Input() alertasEmp:Array<string>=[];
  @Output() messageEvent = new EventEmitter<Array<any>>();

  ngOnInit(): void {
    this.sendDatosEmp();
  }

  sendDatosEmp() {
    this.messageEvent.emit(this.camposEmp);
  }
}
