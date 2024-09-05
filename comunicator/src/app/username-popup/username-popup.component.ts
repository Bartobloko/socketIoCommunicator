import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { LoginService } from '../shared/services/login.service';

@Component({
  selector: 'app-username-popup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './username-popup.component.html',
  styleUrl: './username-popup.component.scss'
})
export class UsernamePopupComponent {

  constructor(
    private socket: Socket,
    private loginService: LoginService
  ) {}

  userNameForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
     Validators.pattern(/^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/)
    ]),
  })


  saveUser() {
    if(this.userNameForm.valid) {
      this.socket.emit('addUser', this.userNameForm.value)
      this.socket.on('userCreated',(message:any) => {
        this.loginService.setLoginData(this.userNameForm.value);
      }) 
    } 
  }

}
