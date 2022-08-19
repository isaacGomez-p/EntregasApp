import { PhotoService } from './../../services/photo.service';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ProveedorDatosService } from '../../services/proveedor-datos.service';
import { Observable } from "rxjs";
import { IData } from '../../../interfaces/data.interfacepedidos';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Photo } from './model/photo.interface';
import { ActivatedRoute } from '@angular/router';
import { AlistardatosPage } from '../alistardatos/alistardatos.page';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
//Nuevo
import { Plugins, CameraResultType, CameraSource, CameraPhoto, Filesystem } from '@capacitor/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
})
export class CamaraPage implements OnInit {

  public pedido = null;
  public pedidos = [];
  public buttonState: boolean = true;
  photo: SafeResourceUrl;
  private platform: Platform;
  private base64 = null;

  constructor(public toastController: ToastController, private sanitizer: DomSanitizer, private alertCtrl: AlertController, private alDatos: AlistardatosPage, private router: Router, public _logic: ProveedorDatosService) {

  }

  async takePicture() {
    try {
      const image = await Plugins.Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      })
      console.log(' prueba ' + image);
      if(image == null){        
        this.toastConfirmacion("Ha ocurrido un error al tomar la foto", "")                
        this.base64 = null;
        //this.openAlertErrorFoto();
      }else{        
        this.base64 = image.dataUrl;
        this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl))
        this.buttonState = false;        
      }            
    }catch(Exception){
      this.toastConfirmacion("Ha ocurrido un error al guardar la foto" + Exception, "")
      this.base64 = null;
      //this.openAlertErrorFoto();      
    }
  }

  async openAlertErrorFoto() {
    let HoraInicio = new Date();
    const alert = await this.alertCtrl.create({
      header: 'Desea confirmar la entrega del pedido sin foto  \n\n',
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
          text: 'Confirmar',
          handler: () => {
            try {
              this.saveData();
              this.toastConfirmacion('Entrega efectiva del pedido.', 'success');
              this.router.navigateByUrl('/home');
            } catch (Exception) {
              this.toastConfirmacion('Ha ocurrido un error, vuelva a intentarlo.', 'warning')
            }
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {
    if (JSON.parse(window.localStorage.getItem("pedidos")) == null || JSON.parse(window.localStorage.getItem("pedidos")).length === 0) {

    } else {
      if (JSON.parse(window.localStorage.getItem("pedido_actualizar")) == null || JSON.parse(window.localStorage.getItem("pedido_actualizar")).length === 0) {

      } else {
        this.pedidos = JSON.parse(window.localStorage.getItem("pedidos"));
        this.pedido = JSON.parse(window.localStorage.getItem("pedido_actualizar"));
      }
    }
  }

  public clickSave() {
    this.openAlert();
  }

  clickCancel() {
    this.buttonState = !this.buttonState;
    this.resetPhotos();
  }

  resetPhotos() {
    this.photo = null;
  }

  async openAlert() {
    let HoraInicio = new Date();
    const alert = await this.alertCtrl.create({
      header: '¿Desea confirmar fotografia? \n\n',
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
          text: 'Confirmar',
          handler: () => {
            try {
              this.saveData();
              this.toastConfirmacion('Foto guardada correctamente.', 'success');
              this.router.navigateByUrl('/home');
            } catch (Exception) {
              this.toastConfirmacion('Ha ocurrido un error, vuelva a intentarlo.', 'warning')
            }
          }
        }
      ]
    });
    await alert.present();
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

  saveData() {
    let date = new Date();
    let HoraInicio = this.horaLocalCO();
    
    this.pedidos.map(item => {
      if (item.Pedido === this.pedido.Pedido) {
        item.Foto = this.base64;        
        this.alDatos.regrabar_JSON_enLocalStorage(this.pedidos);
        this.resetPhotos();
      }
    });
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
}