import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { LoginService } from '../shared/services/login.service';
import { LoginData } from '../shared/interfaces/login-data';
import { Message } from '../shared/interfaces/message';
import { Room } from '../shared/interfaces/room';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FindSecondUserOfRoomService } from '../shared/services/find-second-user-of-room.service';

@Component({
  selector: 'app-chatlist',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chatlist.component.html',
  styleUrl: './chatlist.component.scss'
})
export class ChatlistComponent {
  items: any
  search: boolean = false;
  users: LoginData[] = [];
  loginData: string = '';
  rooms: Room[] = [];
  currentRoom: Room | null = null;
  newMessage: string = '';

  searchForm = new FormGroup({
    searchTerm: new FormControl(''), 
  });
  

  constructor(
    private socket: Socket,
    private loginService: LoginService,
    public findSecondUserOfRoomService: FindSecondUserOfRoomService,
  ) {}

  ngOnInit() {

    this.loginService.loginData$.subscribe((data) => {
      this.loginData = data?.username;
    });   
    
    this.socket.on('rooms', (rooms: Room[]) => {
      this.rooms = rooms.filter(rooms => rooms.participants.includes(this.loginData));
    })
    
  }

  fliteredUsers() {
    let searchString = this.searchForm.get('searchTerm')?.value;
    if (!searchString) {
      return this.users;
    }
    return this.users.filter(user => 
      user.username.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  filteredRooms(): Room[] {
    let searchString = this.searchForm.get('searchTerm')?.value;
    if (!searchString) {
      return this.rooms;
    }
    return this.rooms.filter(room => 
      room.roomName.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  downloadUsers() {
    this.searchForm.get('searchTerm')?.setValue('');
    this.socket.emit('downloadUsers',);
    this.socket.fromEvent('userList').subscribe((users)=> {
      this.users = users as LoginData[];
      this.search = true;
    })
    
  }

  startConversation(invitedUser: string) {
    if (!this.loginData) return;
    this.socket.emit('createRoom', { invitedUser, loginData: this.loginData });
    this.search = false;
    this.searchForm.get('searchTerm')?.setValue('');
  }

  switchRoom(roomToSwitch: { roomName: string, messages: Message[] }) {
    const room = this.rooms.find(r => r.roomName === roomToSwitch.roomName);
    if (room) {
      this.currentRoom = room;
      this.socket.emit('joinRoom', roomToSwitch);
      this.searchForm.get('searchTerm')?.setValue('');
    }
  }

}
