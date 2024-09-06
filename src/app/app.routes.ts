import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LogregComponent } from './componentes/logreg/logreg.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'login', component: LogregComponent },
    { path: '**',   redirectTo: '', pathMatch: 'full' },
];
