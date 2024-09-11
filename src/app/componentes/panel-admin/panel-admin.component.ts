import { afterNextRender, Component, HostListener, inject, Injector } from '@angular/core';
import { AzulComponent } from "../navbar/azul/azul.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [AzulComponent, RouterOutlet],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent {
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
