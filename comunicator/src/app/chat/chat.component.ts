import { Component, ElementRef, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Message } from '../shared/interfaces/message';
import { LoginService } from '../shared/services/login.service';
import { Room } from '../shared/interfaces/room';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FindSecondUserOfRoomService } from '../shared/services/find-second-user-of-room.service';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  items:any
  loginData?:string
  currentRoom!: Room;

  messageForm = new FormGroup({
    message: new FormControl('',Validators.required),
  })

  constructor(
    private socket: Socket,
    private loginService: LoginService,
    public findSecondUserOfRoomService: FindSecondUserOfRoomService,
  ) { }

  ngOnInit() {
    this.loginService.loginData$.subscribe((data) => {
      this.loginData = data?.username;
    });

    this.socket.on('roomInfo', (room: Room) => {
      this.currentRoom = room;
      console.log(this.currentRoom)
    })

    this.socket.fromEvent('newMessage').subscribe((message) => {
      const newMessage = message as Message; 
      this.currentRoom?.messages.push(newMessage)

    });
  }

  ngAfterViewChecked() {
    if (this.scrollContainer) {
      this.scrollToBottom();
    }
  }

  sendMessage() {
    if (this.currentRoom && this.messageForm.valid && this.loginData) {
      const messageData = {
          roomName: this.currentRoom.roomName,
          message: this.messageForm.get('message')?.value , 
          sender: this.loginData 
        };
      this.socket.emit('send-message', messageData);
      this.currentRoom.messages.push({ 
        sender: this.loginData, 
        message: this.messageForm.get('message')?.value as string
      });
    }
    this.messageForm.reset()
    this.scrollToBottom()
  }

  scrollToBottom() {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

}
