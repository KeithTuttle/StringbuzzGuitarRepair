import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
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

export default class Home extends React.Component<IProps, HomeState> {
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
                <div className="background" style={{backgroundImage: `url(images/caio-silva-guitarHomepagePic3.jpg)`}}>
                    
                        <div >  
                            <div className="title">                   
                                <h1 className="centering big_text">STRINGBUZZ</h1>
                                <br/>
                                <p className="page_title">Your Guitar's bestfriend</p>
                                <div >
                                    <NavLink to="/appointment"><button className="mAButton">Make Appointment</button></NavLink>
                                </div>
                                <div>
                                    <NavLink to="/view-instrument"><button className="vIButton">View My Instruments</button></NavLink>
                                </div>
                                <div >
                                    <NavLink to="/repairs"><button className="vRButton">View My Repair Data</button></NavLink>
                                </div>
                            </div>
                        </div>
                </div>
            );
        }
    }
}