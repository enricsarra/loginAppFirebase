
// https://firebase.google.com -->
// https://firebase.google.com/docs/reference/rest/auth#section-create-email-password -->

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { environment } from '../../environments/environment';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private url = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private apikey = `${ environment.apikey }`;


  userToken: string;

  // Crear nuevo usuario 'Sign up with email / password'
  // nuevo   https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]


  // Login 'Sign in with email / password'
  // nuevo    https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  constructor( private http: HttpClient ) {
    this.leerToken();
  }


  logout() {
    localStorage.removeItem('token');
  }

  login( usuario: UsuarioModel ) {

    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }:signInWithPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        this.guardarToken( resp['idToken'] );
        return resp;
      })
    );

  }

  nuevoUsuario( usuario: UsuarioModel ) {

    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }:signUp?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        this.guardarToken( resp['idToken'] );
        return resp;
      })
    );

  }


  private guardarToken( idToken: string ) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    // podemos recuperar expiresIn de tocken 
    // cuando accedemos a buscar el tocken en login
    // o nuevo usuario. Lo podríamos grabar en la local
    // storage... Siempre manda 3600 y lo hago a saco
    // para no perder el tiempo. 
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );


  }

  leerToken() {

    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;

  }


  estaAutenticado(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }

  }


}
