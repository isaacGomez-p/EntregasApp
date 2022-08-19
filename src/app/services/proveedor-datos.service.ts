import{ HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';

import { IData } from '../../interfaces/data.interfacepedidos';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { environment } from '../../environments/environment';
import { ResponseService } from 'src/interfaces/ResponseService';

@Injectable({
  providedIn: 'root'
})

export class ProveedorDatosService {

  private dataUrl: string = "assets/json/pedidos.json"

  private _controller: string =  environment.URL + "dataController";
  private _getData: string =  this._controller + "getData";
  private _modificar: string =  this._controller + "modificar";
    
  //private urlService: string = "https://localhost:44341/api";

  constructor(private http: HttpClient, public navCtrl: NavController, public geolocation: Geolocation) { 
    this.getLatitud();
    this.getLongitud();
  }

  latitud: number = 0;
  longitud: number = 0;

  getDataLocalStorage(): Observable<IData[]> {
    return this.http.get<IData[]>(this.dataUrl)
  }  
  
  getData(): Observable<IData[]> {
    return this.http.get<IData[]>(this._getData)
  }

  modificar(iData: IData) : Observable<ResponseService> {    
    return this.http.post<ResponseService>(this._modificar, iData);      
  }

  getLatitud(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      //console.log('servicio ' + geoposition.coords.latitude);
      this.latitud = geoposition.coords.latitude;
    })
  }

  getLongitud(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      this.longitud = geoposition.coords.longitude;
    });
  }

}
