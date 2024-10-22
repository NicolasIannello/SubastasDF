import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/landing/inicio/inicio.component';
import { LogregComponent } from './componentes/logreg/logreg.component';
import { VerificacionComponent } from './componentes/verificacion/verificacion.component';
import { LandingComponent } from './componentes/landing/landing.component';
import { PanelAdminComponent } from './componentes/panel-admin/panel-admin.component';
import { LoginComponent } from './componentes/panel-admin/login/login.component';
import { UsuariosComponent } from './componentes/panel-admin/usuarios/usuarios.component';
import { authGuard } from './guard/auth.guard';
import { CambiarPassComponent } from './componentes/cambiar-pass/cambiar-pass.component';
import { WebComponent } from './componentes/panel-admin/web/web.component';
import { ComoRegistroComponent } from './componentes/landing/como-registro/como-registro.component';
import { ContactoComponent } from './componentes/landing/contacto/contacto.component';
import { LotesComponent } from './componentes/panel-admin/lotes/lotes.component';
import { EventosComponent } from './componentes/panel-admin/eventos/eventos.component';
import { EventosUserComponent } from './componentes/landing/eventos/eventos.component';
import { LotesUserComponent } from './componentes/subasta/lotes/lotes.component';
import { MiPerfilComponent } from './componentes/user/mi-perfil/mi-perfil.component';

export const routes: Routes = [
    { path: '', component: LandingComponent , children: [
        { path: '', component: InicioComponent },
        { path: 'login', component: LogregComponent },
        { path: 'registro', component: ComoRegistroComponent },
        { path: 'nosotros', component: ComoRegistroComponent },
        { path: 'contacto', component: ContactoComponent },
        { path: 'eventos', component: EventosUserComponent },
        { path: 'verificar/:token', component: VerificacionComponent },
        { path: 'cambio/:token', component: CambiarPassComponent },
        { path: 'evento/:id', component: LotesUserComponent, canActivate:[authGuard] },
        { path: 'mi-perfil', component: MiPerfilComponent, canActivate:[authGuard] },
    ]},
    { path: 'panelAdmin', component: PanelAdminComponent , children: [
        { path: '', component: LoginComponent },
        { path: 'usuarios', component: UsuariosComponent, canActivate:[authGuard] },
        { path: 'web', component: WebComponent, canActivate:[authGuard] },
        { path: 'lotes', component: LotesComponent, canActivate:[authGuard] },
        { path: 'eventos', component: EventosComponent, canActivate:[authGuard] },
        { path: '**',   redirectTo: '', pathMatch: 'full' },
    ]},
    { path: '**',   redirectTo: '', pathMatch: 'full' },
];
