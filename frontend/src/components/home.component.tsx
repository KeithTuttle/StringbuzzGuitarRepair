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
                    
                    
                        <div className = "footer" >
                            <div className = "footer-elements">
                                <div className = "footer-section about">
                                    <h5 className = "h5-type">About US</h5>
                                    <p>We here at Stringbuzz Guitar Repair want to be your first choice on any of your guitar repair needs. While being Established since 2021, we take pride in the quality and care of the work we povide just for you.</p>
                                </div>
                                <div className = "followUs"><h5>Follow US</h5></div>
                                <div className = "support">
                                    <h5 className = "h5-type">Support</h5>
                                    <p>1-800-Stringbuzz</p>
                                    <a href =" ">support@Stringbuzz.com</a>
                                    <p>12345 Buzz blvd 
                                        City, State 22222
                                        United States
                                    </p>
                                </div>
                                <div className = "footer-section social-links">
                                    <ul className="mediaFooter ul_horizontal ">
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
                                </div>
                            </div>

                            <div className = "footer-copyright">&copy; 2021 Stringbuzz | All Rights Reserved</div>
                        </div>
                    
                </div>
            );
        }
    }
}