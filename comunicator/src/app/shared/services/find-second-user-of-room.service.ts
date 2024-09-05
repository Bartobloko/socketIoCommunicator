import { Injectable } from '@angular/core';
import { Room } from '../interfaces/room';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class FindSecondUserOfRoomService {
  loginData: string = ''

  constructor(
    private loginService: LoginService
  ) { 
   }

  findSecondParticipantName(room: Room) {
    this.loginService.loginData$.subscribe((data) => {
      this.loginData = data?.username;
    });  
    if (room && room.participants) {
      return room.participants.find(participant => participant !== this.loginData)
    } 
    return null
  }
}
