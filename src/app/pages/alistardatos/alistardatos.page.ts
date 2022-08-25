import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ProveedorDatosService } from '../../services/proveedor-datos.service';
import { Observable } from "rxjs";
import { IData } from '../../../interfaces/data.interfacepedidos';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-alistardatos',
  templateUrl: './alistardatos.page.html',
  styleUrls: ['./alistardatos.page.scss'],
})
export class AlistardatosPage implements OnInit {

  pedidos: IData[] = [];
  conductor: any = [];
  totalRegistros: number;


  constructor( private menuCtrl: MenuController, public _logic: ProveedorDatosService, private alertCtrl: AlertController, public toastController: ToastController) {
   
  }

  cargar_JSON_LocalStorage(){
    this._logic.getDataLocalStorage().subscribe(data => {
      this.pedidos = data;
    })
  }

  cargar_JSON(){  
    try{      
      this._logic.getData(+window.localStorage.getItem("cedula")).subscribe(data => {
        this.pedidos = JSON.parse(JSON.stringify(data.result));     
        this.cargarDatos();      
        this.grabar_JSON_enLocalStorage();
        this.toastConfirmacion('Sincronización exitosa', 'success');
      })      
    }catch(Exception){
      this.toastConfirmacion('Ha ocurrido un error en el servidor.', 'error');
    }
  }

  private cargarDatos(){      
    this.limpiar_JSON_enLocalStorage();
    this.grabar_JSON_enLocalStorage();    
  }

  grabar_JSON_enLocalStorage(){
    window.localStorage.setItem( "pedidos", JSON.stringify(this.pedidos));
  }

  limpiar_JSON_enLocalStorage(){  
      window.localStorage.removeItem("pedidos");
  }

  regrabar_JSON_enLocalStorage(json : any){
    window.localStorage.setItem( "pedidos", JSON.stringify(json));    
  }

  async toastConfirmacion(mensaje, colorT) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: colorT,
      duration: 2000
    });
    toast.present();
  }

  async openConfirmacion() {
    let HoraInicio = new Date();
    const alert = await this.alertCtrl.create({
      header: '¿ Está seguro que desea cargar los datos en este momento ?',
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
            this.cargar_JSON()
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {
  }

}
