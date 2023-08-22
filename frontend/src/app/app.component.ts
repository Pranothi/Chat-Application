import { Component, ViewChild } from '@angular/core';
import { ChatService } from './services/chat/chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // @ViewChild('popup', {static:false}) popup:any;

  roomId:string = '';
  messageText:string = '';
  messageArray:{user:string, message:string}[]=[];

  phone:string = '';
  currentUser:any;
  selectedUser:any;
  showScreen:any;
  storageArray:any;

  userList = [
    {
      id:1,
      name: 'Pranothi',
      phone: '8086967262',
      image: './assets/user/dp.jpg',
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
      phone: '1',
      image: './assets/user/dp1.jpg',
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
      image: './assets/user/dp2.jpg',
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
      image: './assets/user/dp3.jpg',
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
      image: './assets/user/dp4.jpg',
      roomId:{
        1: 'room-4',
        2: 'room-7',
        3: 'room-9',
        4: 'room-10'
      }
    }
  ]

  constructor(private chatservice:ChatService, private modalService:NgbModal){ }

  ngOnInit(){
    this.chatservice.getMessage()
      .subscribe((data: { user: string, room: string, message: string }) => {
        if (this.roomId) {
          setTimeout(() => {
            this.storageArray = this.chatservice.getStorage();
            const storeIndex = this.storageArray
              .findIndex((storage:any) => storage.roomId === this.roomId);
            this.messageArray = this.storageArray[storeIndex].chats;
          }, 500);
        }
      });
  }

  // ngAfterViewInit(){
  //   this.modalService.open(this.popup, {backdrop: 'static', centered: true})
  // }

  // openPopup(content: any){
  //   this.modalService.open(content, {backdrop: 'static', centered: true});
  // }

  login(dismiss:any){
    this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
    this.userList = this.userList.filter(user=> user.phone !== this.phone.toString() );

    if(this.currentUser){
      this.showScreen = true;
      dismiss()
    }
  }

  logIn(){
    this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
    this.userList = this.userList.filter(user=> user.phone !== this.phone.toString());
    if(this.currentUser){
      this.showScreen = true;
    }
  }

  selectUserHandler(phone:string){
    this.selectedUser = this.userList.find(user => user.phone === phone);    
    this.roomId = this.selectedUser.roomId[this.currentUser.id];        
    this.messageArray = []
    this.storageArray = this.chatservice.getStorage();
    const storeIndex = this.storageArray.findIndex((storage:any) => storage.roomId === this.roomId);
    if (storeIndex > -1){
      this.messageArray = this.storageArray[storeIndex].chats;
    }
    this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId:string){
    this.chatservice.joinRoom({data:{user: username, roomId:roomId}})
    const data = localStorage.getItem("userData");
    console.log("data: ", JSON.parse(data!));  
  }

  sendMessage(){
    this.chatservice.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText
    });
    this.storageArray = this.chatservice.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage:any) => storage.roomId === this.roomId);
    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      });      
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };      
      this.storageArray.push(updateStorage);
    }
    this.messageArray = this.storageArray[storeIndex].chats;    
    this.chatservice.setStorage(this.storageArray);
    this.messageText = ''
  }

}
