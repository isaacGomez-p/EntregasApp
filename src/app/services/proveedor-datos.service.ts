import{ HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';

import { IData } from '../../interfaces/data.interfacepedidos';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { environment } from '../../environments/environment';
import { ResponseService } from 'src/interfaces/ResponseService';
import { ICausal } from 'src/interfaces/causal.interface';
import { UserEntity } from 'src/interfaces/userEntity';
import { RequestDTO } from 'src/interfaces/requestDTO';

@Injectable({
  providedIn: 'root'
})

export class ProveedorDatosService {

  private dataUrl: string = "assets/json/pedidos.json"

  private _controller: string =  environment.URL + "dataController/";
  private _getData: string =  this._controller + "getData";
  private _modificar: string =  this._controller + "modificar";
  private _login: string =  this._controller + "login";
    
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
  
  getData(cedula : number): Observable<ResponseService> {
    let request = new RequestDTO();
    request.id = cedula;
    return this.http.post<ResponseService>(this._getData, request);
  }

  modificar(iData: IData[]) : Observable<ResponseService> {    
    return this.http.post<ResponseService>(this._modificar, iData);      
  }

  getLatitud(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      this.latitud = geoposition.coords.latitude;
    })
  }

  getLongitud(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      this.longitud = geoposition.coords.longitude;
    });
  }

  getLogin(clave: string, cedula: string): Observable<ResponseService>{
    let userEntity = new UserEntity();
    userEntity.identification = cedula;
    userEntity.password = clave;
    return this.http.post<ResponseService>(this._login, userEntity);    
  }

  getConductores(): Observable<IData[]>{       
    return null;
    //return this.http.get<IData[]>(`${this.urlService}/Op_Conductores?conexion=`+this.conexion);
  }

  /*getDataLocalStorage(): Observable<IData[]> {
    return this.http.get<IData[]>(this.dataUrl)
  }  
  
  getData(): Observable<IData[]> {
    return this.http.get<IData[]>(`${this.urlService}/TmpDT_3k_Entregas?conexion=`+this.conexion);
  }

  putData(id: string, datos: any){
    let urlServiceEditar: string = `${this.urlService}/TmpDT_3k_Entregas/` + id +`?conexion=`+this.conexion;
    console.log(' url: ' + urlServiceEditar);
    return this.http.put(urlServiceEditar, datos).subscribe(data => 
        console.log('response ' + data)
      );
  }

  /*getLatitud(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      //console.log('servicio ' + geoposition.coords.Latitude);
      this.Latitud = geoposition.coords.Latitude;
    })
  }

  getLongitud(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      this.longitud = geoposition.coords.longitude;
    });
  }*/

  

}
