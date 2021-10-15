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
    password: string;
    redirect: boolean;
    usernameError: string;
}

class RegisterUser extends React.Component<IProps, RegisterState> {
    constructor(props: IProps) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {
            username: '',
            password: '',
            redirect: false,
            usernameError: ''
        }
    }

    onChangeUsername(event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        this.setState({
            username: target.value
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
                    <label>Password: </label>
                    <input  type="password"
                        style={{width: '90%'}}
                        required
                        className="form-control"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        />
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