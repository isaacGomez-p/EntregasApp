import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

 usuario : string = "";

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();    
    console.log('entro nombre cons' + window.localStorage.getItem("usuario"))
    this.usuario = window.localStorage.getItem("usuario");
  }

  ngOnInit() {    
    console.log('entro nombre ng' + window.localStorage.getItem("usuario"))
    this.usuario = window.localStorage.getItem("usuario");
  }

  OnViewDidEnter(){
    console.log('entro nombre on' + window.localStorage.getItem("usuario"))
    this.usuario = window.localStorage.getItem("usuario");
    //this.usuario = window.localStorage.getItem("usuario");
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  //Metodo de confirmacion a la hora de entregar un pedido
  async openAlert() {    
    const alert = await this.alertCtrl.create({      
      header: '¿Desea cerrar sesión? \n\n',      
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: (data) => {            
            try{
              this.logOut();
              
            }catch(Exception){
              
            }                        
          }
        }
      ]
    });
    await alert.present();
  }

  logOut(){
    window.localStorage.removeItem("cedula");
    window.localStorage.removeItem("session");
    window.localStorage.removeItem("usuario");
    this.menuCtrl.enable(false, 'primerMenu');
    this.router.navigateByUrl('/login-form');
  }
}
