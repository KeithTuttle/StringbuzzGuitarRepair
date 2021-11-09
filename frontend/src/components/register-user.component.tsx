import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { UserWithErrorMessage } from '../viewModels/UserWithErrorMessage';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as UserActions from '../store/actions/userActions';

// defines the type of the props, if any. could also pass in {}
interface IProps {

}

// defines the type of the state
interface RegisterState {
    username: string;
    email: string;
    password: string;
    redirect: boolean;
    usernameError: string;
    emailError: string;
    passwordError: string;
}

class RegisterUser extends React.Component<IProps, RegisterState> {

    //these are the regex match cases that define proper input for each field
    //TODO: restrict upper bound on character length
    readonly username_regex: RegExp = /^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9_-]+([^._-])$/;
    readonly password_regex: RegExp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{6,})\S$/;
    readonly email_regex: RegExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    constructor(props: IProps) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {
            username: '',
            email: '',
            password: '',
            redirect: false,
            usernameError: '',
            emailError: '',
            passwordError: ''
        }
    }


    onChangeUsername(event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        const err_msg = "username may only contain dashes, underscores, periods, "
                        +"and alphanumeric characters, and must be between 3 and 20 characters long"
        this.setState({
            username: target.value,
            usernameError: this.state.username.match(this.username_regex) ? "" : err_msg
        });
    }

    onChangePassword(event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        const err_msg = "password must be at least 6 characters long and contain at least:\n"+
                             "one capital letter, one lowercase letter, one number, and one special character"
        this.setState({
            password: target.value,
            passwordError: this.state.password.match(this.password_regex) ? "" : err_msg
        });
    }

    onChangeEmail(event: React.FormEvent<HTMLInputElement>){
        const target = event.target as HTMLInputElement;
        this.setState({
            email: target.value,
            emailError: (this.state.email.match(this.email_regex)) ? "" : "invalid email address"
        });
        
    }

    onSubmit(event: React.FormEvent){
        var path="";
        if(process.env.NODE_ENV === "development"){ path = "http://localhost:5000"}
        event.preventDefault();
        this.setState({
            usernameError: ''
        })
        const MySwal = withReactContent(Swal);
        const user = { 
            username: this.state.username, 
            password: this.state.password 
        }
        try{
            axios.post<UserWithErrorMessage>(path+'/users/add', user)
            .then(result => {
                if(result.data.error !== ""){
                    if(result.data.error.includes("username is taken")){
                        this.setState({usernameError: result.data.error});
                    }
                    //if error includes "email already registered"
                    //if error includes "password sucks"
                    
                    else {
                        return MySwal.fire(<p>Login Failed</p>,<span>{result.data.error}</span>, "error");
                    }
                }
                else if(result.data.user === null){
                    return MySwal.fire(<p>Registration Failed</p>,<span>unexpected error occured</span>, "error");
                }
                else{
                    UserActions.setUser(result.data.user);
                    localStorage.setItem('user', result.data.user.username);
                    this.setState({
                        redirect: true
                    });
                }
            })
            .catch(err => console.log(err));
        }
        catch (err){
            console.log(err)
        }
    }

    render(){
        return(
            <div className="container" style={{marginLeft: 'auto', marginRight: 'auto', width: '30%'}}>
                { this.state.redirect ? (<Redirect push to='/'/>) : null }
                <h3>Create Account</h3>
                <form onSubmit={this.onSubmit}>
                <div className="form-group"> 
                    <label>Username: </label>
                    <input  type="text"
                        style={{width: '90%'}}
                        required
                        className="form-control"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                        />
                        {this.state.usernameError.length > 0 &&
                        <div style={{color: 'red', fontWeight: 'bold', paddingBottom: '10px'}}>
                            {this.state.usernameError}
                        </div>
                    }
                    <label>E-mail: </label>
                    <input  type="email"
                        style={{width: '90%'}}
                        required
                        className="form-control"
                        value={this.state.email}
                        onChange={this.onChangeEmail}
                        />
                        {this.state.emailError.length > 0 &&
                        <div style={{color: 'red', fontWeight: 'bold', paddingBottom: '10px'}}>
                            {this.state.emailError}
                        </div>}
                    <label>Password: </label>
                    <input  type="password"
                        style={{width: '90%'}}
                        required
                        className="form-control"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        />
                        {this.state.passwordError.length > 0 &&
                        <div style={{color: 'red', fontWeight: 'bold', paddingBottom: '10px'}}>
                            {this.state.passwordError}
                        </div>}
                </div>
                <div className="form-group">
                    <input type="submit" value="Register" className="btn btn-primary" />
                </div>
                </form>
            </div>
        );      
    }

    
}

export default RegisterUser;