import React  from 'react';
import { NavLink } from 'react-router-dom';
import userStore from '../store/UserStore';
import * as UserActions from '../store/actions/userActions';
import { User } from '../viewModels/UserWithErrorMessage';

interface IProps {

}

// defines the type of the state
interface NavState {
    firstName: string;
}

export default class NavBar extends React.Component<IProps, NavState> {
    constructor(props: IProps) {
        super(props);
        this.clearUsername = this.clearUsername.bind(this);
        this.state = {
            firstName: '',
        }
    }

    clearUsername(){
        localStorage.removeItem("user");
        this.setState({
            firstName: ""
        });
        var user = new User();
        user.firstName = '';
        UserActions.setUser(user);
    }

    componentDidMount() {
        userStore.on("change", () => {
            var name = userStore.getUser()?.firstName;
            if (name == undefined) {
                name = '';
            }
            this.setState({
                firstName: name
            })
        });
    }

    render(){
        return(
            <nav className="container topnav navbar navbar-dark bg-dark navbar-expand-lg">
                <NavLink to="/" className="main_title navbar-brand">Stringbuzz Guitar Repair</NavLink>
                <div className="collpase navbar-collapse">
                {this.state.firstName == '' &&
                    <ul className="navbar-nav ml-auto">
                        <li className="navbar-item">
                            <NavLink style={{color: 'white'}} to="/contact" className="nav-link">Contact Us </NavLink>
                        </li>
                        <li className="navbar-item">
                            <NavLink style={{color: 'white'}} to="/register" className="nav-link">Register</NavLink>
                        </li>
                        <li className="navbar-item">
                            <NavLink style={{color: 'white'}} to="/login" className="nav-link">Log-In</NavLink>
                        </li>
                        <input className="navbar-search" type="text" placeholder="Search..."></input>
                    </ul>
                }
                {this.state.firstName != '' &&
                    <ul className="navbar-nav ml-auto">
                        <li className="navbar-item">
                            <NavLink style={{color: 'white'}} to="/" className="nav-link">Home </NavLink>
                        </li>
                        <li className="navbar-item">
                            <NavLink style={{color: 'white'}} to="/contact" className="nav-link">Contact Us </NavLink>
                        </li>
                        
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Account </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Logout</a></li>
                                    <li><a className="dropdown-item" href="#">View Profile Info</a></li>
                                </ul>
                        </li>
                        <input className="navbar-search" type="text" placeholder="Search..."></input>
                    </ul>
                }
                    
                </div>
            </nav>
        );
    }
}