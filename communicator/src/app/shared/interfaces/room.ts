import { Message } from "./message";

export interface Room {
    roomName: string, 
    participants:string[],
    messages: Message[],
}
