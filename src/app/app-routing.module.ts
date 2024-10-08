import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'iniciar',
    pathMatch: 'full'
  },
  {
    path: 'iniciar',
    loadChildren: () => import('./pages/iniciar/iniciar.module').then( m => m.IniciarPageModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./pages/registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'publicar',
    loadChildren: () => import('./pages/publicar/publicar.module').then( m => m.PublicarPageModule)
  },
  {
    path: 'foro',
    loadChildren: () => import('./pages/foro/foro.module').then( m => m.ForoPageModule)
  },
  {
    path: 'ubicaciones',
    loadChildren: () => import('./pages/ubicaciones/ubicaciones.module').then( m => m.UbicacionesPageModule)
  },
  {
    path: 'info-ubicaciones',
    loadChildren: () => import('./pages/info-ubicaciones/info-ubicaciones.module').then( m => m.InfoUbicacionesPageModule)
  },
  {
    path: 'recuperacion',
    loadChildren: () => import('./pages/recuperacion/recuperacion.module').then( m => m.RecuperacionPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'publicacion-usuario',
    loadChildren: () => import('./pages/publicacion-usuario/publicacion-usuario.module').then( m => m.PublicacionUsuarioPageModule)
  },
  {
    path: 'publicacion-guardada',
    loadChildren: () => import('./pages/publicacion-guardada/publicacion-guardada.module').then( m => m.PublicacionGuardadaPageModule)
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./pages/home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
    path: 'usuarios-admin',
    loadChildren: () => import('./pages/usuarios-admin/usuarios-admin.module').then( m => m.UsuariosAdminPageModule)
  },
  {
    path: 'ubicaciones-admin',
    loadChildren: () => import('./pages/ubicaciones-admin/ubicaciones-admin.module').then( m => m.UbicacionesAdminPageModule)
  },
  {
    path: 'publicaciones-admin',
    loadChildren: () => import('./pages/publicaciones-admin/publicaciones-admin.module').then( m => m.PublicacionesAdminPageModule)
  },
  {
    path: 'agregar-ubicacion',
    loadChildren: () => import('./pages/agregar-ubicacion/agregar-ubicacion.module').then( m => m.AgregarUbicacionPageModule)
  },
  {
    path: 'cambiar-nombre',
    loadChildren: () => import('./pages/cambiar-nombre/cambiar-nombre.module').then( m => m.CambiarNombrePageModule)
  },
  {
    path: 'cambiar-contra',
    loadChildren: () => import('./pages/cambiar-contra/cambiar-contra.module').then( m => m.CambiarContraPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
