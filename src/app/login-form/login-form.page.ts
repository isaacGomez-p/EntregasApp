import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from  "@angular/router";
import { AppComponent } from '../app.component';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ProveedorDatosService } from '../services/proveedor-datos.service';
import { UserEntity } from 'src/interfaces/userEntity';
import { IData } from '../../interfaces/data.interfacepedidos';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.page.html',
  styleUrls: ['./login-form.page.scss'],
})

export class LoginFormPage implements OnInit {

  private af: Boolean;

  user : UserEntity;

  lista: any = [];

  pedidos: any = [];

  conductor: any = [];

  listaConductores: any = [];

  totalRegistros: number = 0;

  usuario: string;

  clave: string;

  nombreUsuario: string;

  validar : IData[] = [];

  constructor(private authService: AuthService, private router: Router, private appComponent : AppComponent, menuCtrl: MenuController, public toastController: ToastController, private proveedorDatos: ProveedorDatosService) {
    menuCtrl.enable(false, 'primerMenu');
  }


  ngOnInit() {    
    /*this.lista = this.proveedorDatos.getConductores();
    this.lista.subscribe(res =>{
      res.map(e =>{
        this.listaConductores.push(e);
      })        
    })*/
  }

  OnViewDidEnter() {    
    this.lista = this.proveedorDatos.getConductores();
    this.lista.subscribe(res =>{
      res.map(e =>{
        this.listaConductores.push(e.CC);
      })        
    })
  }


  login(form){    
    if(form.value.password === 0 && form.value.user ===''){
      this.toastConfirmacion('Ingrese los datos.', 'danger');
    }else{
      
       this.proveedorDatos.getLogin(form.value.password, form.value.user).subscribe((data)=>{
        
        if(data.status === 200)  {         
          //this.limpiar_JSON_enLocalStorage(form.value.user);
          this.user = JSON.parse(JSON.stringify(data.result));
          window.localStorage.setItem("cedula", this.user.identification);
          window.localStorage.setItem( "session", 'true');
          window.localStorage.setItem( "usuario", this.user.name); 
          //this.nombreUsuario = data[0].Nombre_Conductor; 
          //this.nombreUsuario = "Bienvenido";
          this.appComponent.usuario = this.nombreUsuario;
          
          //console.log("asdddddddddddd"+ data[0].Nombre_Conductor);
          
          form.value.user = '';
          form.value.password = 0;
          this.usuario = '';
          this.clave = '';         
          this.router.navigateByUrl('/home');         
        }else{
          this.toastConfirmacion('Datos incorrectos.', 'danger');
        }       
      }, (error) =>{
        this.toastConfirmacion("Ha ocurrido un error.", "danger");
      })
    }
  }

  

  private cargar_JSON(){
    try{
      this.limpiar_JSON_enLocalStorage(0)
      this.grabar_JSON_enLocalStorage()
      this.toastConfirmacion('Sincronización exitosa', 'success');
      this.router.navigateByUrl('/home');  
    }catch(Exception){
      console.log(Exception)
      this.toastConfirmacion('Ha ocurrido un error en el servidor.', 'danger');
    }
  }

  private limpiar_JSON_enLocalStorage(numero: number){  
    
    console.log('entro a limpiar')
    this.validar = JSON.parse(window.localStorage.getItem( "pedidos"));
    if(numero!==0){
      console.log('si')
      if(this.validar !== null){
        if(this.validar.length > 0){
          
          if(this.validar[0].asignado.toString() === numero.toString()){          
            console.log('es diferente')
            window.localStorage.clear();
          }
        }
      }
    }
  }

  private grabar_JSON_enLocalStorage(){          
    window.localStorage.setItem( "usuario", this.nombreUsuario); 
    window.localStorage.setItem( "pedidos", JSON.stringify(this.conductor));    
    window.localStorage.setItem( "session", 'true');        
  }

  async toastConfirmacion(mensaje, colorT) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: colorT,
      duration: 2000
    });
    toast.present();
  }

}
