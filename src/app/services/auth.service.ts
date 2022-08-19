import { Injectable } from '@angular/core';


import {
  Plugins
} from '@capacitor/core';
import { AlistardatosPage } from '../pages/alistardatos/alistardatos.page';
import { ProveedorDatosService } from './proveedor-datos.service';





@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  constructor(private proveedorDatos: ProveedorDatosService, private alistarDatos: AlistardatosPage){
    
  }

  public login(form): Boolean {
    console.log("Form user"+ form.user);
    console.log("Form pass"+ form.password);             
    //this.proveedorDatos.getLogin(form.password, form.user).subscribe((data)=>{
      //if(data !== null)  {
        //return true;          
      //}else{
        //return false;  
      //}
    //});
    return false;
  }
}