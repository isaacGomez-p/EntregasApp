import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormModule } from './login-form.module';
import { LoginFormPage } from './login-form.page';


const routes: Routes = [
  {
    path: '',
    component: LoginFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginFormPageRoutingModule {}