import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RecuperarPasswordComponent } from './pages/recuperar-password/recuperar-password.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { MisComprasComponent } from './pages/mis-compras/mis-compras.component';
import { AdminProductosComponent } from './pages/admin-productos/admin-productos.component';

export const appRoutes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'catalogo', component: CatalogoComponent, canActivate: [authGuard] },
  { path: 'mis-compras', component: MisComprasComponent, canActivate: [authGuard] },
  { path: 'admin-productos', component: AdminProductosComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
