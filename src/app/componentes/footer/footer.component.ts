import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  maps:string="https://www.google.com/maps/place/Avenida+Leandro+Niceforo+Alem+250,+C1003AAP+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.6050318,-58.3741518,16.25z/data=!4m6!3m5!1s0x95a3352d42c97abb:0x9de2e64629f0f5ec!8m2!3d-34.6048462!4d-58.3703963!16s%2Fg%2F11sn_3vb0t?entry=ttu";
  number:string="+5491127605336";
  @Input() widthC: number | undefined;
  @Input() cap: number | undefined;

  constructor(private router: Router){ }

  mapsG(){
    window.open(this.maps);
  }
  wspW(){
    window.open('https://wa.me/'+this.number);
  }
}
