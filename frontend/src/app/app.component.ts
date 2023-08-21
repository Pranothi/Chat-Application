import { Component, ViewChild } from '@angular/core';
import { ChatService } from './services/chat/chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('popup', {static:false}) popup:any;

  title = 'frontend';
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

  constructor(private chatservice:ChatService, private modalService:NgbModal){
    // chatservice.getMessage().subscribe((data: {user:string, message:string})=>{
    //   this.messageArray.push(data)
    // })
    // chatservice.getMessage().subscribe({next:(data: {user:string, message:string})=>{
    //   this.messageArray.push(data)
    // }})
  }

  ngOnInit(){
    // this.currentUser = this.userList[0]
    this.chatservice.getMessage().subscribe({next:(data: {user:string, message:string})=>{
      // this.messageArray.push(data)
      if(this.roomId){
        this.storageArray = this.chatservice.getStorage()
        const storeIndex = this.storageArray.findIndex((storage:any) => storage.roomId === this.roomId)
        this.messageArray = this.storageArray[storeIndex].chats
      }
    }})
  }

  ngAfterViewInit(){
    this.openPopup(this.popup)
  }

  openPopup(content: any){
    this.modalService.open(content, {backdrop: 'static', centered: true});
  }

  login(dismiss:any){
    this.currentUser = this.userList.find(user => user.phone === this.phone.toLowerCase());
    this.userList = this.userList.filter( user=> user.phone !== this.phone.toLowerCase() );

    if(this.currentUser){
      this.showScreen = true;
      dismiss()
    }
  }

  selectUserHandler(phone:string){
    this.selectedUser = this.userList.find(user => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.selectedUser.id];
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
