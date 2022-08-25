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

  pedidosLocal: IData[] = [];
  totalRegistros: number;
  pedidosBD: IData[] = [];
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
    //Carga la lista de pedidos local
      this.pedidosLocal = JSON.parse(window.localStorage.getItem( "pedidos"))      
      if(this.pedidosLocal != null){
        this._logic.modificar(this.pedidosLocal).subscribe((data) => {
          if(data.status == 200){
            this.toastConfirmacion('Sincronización exitosa.', 'success');  
          }else{
            this.toastConfirmacion('Lo sentimos, vuelva a intentarlo.', 'error');    
          }          
        });
      }else{
        this.toastConfirmacion('No se encontraron datos para sincronizar.', 'warning');
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
