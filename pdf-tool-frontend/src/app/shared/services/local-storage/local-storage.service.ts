import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  getToken(){
    let token = localStorage.getItem('token') ? atob(localStorage.getItem('token') as string) : null 
    return token
  }

  setToken(token : string){
    localStorage.setItem('token', btoa(token))
  }

  removeToken(){
    localStorage.removeItem('token')
  }

  setUserId(id : string){
    localStorage.setItem('userId', id)
  }
  
  getUserId(){
    return localStorage.getItem('userId') as string
  }

  removeId(){
    localStorage.removeItem('userId')
  }

}
