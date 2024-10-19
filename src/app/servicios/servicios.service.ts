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
  como_registro:Array<string>=['',''];
  nosotros:Array<string>=['',''];

  constructor(private http: HttpClient) {
    this.header=new HttpHeaders().set('Acces-Control-Allow-Origin','*');
    this.cargarWeb().subscribe({
      next:(value)=> {
        this.como_registro[0]=value.datos[0].texto
        this.como_registro[1]=value.datos[1].texto
        this.nosotros[0]=value.datos[2].texto
        this.nosotros[1]=value.datos[3].texto        
      },
    })
  }

  crear(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/crearUsuario', dato, {'headers':this.header})
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
  cambiarPass(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/cambiarPass', dato, {'headers':this.header})
  }
  sendcambiarPass(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/sendCambio', dato, {'headers':this.header})
  }
  cargarWeb():Observable<any>{
    return this.http.post(base_url+'/web/webs', {'headers':this.header})
  }
  getTextos(id:number){
    switch (id) {
      case 0:
        return this.como_registro;
      case 1:
        return this.nosotros;
    }
    return ['',''];
  }
  contacto(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/mailContacto', dato, {'headers':this.header})
  }
  async cargarArchivo(dato:any,dato2:any){
    try {
      const resp = await fetch(base_url+'/lote/img?img='+dato+'&tipo='+dato2,{
        method: 'GET', 
        headers: {'Acces-Control-Allow-Origin':'*'},
      });

      return resp;
    } catch (error) {
      return false;
    }
  }
  ofertar(dato:any):Observable<any>{
    return this.http.post(base_url+'/oferta/ofertar', dato, {'headers':this.header})
  }
  ofertaDatos(dato:any):Observable<any>{
    return this.http.post(base_url+'/oferta/datos', dato, {'headers':this.header})
  }
  programarOferta(dato:any):Observable<any>{
    return this.http.post(base_url+'/oferta/setOfertaA', dato, {'headers':this.header})
  }
  getOfertaAuto(dato:any):Observable<any>{
    return this.http.post(base_url+'/oferta/getOfertaA', dato, {'headers':this.header})
  }
  eliminarOfertaAuto(dato:any):Observable<any>{
    return this.http.post(base_url+'/oferta/eliminarOfertaA', dato, {'headers':this.header})
  }
}