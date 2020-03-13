import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme = false;

  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() { 
    this.usuario = new UsuarioModel();
    
  }

  onSubmit( form: NgForm ) {

    if ( form.invalid ) {
    /* console.log('Formulario enviado');
    console.log(this.usuario);
    console.log(form);
    console.log('form.controls.email.errors:', form.controls.email.errors);
    console.log('form.controls.email.errors.required:', form.controls.email.errors.required) */;
    return;
    }
    /* console.log('Formulario sin errores');
    console.log(this.usuario);
    console.log(form); */
    //console.log('form.controls.email.errors:', form.controls.email.errors);

    /* this.auth.nuevoUsuario( this.usuario)
      .subscribe( resp => {
        console.log( 'nuevo usuario', resp );
      }, err => {
        console.log('usuario ya creado', err.error.error.message)
      });
 */


    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.nuevoUsuario( this.usuario )
      .subscribe( resp => {

        console.log(resp);
        Swal.close();

        if ( this.recordarme ) {
          localStorage.setItem('email', this.usuario.email);
        } else {
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/home');

      }, (err) => {
        console.log(err.error.error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message
        });
      });
  }


}
