import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICausal } from 'src/interfaces/causal.interface';
import { ResponseService } from 'src/interfaces/ResponseService';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CausalesService {

  private _controller: string =  environment.URL + "causalesController/";
  private _getCausales: string = this._controller + "getCausales"

  constructor(private http: HttpClient) { }

  getCausal() : Observable<ResponseService>{
    return this.http.get<ResponseService>(this._getCausales);
  }
}
