import { EventEmitter } from 'events';
import { User } from '../viewModels/UserWithErrorMessage';
import Dispatcher from './dispatcher';

class UserStore extends EventEmitter {
    user: User | null = null;
     constructor(){
         super();
     }

     setUser(user: User | null){
        this.user = user;

        this.emit("change");
     }

     getUser(){
         return this.user;
     }

     //not type safe
     handleActions(action: any){
        switch(action.type){
            case "SET_USER": {
                this.setUser(action.user);
            }
        }
     }
}

const userStore = new UserStore;
Dispatcher.register(userStore.handleActions.bind(userStore));

export default userStore;
