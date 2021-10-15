import React  from 'react';
import { NavLink } from 'react-router-dom';
import userStore from '../store/UserStore';
import * as UserActions from '../store/actions/userActions';
import { User } from '../viewModels/UserWithErrorMessage';

interface IProps {

}

// defines the type of the state
interface NavState {
    username: string;
}

export default class NavBar extends React.Component<IProps, NavState> {
    constructor(props: IProps) {
        super(props);
        this.clearUsername = this.clearUsername.bind(this);
        this.state = {
            username: '',
        }
    }

    clearUsername(){
        localStorage.removeItem("user");
        this.setState({
            username: ""
        });
        var user = new User();
        user.username = '';
        UserActions.setUser(user);
    }

    componentDidMount() {
        // this.setState({
        //     username: localStorage.getItem("user")+''
        // })
        userStore.on("change", () => {
            var name = userStore.getUser()?.username;
            if (name == undefined) {
                name = '';
            }
            this.setState({
                username: name
            })
        });
    }

    render(){
        return(
            <nav className="container topnav navbar navbar-dark bg-dark navbar-expand-lg">
                <NavLink to="/" className="main_title navbar-brand">Stringbuzz Guitar Repair</NavLink>
                <div className="collpase navbar-collapse">
                {this.state.username == '' &&
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
                    </ul>
                }
                {this.state.username != '' &&
                    <ul className="navbar-nav ml-auto">
                        <li className="navbar-item">
                            <NavLink style={{color: 'white'}} to="/" className="nav-link">Home </NavLink>
                        </li>
                        <li className="navbar-item">
                            <NavLink style={{color: 'white'}} to="/contact" className="nav-link">Contact Us </NavLink>
                        </li>
                        <li className="navbar-item">
                            <NavLink style={{color: 'white'}} to="/login" className="nav-link" onClick={this.clearUsername}> Logout {this.state.username}</NavLink>
                        </li>
                    </ul>
                }
                    
                </div>
            </nav>
        );
    }
}