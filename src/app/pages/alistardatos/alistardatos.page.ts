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

  pedidos: any = [];
  conductor: any = [];
  totalRegistros: number;


  constructor( private menuCtrl: MenuController, public _logic: ProveedorDatosService, private alertCtrl: AlertController, public toastController: ToastController) {
   
  }

  cargar_JSON_LocalStorage(){
    this.pedidos = this._logic.getDataLocalStorage()
  }

  cargar_JSON(){
    try{      
      this.pedidos = this._logic.getData()      
      console.log("asdasd"+ window.localStorage.getItem("cedula"));
      this.cargarDatos(+window.localStorage.getItem("cedula"));          
      this.grabar_JSON_enLocalStorage();
      this.toastConfirmacion('Sincronización exitosa', 'success');
    }catch(Exception){
      this.toastConfirmacion('Ha ocurrido un error en el servidor.', 'error');
    }
  }

  private cargarDatos(cedula: number){          
    this.conductor = [];    
    if(this.pedidos !== null){         
      console.log(" -- - - - - -- IF");
      this.pedidos.subscribe((res) => {
        for(let i=0; i < res.length; i ++){
          if(res[i].Asignado === cedula){
            this.conductor.push(res[i]);              
          }
        }
        this.limpiar_JSON_enLocalStorage();
        this.grabar_JSON_enLocalStorage();
      })       
    }else{
      this.toastConfirmacion("Ha ocurrido un error interno.", "danger")
    }
    
  }

  grabar_JSON_enLocalStorage(){  
    let HoraInicio = new Date() ;           
    console.log("antes de guardar"+ this.conductor.length);
    window.localStorage.setItem( "pedidos", JSON.stringify(this.conductor));      
    console.log('Cantidad de entregas asignadas: '+ JSON.parse(window.localStorage.getItem("pedidos")).length);        
  }

  limpiar_JSON_enLocalStorage(){  
      window.localStorage.removeItem("pedidos");
  }

  regrabar_JSON_enLocalStorage(json : any){
    let HoraInicio = new Date() ;
    window.localStorage.setItem( "pedidos", JSON.stringify(json));
    console.log(json);
    let HoraFinal = new Date() ;
    
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
