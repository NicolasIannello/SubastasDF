import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  activa:string='inicio';
  @Input() widthC: number | undefined;
  @Input() cap: number | undefined;
  menuOpen:boolean=false;
  menuOpen2:boolean=false;

  constructor(private router: Router){ }

  activar(tab:string){
    this.activa=tab;
    this.router.navigate(['/'+tab]);    
    this.menuOpen=false;
    this.menuOpen2=false;
  }

  open(){
    this.menuOpen=!this.menuOpen;
  }
  open2(){
    this.menuOpen2=!this.menuOpen2;
    this.activa= this.menuOpen2? "login" : '';
  }
}
