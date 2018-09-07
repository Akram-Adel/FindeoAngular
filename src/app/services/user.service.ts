import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {

  public userToken:string;
  private user:any;
  /* this[KEY] --> LOGGED USER DATA
  [id]
  [firstName]
  [email]
  */
  public lastName:string;
  public phone:any;
  public profileId:number;
  public imageId:number;
  public imageUrl:string = 'https://s3-eu-west-1.amazonaws.com/aliraqhomes/assets/Blank-profile.png';
  public isAgent:boolean;
  public agentId:number;
  public agentName:string;
  public description:string;
  public agentLocation:Object;

  private userUpdate = new Subject<number>();
  userUpdate$:Observable<number> = this.userUpdate.asObservable();
  userUpdated() { this.userUpdate.next( Math.random() ) }



  constructor() { }



  makeUserIdToken(token) {
    this.userToken = token.id_token;
  }
  createUser(user) {
    // console.log(user);
    this.user = user;
    for(let key in user) {
      if(user.hasOwnProperty(key) && (this[key] || this[key] == null)) this[key] = user[key];
    }

    this.userUpdated();
  }
  makeUserProfile(profile) {
    let profileData = profile[0]
    // console.log(profileData);
    this.phone = profileData['phone'];
    this.lastName = profileData['user']['lastName'];
    this.profileId = profileData['id'];
    if(profileData['avatar']) {
      this.imageId = profileData['avatar']['id'];
      this.imageUrl = profileData['avatar']['s3Path'];
    }

    this.userUpdated();
  }
  makeAgentProfile(agent) {
    let agentData = agent[0];
    // console.log(agentData);
    if(agent.length == 0) {
      this.isAgent = false;
    } else {
      this.isAgent = true;
      this.agentId = agentData.id;
      this.agentName = agentData.name;
      this.description = agentData.description;
      this.agentLocation = agentData.location;
    }


    this.userUpdated();
  }



  destroyUser() {
    this.userToken = null;
    for(let key in this.user) {
      if(this.user.hasOwnProperty(key) && (this[key] || this[key] == null)) this[key] = null;
    }
    localStorage.removeItem('findeoUserToken');

    this.userUpdated();
  }

  rememberUser() {
    localStorage.setItem('findeoUserToken', this.userToken);
  }

}
