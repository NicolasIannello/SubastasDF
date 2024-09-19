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
}
