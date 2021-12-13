import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { UserWithErrorMessage } from '../viewModels/UserWithErrorMessage';
import * as UserActions from '../store/actions/userActions';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// defines the type of the props, if any. could also pass in {}
interface IProps {

}

// defines the type of the state
interface LoginState {
    email: string;
    password: string;
    users: { _id: string, email: string, password: string } [];
    redirect: boolean;
    wrongEmail: string;
    wrongPassword: string;
}

class LoginUser extends React.Component<IProps, LoginState> {
    constructor(props: IProps) {
        super(props);
        

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {
            email: '',
            password: '',
            users: [],
            redirect: false,
            wrongEmail: '',
            wrongPassword: ''
        }
    }

    onChangeEmail(event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        this.setState({
            email: target.value
        });
    }

    onChangePassword(event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        this.setState({
            password: target.value
        });
    }

    onSubmit(event: React.FormEvent){
        var path="";
        if(process.env.NODE_ENV === "development"){ path = "http://localhost:5000"}
        event.preventDefault();
        this.setState({wrongPassword: "", wrongEmail: ""});

        const user = { 
            email: this.state.email, 
            password: this.state.password 
        }

        axios.post<UserWithErrorMessage>(path+'/users/login', user)
            .then(result => {
                if(result.data.error !== ""){
                    if(result.data.error.includes("Email")){
                        this.setState({wrongEmail: result.data.error});
                    }
                    if(result.data.error.includes("Password")){
                        this.setState({wrongPassword: result.data.error});
                    }
                }
                else if(result.data.user === null){
                    const MySwal = withReactContent(Swal);
                    return MySwal.fire(<p>Login Failed</p>,<span>User was not found</span>, "error");
                }
                else{
                    UserActions.setUser(result.data.user);
                    localStorage.setItem('user', result.data.user?.email);
                    this.setState({
                        redirect: true
                    });
                }
            })
        .catch(err => console.log(err));
    }

    render(){
        return(
            <div className="container" style={{marginLeft: 'auto', marginRight: 'auto', width: '30%'}}>
                { this.state.redirect ? (<Redirect to={{pathname: "/" }}/>) : null }
                <h3>Sign in to Your Account</h3>
                <form onSubmit={this.onSubmit}>
                <div className="form-group"> 
                    <label>Email: </label>
                    <input  type="text"
                        style={{width: '90%'}}
                        required
                        id="emailText"
                        className="form-control"
                        value={this.state.email}
                        onChange={this.onChangeEmail}
                        />
                    {this.state.wrongEmail.length > 0 &&
                        <div style={{color: 'red', fontWeight: 'bold', paddingBottom: '10px'}}>
                            {this.state.wrongEmail}
                        </div>
                    }
                    <label>Password: </label>
                    <input  type="password"
                        style={{width: '90%'}}
                        required
                        id="passwordText"
                        className="form-control"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        />
                    {this.state.wrongPassword.length > 0 &&
                        <div style={{color: 'red', fontWeight: 'bold', paddingBottom: '10px'}}>
                            {this.state.wrongPassword}
                        </div>
                    }
                </div>
                <div className="form-group">
                    <input type="submit" value="Login" className="btn btn-primary" />
                </div>
                </form>
            </div>
        );      
    }
}

export default LoginUser;