import React from 'react';
import { Redirect } from 'react-router-dom';
import userStore from '../store/UserStore';
import * as UserActions from '../store/actions/userActions';
import axios from 'axios';
import { User } from '../viewModels/UserWithErrorMessage';

interface IProps {

}

// defines the type of the state
interface HomeState {
    username: string | undefined;
}

export default class Home extends React.Component<IProps, HomeState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            username: userStore.getUser()?.username
        }
    }

    componentDidMount() {
        userStore.on("change", () => {
            let name = userStore.getUser()?.username;
            if (name == undefined) {
                this.setState({
                    username: ''
                });
            }
            else{
                this.setState({
                    username: name
                });
            }
            
        });
    }

    getUserFromLocalStorage(username: string){
        var path="";
        if(process.env.NODE_ENV === "development"){ path = "http://localhost:5000"}
        axios.get<User>(`${path}/users/username/${username}`)
            .then(result => {
                UserActions.setUser(result.data);
            })
        .catch(err => console.log(err));
    }

    render(){
        if ((this.state.username == "" 
        || this.state.username == undefined 
        || this.state.username == null)
        && localStorage.getItem("user") == null) {
            return (
                <Redirect push to='/register' />
            );
        }
        else {
            var username = localStorage.getItem("user");
            if(username != null && userStore.getUser() == null){
                this.getUserFromLocalStorage(username);
            }
            return (
                <div>
                    Home page!
                </div>
            );
        }
    }
}