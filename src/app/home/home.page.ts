import { AppComponent } from './../app.component';
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ProveedorDatosService } from '../services/proveedor-datos.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IData } from '../../interfaces/data.interfacepedidos';
// import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { exit } from 'process';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertController } from '@ionic/angular';
import { AlistardatosPage } from '../pages/alistardatos/alistardatos.page'
import { ActionSheetController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ICausal } from 'src/interfaces/causal.interface';
import { IInpunts } from 'src/interfaces/inputs';
import { CausalesService } from '../services/causales.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  items: any = [];
  pedidos: IData[] = [];
  causal: ICausal[];
  inputs: IInpunts;
  listaInputs: IInpunts[] = [];
  name_model: string = "";
  pedidosb = new BehaviorSubject([]);
  usuario: string = "";
  restantes: number = 0;
  entregados: number = 0;
  noEntregados: number = 0;
  latitud: number = 0;
  longitud: number = 0;

  validacionRutas: number = 0;

  constructor(private alDatos: AlistardatosPage, private menuCtrl: MenuController, public _logic: ProveedorDatosService, private alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public toastController: ToastController, private router: Router, public modalController: ModalController, public appComponent: AppComponent, private serviceDatos: ProveedorDatosService, private causalesService : CausalesService) {
    //let HoraInicio = new Date();
    //console.log(HoraInicio);
    console.log('entro nombre cons hom' + window.localStorage.getItem("usuario"))
    this.appComponent.usuario = window.localStorage.getItem("usuario");
    menuCtrl.enable(true, 'primerMenu');
  }

  ngOnInit() {     
  }

  ionViewDidEnter(){
    this.usuario = window.localStorage.getItem("usuario");
    window.localStorage.removeItem("pedido_ruta");
    window.localStorage.removeItem("pedido_actualizar");
    if(window.localStorage.getItem('session') === 'true'){
      this.cargar_datos_desde_LocalStorage();
      this.cargarContadores();
    }else{
      this.router.navigateByUrl('/login-form');  
    }
    
    if(JSON.parse(window.localStorage.getItem("pedidos")) === null || JSON.parse(window.localStorage.getItem("pedidos")).length === 0){
      this.toastConfirmacion('No tienes datos asignados. Sincroniza para asegurar', 'warning');
    }else{
      this.pedidos = JSON.parse(window.localStorage.getItem("pedidos"));
    }

    this.causalesService.getCausal().subscribe((data)=> {
      this.causal = JSON.parse(JSON.stringify(data.result));      
      this.causal.map((item)=>{
        let data = {       
          type: 'radio',
          label: item.nombreCausal,
          value: item.codigo
        }             
        this.listaInputs.push(data)
      })      
    })
  }

  async presentModal(pedido: any) {
    const alert = await this.actionSheetCtrl.create({
      header: 'Acciones',
      buttons: [
        {
          text: 'Entrega efectiva',
          role: 'selected',
          icon: 'checkbox-outline',
          handler: () => {
            this.openAlert(pedido);
          }
        },{
          text: 'Entrega no efectiva',
          role: 'selected',
          icon: 'close-circle-outline',
          handler: () => {
            this.pedidoCanceladoAlert(pedido)
          }
        },{
          text: 'Ruta',
          role: 'destructive',
          icon: 'navigate-circle-outline',
          handler: () => {
            this.ruta(pedido);
          }
        }
      ]
    });
    await alert.present();
    /*
    window.localStorage.setItem( "pedido_actualizar", JSON.stringify(pedido));
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'firstName': 'Douglas',
        'lastName': 'Adams',
        'middleInitial': 'N'
      }
    });
    return await modal.present();*/
  }

  ruta(pedido: any){
    window.localStorage.setItem("pedido_ruta", JSON.stringify(pedido));
    this.router.navigateByUrl('/localiza');
  }

  async presentActionSheet() {
    const alert = await this.actionSheetCtrl.create({
      header: 'Contadores',
      buttons: [
        {
          text: 'Restantes:  ' + this.restantes,
          role: 'selected',
          icon: 'list-circle-outline'
        },{
          text: 'Entregados:  ' + this.entregados,
          role: 'success',
          icon: 'checkbox-outline'
        },{
          text: 'No entregados:  ' + this.noEntregados,
          role: 'destructive',
          icon: 'close-circle-outline'
        }
      ]
    });
    await alert.present();
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

  async popUpContadores(pedido: any) {
    const alert = await this.alertCtrl.create({
      header: 'Indique la ',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Observación'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cerrar');
          }
        }
      ]
    });
    await alert.present();
  }

  
  cargar_datos_desde_LocalStorage() {
    this.pedidos = JSON.parse(window.localStorage.getItem('pedidos'));
  }

  pasarDatosParaActualizar(pedido) {
    this.name_model = pedido.destinoFinal;
  }

  //Metodo de confirmacion a la hora de entregar un pedido
  async openAlert(pedido: any) {
    let HoraInicio = new Date();
    const alert = await this.alertCtrl.create({
      header: '¿Esta seguro? \n\n',
      subHeader: 'Fecha: ' + HoraInicio.getDate() + '/' + (HoraInicio.getMonth() + 1).toString() + '/' + HoraInicio.getFullYear(),
      message: this.arreglaHora(),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel');
          }
        }, {
          text: 'Continuar',
          handler: (data) => {
            try{
              //window.localStorage.setItem( "pedido_actualizar", JSON.stringify(pedido));
              this.actualizarPedido(pedido);
              this.toastConfirmacion('Pedido entregado correctamente.', 'success')  
              //this.router.navigateByUrl('/camara');  
            }catch(Exception){
              this.toastConfirmacion('Ha ocurrido un error en el servidor.', 'warning')  
            }            
          }
        }
      ]
    });
    await alert.present();
  }

  async pedidoCanceladoAlert(pedido: any) {    
    
    let alert = await this.alertCtrl.create({
      header: 'Especifique la razón',
      cssClass: 'ion-alert',      
      inputs: this.listaInputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.toastConfirmacion('Operación cancelada.', 'light')
          }
        },
        {
          text: 'OK',
          handler: data => {
            if(JSON.stringify(data) !== undefined){
              this.cancelarPedido(pedido, Number.parseInt(JSON.stringify(data)));
              this.toastConfirmacion('Entrega no efectiva del pedido.', 'success')  
            }else{
              this.toastConfirmacion('Por favor seleccione una opción.', 'warning')  
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async toastConfirmacion(mensaje, colorT) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: colorT,
      duration: 2000
    });
    toast.present();
  }

  arreglaHora() {
    let date = new Date();
    let min = date.getMinutes().toString();
    if (date.getMinutes() < 10) {
      min = '0' + date.getMinutes();
    }
    return 'Hora: ' + date.getHours() + ':' + min;
  }

  actualizarPedido(pedido: any) {
    console.log('entro actualzar');
    let date = new Date();
    let HoraInicio = this.horaLocalCO();
    this.pedidos.map(item => {
      if (item.pedido === pedido.pedido) {
        item.entrega_Fec = HoraInicio+"";
        item.estado = 5;
        item.vehi_Tipo =  this.arreglaFecha(date);
        //item.LatNovedad = this._logic.latitud;
        //item.LngNovedad = this._logic.longitud;
        //item.Fec_Sincroniza = HoraInicio;        
        this.alDatos.regrabar_JSON_enLocalStorage(this.pedidos);
      }
    });
    
  }

  horaLocalCO(): Date {
    let HoraInicio = new Date();
    HoraInicio.setUTCFullYear(HoraInicio.getFullYear());
    HoraInicio.setUTCMonth(HoraInicio.getMonth());
    HoraInicio.setUTCDate(HoraInicio.getUTCDay());
    HoraInicio.setUTCHours(HoraInicio.getUTCHours() - 5);
    HoraInicio.setUTCMinutes(HoraInicio.getUTCMinutes());
    HoraInicio.setUTCSeconds(HoraInicio.getUTCSeconds());
    return HoraInicio;
  }

  cancelarPedido(pedido: any, causal: number) {
    let date = new Date();   
    let HoraInicio = this.horaLocalCO();

    this.pedidos.map(item => {
      if (item.pedido === pedido.pedido) {
        item.estado = 7;
        item.causal_Id = causal;
        item.entrega_Fec = date+"";
        item.vehi_Tipo =  this.arreglaFecha(date);
        //item.LatNovedad = this._logic.latitud;
        //item.LngNovedad = this._logic.longitud;
        //item.Fec_Sincroniza = HoraInicio;
      }
    });
    this.alDatos.regrabar_JSON_enLocalStorage(this.pedidos);
    this.cargarContadores();
  }

  updateRow(pedido) {    
    for (let numero of this.pedidos) {
      let i: number = 0
      if (numero.destinoFinal === this.name_model)
        i = i + 1
      {
        this.pedidos[i].estado = 2
        numero.estado = 2
        break;
      }
    }
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  arreglaFecha(date: Date ): string {
    let fechaTexto :string = date.toString();
    let mesEnNumero : string;

    let yyyyTexto : string = fechaTexto.substring(11,15) ;
    let mmTexto : string = fechaTexto.substring(4,7);
    let ddTexto : string = fechaTexto.substring(8,10) ;
    let hhTexto : string = fechaTexto.substring(16,24) ;
    let minsTexto : string = new Date().getMinutes.toString();
    let segsTexto : string = new Date().getSeconds.toString();


    switch ( mmTexto ) {
      case "Ene":
        mesEnNumero = "01"
        break;
      case "Feb":
        mesEnNumero = "02"
        break;
      case "Mar":
        mesEnNumero = "03"
        break;
      case "Abr":
        mesEnNumero = "04"
        break;
      case "May":
        mesEnNumero = "05"
        break;
      case "Jun":
        mesEnNumero = "06"
        break;
      case "Jul":
        mesEnNumero = "07"
        break;
      case "Ago":
        mesEnNumero = "08"
        break;
      case "Sep":
        mesEnNumero = "09"
        break;
      case "Oct":
        mesEnNumero = "10"
        break;
      case "Nov":
        mesEnNumero = "11"
        break;
      case "Dic":
        mesEnNumero = "12"
        break;
      }
    return yyyyTexto+'-'+mesEnNumero+'-'+ddTexto+' '+hhTexto;
  } 
}  