import { HomePage } from './../../home/home.page';
import { WayPoint } from './model/waypoint.interface';
import { Component, OnInit } from '@angular/core';
import { ProveedorDatosService } from '../../services/proveedor-datos.service';
import { Marker } from '../localiza/model/localiza.interface';
import { Coordenadas } from '../localiza/model/coordenadas.interface';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-localiza',
  templateUrl: './localiza.page.html',
  styleUrls: ['./localiza.page.scss'],
})
export class LocalizaPage implements OnInit {

  map: any;
  pedido_ruta: any;

  pedidos: any = [];

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  wayPoint: WayPoint[];

  destination: Coordenadas;

  origin: Coordenadas;

  validacion = true;

  location: Coordenadas;

  ubicacionValidacion = false;

  constructor(public _logic: ProveedorDatosService, public toastController: ToastController, private router: Router) {      
    this.origin = { lat: _logic.latitud, lng: _logic.longitud };
  }

  async toastConfirmacion(mensaje, colorT) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: colorT,
      duration: 2000
    });
    toast.present();
  }


  ngOnInit() {      
    this.pedido_ruta = JSON.parse(window.localStorage.getItem("pedido_ruta"));       
    if(JSON.parse(window.localStorage.getItem("pedido_ruta")) !== null ) {
      if(this.pedido_ruta.Lat !== null){      
        this.validacion = true;
        this.destination = { lat: this.pedido_ruta.Lat, lng: this.pedido_ruta.Lng };
        this.loadMap();
        window.localStorage.removeItem("pedido_ruta");
      }else{
        window.localStorage.removeItem("pedido_ruta");
        this.toastConfirmacion("No tiene coordenadas establecidas para este pedido", "danger");
      }
    }else{        
        this.loadWayPoints();        
        this.loadMap();        
        this.validacion = false;
        this.toastConfirmacion("Rutas optimas para todos los pedidos.", "success");
        
      }    
  }

  loadWayPoints(){
    if(JSON.parse(window.localStorage.getItem("pedidos")) === null || JSON.parse(window.localStorage.getItem("pedidos")).length === 0){
      this.toastConfirmacion('No tienes pedidos asignados. Sincroniza para asegurar', 'warning');
    }else{
      let cont = 0;
      this.wayPoint = [];
      this.pedidos = JSON.parse(window.localStorage.getItem("pedidos"));
      this.pedidos.map(item => {
        if(item.estado === 2){
          if (item.Lat !== null) {
            if(item.Lng !== null){
              let datos = {
                location : { lat: item.Lat, lng: item.Lng},
                stopover: true
              }
              this.wayPoint.push(datos);
              cont++;
            }
          }
        }
      });
      if(cont === 0){
        this.toastConfirmacion('No se encontraron coordenadas.', 'warning');
        this.router.navigateByUrl('/home');
      }
    }   
  }

  ubicacionActual(){
    this.ubicacionValidacion = true;
    this.location = { lat: this._logic.latitud, lng: this._logic.longitud};
    /*let ubicacion: Marker = {
      position: { lat: this._logic.latitud, lng: this._logic.longitud},
      title: 'Ubicacion actual'
    }
    this.addMarker(ubicacion);*/
    if(this.validacion === false){
      this.calculateRouteWayPoints();
    }else{
      this.calculateRoute();
    }
  }

  loadMap() {
    if(this.origin.lat !== null && this.origin.lng !== null){
      // create a new map by passing HTMLElement
      const mapEle: HTMLElement = document.getElementById('map');    
      const indicatorsEle: HTMLElement = document.getElementById('indicators');
      // create map
      this.map = new google.maps.Map(mapEle, {
        center: this.origin,
        zoom: 12
      });

      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setPanel(indicatorsEle);

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
        if(this.validacion === true){
          this.calculateRoute();      
        }else{
          this.calculateRouteWayPoints();
        }
      });      
    }else{
      this.toastConfirmacion('Por favor asegurese de tener activados los servicios de ubicación.', 'warning')
    }
  }

  addMarker(marker: Marker) {
    const mapEle: HTMLElement = document.getElementById('map');    
    this.map = new google.maps.Map(mapEle, {
      center: { lat:this._logic.latitud, lng: this._logic.longitud },
      zoom: 12
    });
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title      
    });
  }

  private calculateRouteWayPoints() {
    this.directionsService.route({      
      origin: this.ubicacionValidacion === false ?
              this.origin :
              this.location,
      //origin: this.origin,
      destination: this.origin,
      waypoints : this.wayPoint,
      optimizeWaypoints: true,          
      travelMode: google.maps.TravelMode.DRIVING,      
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

  private calculateRoute() {
    this.directionsService.route({
      origin: this.ubicacionValidacion === false ?
              this.origin :
              this.location,
      destination: this.destination,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }
}