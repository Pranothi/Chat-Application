import { Component } from '@angular/core';
import { ChatService } from './services/chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'frontend';
  roomId:string = '';
  messageText:string = '';
  messageArray:{user:string, message:string}[]=[];

  phone:string = '';
  currentUser:any;
  selectedUser:any;

  userList = [
    {
      id:1,
      name: 'Abigail',
      phone: '2003218888',
      image: 'assets/user/dp.jpg',
      roomId:{
        2: 'room-1',
        3: 'room-2',
        4: 'room-3',
        5: 'room-4'
      }
    },
    {
      id:2,
      name: 'Blake',
      phone: '3016219999',
      image: 'assets/user/dp1.jpg',
      roomId:{
        1: 'room-1',
        3: 'room-5',
        4: 'room-6',
        5: 'room-7'
      }
    },
    {
      id:3,
      name: 'Joyel',
      phone: '3251438742',
      image: 'assets/user/dp2.jpg',
      roomId:{
        1: 'room-2',
        2: 'room-5',
        4: 'room-8',
        5: 'room-9'
      }
    },
    {
      id:4,
      name: 'Gloria',
      phone: '2003218888',
      image: 'assets/user/dp3.jpg',
      roomId:{
        1: 'room-3',
        2: 'room-6',
        3: 'room-8',
        5: 'room-10'
      }
    },
    {
      id:5,
      name: 'Clair',
      phone: '8993526783',
      image: 'assets/user/dp4.jpg',
      roomId:{
        1: 'room-4',
        2: 'room-7',
        3: 'room-9',
        4: 'room-10'
      }
    },
  ]

  constructor(private chatservice:ChatService){
    // chatservice.getMessage().subscribe((data: {user:string, message:string})=>{
    //   this.messageArray.push(data)
    // })
    chatservice.getMessage().subscribe({next:(data: {user:string, message:string})=>{
      this.messageArray.push(data)
    }})
  }

  ngOnInit(){}

  selectUserHandler(phone:string){
    this.selectedUser = this.userList.find(user => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.selectedUser.id];
    this.messageArray = []

    this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId:string){
    this.chatservice.joinRoom({data:{user: username, roomId:roomId}})
  }

  sendMessage(){
    this.chatservice.sendMessage({
      data:{
        data: this.currentUser.name,
        room: this.roomId,
        message: this.messageText
      }
    });
    this.messageText = ''
  }

}
