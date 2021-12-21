import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import userStore from '../store/UserStore';
import * as UserActions from '../store/actions/userActions';
import axios from 'axios';
import { User } from '../viewModels/UserWithErrorMessage';

interface IProps {

}

// defines the type of the state
interface FooterState {
}

export default class Footer extends React.Component<IProps, FooterState> {
    constructor(props: IProps) {
        super(props);
        
    }

    render(){
        return (
            <div className = "footer" >
                    <div className = "footer-elements">
                        <div style={{paddingTop: 30}} className="row justify-content-center">
                            <div style={{textAlign: "center"}} className="col-4">
                            <h5 className = "h5-type">About US</h5>
                            <p>We here at Stringbuzz Guitar Repair want to be your first choice on any of your guitar repair needs. While being Established since 2021, we take pride in the quality and care of the work we povide just for you.</p>
                            </div>
                            <div style={{textAlign: "center"}} className="col-4">
                            <div className = "followUs"><h5>Follow US</h5></div>
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
                            <div style={{textAlign: "center"}} className="col-4">
                            <div className = "support">
                            <h5 className = "h5-type">Support</h5>
                            <p>1-800-Stringbuzz</p>
                            <a style={{color: "goldenrod", fontSize: 16}} href =" ">support@Stringbuzz.com</a>
                            <p>12345 Buzz blvd 
                                City, State 22222
                                United States
                            </p>
                        </div>
                            </div>
                        </div>
                    </div>

                    <div className = "footer-copyright">&copy; 2021 Stringbuzz | All Rights Reserved</div>
                </div>
            );
        }
    }