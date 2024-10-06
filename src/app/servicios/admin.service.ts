import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  header:HttpHeaders;

  constructor(private http: HttpClient) {
    this.header=new HttpHeaders().set('Acces-Control-Allow-Origin','*');
  }

  cargarUsers(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/users', dato, {'headers':this.header})
  }
  cargarUsersDesde(dato:any, url:number,order:string,orden:string):Observable<any>{
    return this.http.post(base_url+'/admin/users?desde='+url+'&order='+order+'&orden='+orden, dato, {'headers':this.header})
  }
  deleteUsers(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/deleteUser', dato, {'headers':this.header})
  }
  actualizarUser(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/actualizarUser', dato, {'headers':this.header})
  }
  crearAdmin(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/crearAdmin', dato, {'headers':this.header})
  }
  buscarDato(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/buscarDato', dato, {'headers':this.header})
  }
  excelUsuarios(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/excelUsuario', dato, {'headers':this.header})
  }
  cargarAdmins(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/admins', dato, {'headers':this.header})
  }
  actualizarWeb(dato:any):Observable<any>{
    return this.http.post(base_url+'/web/actualizarWeb', dato, {'headers':this.header})
  }
  async crearLote(dato:any){    
    try {
      const resp = await fetch(base_url+'/lote/crearLote',{
        method: 'POST', 
        headers: {'Acces-Control-Allow-Origin':'*'},
        body: dato
      });

      const data = await resp.json();
      return data;
    } catch (error) {
      return false;
    }
  }
  cargarLotes(dato:any, url:number,order:string,orden:string,disp:boolean):Observable<any>{
    return this.http.post(base_url+'/lote/lotes?desde='+url+'&order='+order+'&orden='+orden+'&disp='+disp, dato, {'headers':this.header})
  }
  cargarLote(dato:any):Observable<any>{
    return this.http.post(base_url+'/lote/lote', dato, {'headers':this.header})
  }
  borrarLote(dato:any):Observable<any>{
    return this.http.post(base_url+'/lote/borrarLote', dato, {'headers':this.header})
  }
  async actualizarLote(dato:any){    
    try {
      const resp = await fetch(base_url+'/lote/actualizarLote',{
        method: 'POST', 
        headers: {'Acces-Control-Allow-Origin':'*'},
        body: dato
      });

      const data = await resp.json();
      return data;
    } catch (error) {
      return false;
    }
  }
  duplicarLote(dato:any):Observable<any>{
    return this.http.post(base_url+'/lote/duplicarLote', dato, {'headers':this.header})
  }
  cargarEventos(dato:any, url:number,order:string,orden:string):Observable<any>{
    return this.http.post(base_url+'/evento/eventos?desde='+url+'&order='+order+'&orden='+orden, dato, {'headers':this.header})
  }
  crearEvento(dato:any):Observable<any>{
    return this.http.post(base_url+'/evento/crearEvento', dato, {'headers':this.header})
  }
  agregarLotes(dato:any):Observable<any>{
    return this.http.post(base_url+'/evento/agregarLotes', dato, {'headers':this.header})
  }
}
