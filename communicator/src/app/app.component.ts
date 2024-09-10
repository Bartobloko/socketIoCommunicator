import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from "./chat/chat.component";
import { UsernamePopupComponent } from "./username-popup/username-popup.component";
import { ChatlistComponent } from "./chatlist/chatlist.component";
import { LoginService } from './shared/services/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, UsernamePopupComponent, ChatlistComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'comunicator';
  loginData: any;

  constructor(
    private loginService: LoginService
  ){}

  ngOnInit() {
    this.loginService.loginData$.subscribe((data) => {
      this.loginData = data;
    });
  }

}
