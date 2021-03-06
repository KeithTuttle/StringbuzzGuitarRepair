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
    email: string | undefined;
}

export default class MakeAppointment extends React.Component<IProps, HomeState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            email: userStore.getUser()?.email
        }
    }

    componentDidMount() {
        userStore.on("change", () => {
            let email = userStore.getUser()?.email;
            if (email == undefined) {
                this.setState({
                    email: ''
                });
            }
            else{
                this.setState({
                    email: email
                });
            }
            
        });
    }

    getUserFromLocalStorage(email: string){
        var path="";
        if(process.env.NODE_ENV === "development"){ path = "http://localhost:5000"}
        axios.get<User>(`${path}/users/email/${email}`)
            .then(result => {
                UserActions.setUser(result.data);
            })
        .catch(err => console.log(err));
    }

    render(){
        if ((this.state.email == "" 
        || this.state.email == undefined 
        || this.state.email == null)
        && localStorage.getItem("user") == null) {
            return (
                <Redirect push to='/register' />
            );
        }
        else {
            var email = localStorage.getItem("user");
            if(email != null && userStore.getUser() == null){
                this.getUserFromLocalStorage(email);
            }
            return (
                <div style={{minHeight: "60vh"}} className="container">
                    Make an appointment!
                </div>
            );
        }
    }
}