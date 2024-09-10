import { afterNextRender, Component, HostListener, inject, Injector } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  injector = inject(Injector);
  title = 'subastas';
  width:number | undefined;
  cap:number = 1230;

  ngOnInit() {
    afterNextRender(() => this.width=window.innerWidth, {injector: this.injector});
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.width=window.innerWidth;
  }
}
