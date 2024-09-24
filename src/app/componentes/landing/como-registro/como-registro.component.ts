import { Component } from '@angular/core';
import { ServiciosService } from '../../../servicios/servicios.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-como-registro',
  standalone: true,
  imports: [],
  templateUrl: './como-registro.component.html',
  styleUrl: '../../logreg/datos-acceso/datos-acceso.component.css'
})
export class ComoRegistroComponent{
  textos:Array<string>=[]

  constructor(public api:ServiciosService, public router: Router, public route: ActivatedRoute) {     
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd),startWith(this.router)).subscribe((event) => {
      let flag = event.url.toLowerCase().split('/')[1];
      if(flag=="registro") this.textos=this.api.getTextos(0)
      if(flag=="nosotros") this.textos=this.api.getTextos(1)
    });
  }
}