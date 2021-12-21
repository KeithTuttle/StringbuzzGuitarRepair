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
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    redirect: boolean;
    emailError: string;
    firstNameError: string;
    lastNameError: string;
    passwordError: string;
}

class RegisterUser extends React.Component<IProps, RegisterState> {

    //these are the regex match cases that define proper input for each field
    //TODO: restrict upper bound on character length
    readonly password_regex: RegExp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{6,})\S$/;
    readonly email_regex: RegExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    constructor(props: IProps) {
        super(props);

        this.onChangePassword = this.onChangePassword.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            redirect: false,
            emailError: '',
            firstNameError: '',
            lastNameError: '',
            passwordError: ''
        }
    }


    onChangePassword(event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        this.setState({
            password: target.value,
        });
    }

    validatePassword(){
        const err_msg = "password must be at least 6 characters long and contain at least:\n"+
                             "one capital letter, one lowercase letter, one number, and one special character"
        var match = this.state.password.match(this.password_regex);
        this.setState({
            passwordError: match ? "" : err_msg
        });
        return match
    }

    onChangeEmail(event: React.FormEvent<HTMLInputElement>){
        const target = event.target as HTMLInputElement;
        this.setState({
            email: target.value,
        });
        
    }

    validateEmail(){
        const err_msg = "invalid email address"
        var match = this.state.email.match(this.email_regex);
        this.setState({
            emailError: match ? "" : err_msg
        });
        return match
    }

    onChangeFirstName(event: React.FormEvent<HTMLInputElement>){
        const target = event.target as HTMLInputElement;
        this.setState({
            firstName: target.value
        });
        
    }

    onChangeLastName(event: React.FormEvent<HTMLInputElement>){
        const target = event.target as HTMLInputElement;
        this.setState({
            lastName: target.value
        });
        
    }

    onSubmit(event: React.FormEvent){
        const MySwal = withReactContent(Swal);
        if(!this.validateEmail() || !this.validatePassword() || this.state.firstName.trim().length == 0 || this.state.lastName.trim().length == 0){
            return MySwal.fire(<p>Registration Failed</p>,<span>Please enter all fields and fix all errors with email and password before submitting</span>, "error");
        }
        var path="";
        if(process.env.NODE_ENV === "development"){ path = "http://localhost:5000"}
        event.preventDefault();
        this.setState({
            emailError: '',
            passwordError: ''
        })
        const user = { 
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password
        }
        try{
            axios.post<UserWithErrorMessage>(path+'/users/add', user)
            .then(result => {
                if(result.data.error !== ""){
                    if(result.data.error.includes("This email already has a registered account")){
                        this.setState({emailError: result.data.error});
                    }
                    
                    else {
                        return MySwal.fire(<p>Login Failed</p>,<span>{result.data.error}</span>, "error");
                    }
                }
                else if(result.data.user === null){
                    return MySwal.fire(<p>Registration Failed</p>,<span>unexpected error occured</span>, "error");
                }
                else{
                    UserActions.setUser(result.data.user);
                    localStorage.setItem('user', result.data.user.email);
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
            <div className="container" style={{minHeight: "60vh", marginLeft: 'auto', marginRight: 'auto', width: '30%'}}>
                { this.state.redirect ? (<Redirect push to='/'/>) : null }
                <h3>Create Account</h3>
                <form onSubmit={this.onSubmit}>
                <div className="form-group"> 
                    <label>E-mail: </label>
                    <input  type="email"
                        style={{width: '90%'}}
                        required
                        className="form-control"
                        value={this.state.email}
                        onChange={this.onChangeEmail}
                        onBlur={this.validateEmail}
                        />
                        {this.state.emailError.length > 0 &&
                        <div style={{color: 'red', fontWeight: 'bold', paddingBottom: '10px'}}>
                            {this.state.emailError}
                        </div>}
                    <label>First Name: </label>
                    <input  type="text"
                        style={{width: '90%'}}
                        required
                        className="form-control"
                        value={this.state.firstName}
                        onChange={this.onChangeFirstName}
                        />
                        {this.state.firstNameError.length > 0 &&
                        <div style={{color: 'red', fontWeight: 'bold', paddingBottom: '10px'}}>
                            {this.state.firstNameError}
                        </div>}
                    <label>Last Name: </label>
                    <input  type="text"
                        style={{width: '90%'}}
                        required
                        className="form-control"
                        value={this.state.lastName}
                        onChange={this.onChangeLastName}
                        />
                        {this.state.lastNameError.length > 0 &&
                        <div style={{color: 'red', fontWeight: 'bold', paddingBottom: '10px'}}>
                            {this.state.lastNameError}
                        </div>}
                    <label>Password: </label>
                    <input  type="password"
                        style={{width: '90%'}}
                        required
                        className="form-control"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        onBlur={this.validatePassword}
                        />
                        {this.state.passwordError.length > 0 && !this.state.passwordError.includes('server') &&
                        <div style={{color: 'red', fontWeight: 'bold', paddingBottom: '10px'}}>
                            Passwords must:
                            <ul>
                                <li>be 6 characters long</li>
                                <li>contain one upper case character</li>
                                <li>contain one lower case character</li>
                                <li>contain one number</li>
                                <li>contain one special character</li>
                            </ul>
                        </div>}
                        {this.state.passwordError.length > 0 && this.state.passwordError.includes('server') &&
                        <div style={{color: 'red', fontWeight: 'bold', paddingBottom: '10px'}}>
                            {this.state.passwordError}
                        </div>}
                </div>
                <div className="form-group">
                    <input type="submit" onMouseDown={this.onSubmit} value="Register" className="btn btn-primary" />
                </div>
                </form>
            </div>
        );      
    }

    
}

export default RegisterUser;