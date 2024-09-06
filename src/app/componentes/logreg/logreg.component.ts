import { Component } from '@angular/core';
import { DatosUserComponent } from "./datos-user/datos-user.component";

@Component({
  selector: 'app-logreg',
  standalone: true,
  imports: [DatosUserComponent],
  templateUrl: './logreg.component.html',
  styleUrl: './logreg.component.css'
})
export class LogregComponent {

}
