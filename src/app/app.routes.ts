import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LogregComponent } from './componentes/logreg/logreg.component';
import { VerificacionComponent } from './componentes/verificacion/verificacion.component';
import { LandingComponent } from './componentes/landing/landing.component';
import { PanelAdminComponent } from './componentes/panel-admin/panel-admin.component';
import { LoginComponent } from './componentes/panel-admin/login/login.component';
import { UsuariosComponent } from './componentes/panel-admin/usuarios/usuarios.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    { path: '', component: LandingComponent , children: [
        { path: '', component: InicioComponent },
        { path: 'login', component: LogregComponent },
        { path: 'verificar/:token', component: VerificacionComponent },
    ]},
    { path: 'panelAdmin', component: PanelAdminComponent , children: [
        { path: '', component: LoginComponent },
        { path: 'usuarios', component: UsuariosComponent, canActivate:[authGuard] },
        { path: '**',   redirectTo: '', pathMatch: 'full' },
    ]},
    { path: '**',   redirectTo: '', pathMatch: 'full' },
];
