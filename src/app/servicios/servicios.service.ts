import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  header:HttpHeaders;

  constructor(private http: HttpClient) {
    this.header=new HttpHeaders().set('Acces-Control-Allow-Origin','*');
  }

  crear(dato:any, url:string):Observable<any>{
    return this.http.post(base_url+'/usuarios/crear'+url, dato, {'headers':this.header})
  }
  login(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/login', dato, {'headers':this.header})
  }
  checkToken(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/renew', dato, {'headers':this.header})
  }
  validarCuenta(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/verificar', dato, {'headers':this.header})
  }
  loginA(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/login', dato, {'headers':this.header})
  }
  checkTokenA(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/renew', dato, {'headers':this.header})
  }
}