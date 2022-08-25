import { AlistardatosPage } from './../alistardatos/alistardatos.page';
import { Component } from '@angular/core';
import { ProveedorDatosService } from '../../services/proveedor-datos.service';
import { Observable } from "rxjs";
import { IData } from '../../../interfaces/data.interfacepedidos';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-revisar-estado',
  templateUrl: './revisar-estado.page.html'
})

export class RevisarEstado {

  pedidos: IData[] = [];
  totalRegistros: number;
  seleccion;

  entregados: 0;
  noEntregados: 0;
  restantes: 0;


  constructor(private alDatos: AlistardatosPage, private router: Router, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController, private toastController: ToastController) {
    this.cargar_datos_desde_LocalStorage();

  }

  ionViewDidEnter(){
    if(window.localStorage.getItem('session') === 'true'){
      this.cargarContadores();
    }else{
      this.router.navigateByUrl('/login-form');  
    }
  }

  cargarContadores() {
    if(this.pedidos !== null){
      this.entregados = 0;
      this.restantes = 0;
      this.noEntregados = 0;
      for (let numero of this.pedidos) {
        if (numero.estado === 5) {
          this.entregados++;
        }
        if (numero.estado === 2) {
          this.restantes++;
        }
        if (numero.estado === 7) {
          this.noEntregados++;
        }
      }
    }
  }

  buscar($event){
    this.seleccion = $event.target.value;
    console.log("datos" + $event.target.value);    
  }

  cargar_datos_desde_LocalStorage(){
    this.pedidos = JSON.parse(window.localStorage.getItem('pedidos'));
  }

  async presentModal(pedido: any) {
    const alert = await this.actionSheetCtrl.create({
      header: 'Acciones',
      buttons: [
        {
          text: '¿Entregar de nuevo?',
          role: 'selected',
          icon: 'checkbox-outline',
          handler: () => {
            this.openAlert(pedido);
          }
        }
      ]
    });
    await alert.present();   
  }

  async openAlertCamara(pedido: any) {
    let HoraInicio = new Date();
    const alert = await this.alertCtrl.create({
      header: '¿Desea tomar una fotografia? \n\n',      
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
              window.localStorage.setItem( "pedido_actualizar", JSON.stringify(pedido));              
              this.router.navigateByUrl('/camara');                              
            }catch(Exception){
              this.toastConfirmacion('Ha ocurrido un error en el servidor.', 'warning')  
            }                  
          }
        }
      ]
    });
    await alert.present();
  }

  //Metodo de confirmacion a la hora de entregar un pedido
  async openAlert(pedido: any) {
    let HoraInicio = new Date();
    const alert = await this.alertCtrl.create({
      header: '¿Esta seguro? \n\n',
      subHeader: 'El pedido regresara a la lista de pedidos que faltan por entregar',      

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
              this.actualizarPedido(pedido);
              this.toastConfirmacion('Se modifico el estado del pedido.', 'success')  
            }catch(Exception){
              this.toastConfirmacion('Ha ocurrido un error en el servidor.', 'warning')  
            }                  
          }
        }
      ]
    });
    await alert.present();
  }

  actualizarPedido(pedido: any) {
    console.log('entro actualzar');
    let date = new Date();
    this.pedidos.map(item => {
      if (item.pedido === pedido.Pedido) {              
        item.estado = 2;
        item.causal_Id = 0;
        item.entrega_Fec = '1900-01-01T00:00:00'; //null?
        item.vehi_Tipo =  '';
      }
    });
    this.alDatos.regrabar_JSON_enLocalStorage(this.pedidos);
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