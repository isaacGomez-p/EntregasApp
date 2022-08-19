import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login-form',
    pathMatch: 'full'
  },
  {
    path: 'alistardatos',
    loadChildren: () => import('./pages/alistardatos/alistardatos.module').then( m => m.AlistardatosPageModule)
  },
  {
    path: 'localiza',
    loadChildren: () => import('./pages/localiza/localiza.module').then( m => m.LocalizaPageModule)
  },
  {
    path: 'obtenerdatos',
    loadChildren: () => import('./pages/obtenerdatos/obtenerdatos.module').then( m => m.ObtenerdatosPageModule)
  },
  {
    path: 'revisarestado',
    loadChildren: () => import('./pages/revisar-estado/revisar-estado.module').then( m => m.RevisarEstadoModule)
  },
  {
    path: 'login-form',
    loadChildren: () => import('./login-form/login-form.module').then( m => m.LoginFormModule)
  },
  {
    path: 'camara',
    loadChildren: () => import('./pages/camara/camara.module').then( m => m.CamaraPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
