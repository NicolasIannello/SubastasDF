import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LogregComponent } from './componentes/logreg/logreg.component';
import { VerificacionComponent } from './componentes/verificacion/verificacion.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'login', component: LogregComponent },
    { path: 'verificar/:token', component: VerificacionComponent },
    { path: '**',   redirectTo: '', pathMatch: 'full' },
];
