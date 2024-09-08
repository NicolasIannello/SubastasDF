import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datos-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './datos-user.component.html',
  styleUrl: './datos-user.component.css'
})
export class DatosUserComponent implements OnInit{
  camposUser:Array<string>=['','','','','Google'];
  @Input() alertasUser:Array<string>=[];
  @Output() messageEvent = new EventEmitter<Array<any>>();

  ngOnInit(): void {
    this.sendDatosUser();
  }

  sendDatosUser() {    
    this.messageEvent.emit(this.camposUser);
  }
}
