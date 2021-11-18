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
                    <section>
                        <div >  
                            <div className="title">                   
                                <h1 className="centering big_text">STRINGBUZZ</h1>
                                <br/>
                                <p className=" page_title">Your Guitar's bestfriend</p>
                                <div >
                                    <button className="mAButton">Make Appointment</button>
                                </div>
                                <div >
                                    <button className="vIButton">View My Instruments</button>
                                </div>
                                <div >
                                    <button className="vRButton">View My Repair Data</button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer>
                        <ul className="mediaFooter">
                            <li>
                                <a href="https://twitter.com" target="_blank">
                                    <img className="footer-img" src="images/Twitter favicon.png"/>
                                </a>
                            </li>
                            <li>
                                <a href="https://youtube.com" target="_blank">                       
                                    <img className="footer-img" src="images/Youtube favicon.png"/>                   
                                </a>
                            </li>
                            <li>
                                <a href="https://instagram.com" target="_blank">                       
                                    <img className="footer-img" src="images/IG favicon.png"/>                       
                                </a>
                            </li>
                        </ul>
                    </footer> 
                </div>
            );
        }
    }
}