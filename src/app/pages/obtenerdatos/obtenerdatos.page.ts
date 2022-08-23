import { Component } from '@angular/core';
import { ProveedorDatosService } from '../../services/proveedor-datos.service';
import { Observable } from "rxjs";
import { IData } from '../../../interfaces/data.interfacepedidos';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-obtenerdatos',
  templateUrl: './obtenerdatos.page.html',
  styleUrls: ['./obtenerdatos.page.scss'],
})

export class ObtenerdatosPage {

  pedidos: any = [];
  totalRegistros: number;
  pedidosBD: any = [];
  response: any = [];

  constructor( public _logic: ProveedorDatosService, private alertCtrl: AlertController, public toastController: ToastController, private router: Router) {

  }



  async toastConfirmacion(mensaje, colorT) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: colorT,
      duration: 2000
    });
    toast.present();
  }

  modificarBD(){
    try{
      this.pedidos = JSON.parse(window.localStorage.getItem( "pedidos"))      
      this.pedidosBD = this._logic.getData();    
      if(this.pedidos !== null){
        this.pedidos.map(item => {
          console.log('PedidobD: ' +  this.pedidosBD);
          this.pedidosBD.subscribe(itemBD => {
            itemBD.map(mapItem => {
              console.log('Pedido: ' + mapItem.Pedido)
              if(item.Pedido === mapItem.Pedido && item.estado !== mapItem.estado){
                console.log('Entro ' + item.Pedido + ' estado ' + item.estado)   
                //this.response = this._logic.modificar(item.Pedido, item);                
                return;
              }
            });          
          });
        });
      }
      this.toastConfirmacion('Sincronización exitosa.', 'success');
    }catch(Exception){
      this.toastConfirmacion('Ha ocurrido un error en el servidor.', 'warning');
    }
  }

  async openConfirmacion() {
    let HoraInicio = new Date();
    const alert = await this.alertCtrl.create({
      header: '¿ Está seguro que desea sincronizar en este momento ?',
      subHeader: 'Fecha: ' + HoraInicio.getDate() + '/' + (HoraInicio.getMonth() + 1).toString() + '/' + HoraInicio.getFullYear(),
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
            this.modificarBD();
          }
        }
      ]
    });
    await alert.present();
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter');   
    if(window.localStorage.getItem('session') === 'true'){
      this.toastConfirmacion('Hay ' + JSON.parse(window.localStorage.getItem('pedidos')).length + ' registros en el local storage', 'warning');  
    }else{
      this.router.navigateByUrl('/login-form');  
    } 
    
  }
}
