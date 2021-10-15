import axios from 'axios';
import React from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// defines the type of the props, if any. could also pass in {}
interface IProps {

}

// defines the type of the state
class ContactState {
    firstName = "";
    lastName = "";
    email = "";
    message = "";
    status= "";
}

class ContactUs extends React.Component<IProps, ContactState> {
    constructor(props: IProps) {
        super(props);

        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            message: '',
            status: "Submit"
        }

    }

    onChangeFirstName(event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        this.setState({
            firstName: target.value
        });
    }

    onChangeLastName(event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        this.setState({
            lastName: target.value
        });
    }

    onChangeEmail(event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        this.setState({
            email: target.value
        });
    }

    onChangeMessage(event: React.FormEvent<HTMLTextAreaElement>) {
        const target = event.target as HTMLInputElement;
        this.setState({
            message: target.value
        });
    }

    onSubmit(event: React.FormEvent){
        var path="";
        if(process.env.NODE_ENV === "development"){ path = "http://localhost:5000"}
        event.preventDefault();
        const MySwal = withReactContent(Swal)
        this.setState({ status: "Sending" });  
        axios({
          method: "POST",
          url: path+"/users/contact",
          data: this.state,
        }).then((response) => {
          if (response.data.status === "sent") {
            this.setState({ firstName: "", lastName: "", email: "", message: "", status: "Submit" });
            return MySwal.fire(<p>Message Sent!</p>,<span>Thank you for your email, we look forward to hearing from you!</span>, "success");
          } else if (response.data.status === "failed") {
            return MySwal.fire(<p>Message Failed!</p>,<span>Uh oh! Something went wrong and we did not recieve your message</span>, "error");
          }
        });
      }

    render(){
        let buttonText = this.state.status;
        return(
            <div className="container">
                <div className="title">
                    <h1 className="page_title">Contact the Stringbuzz Team</h1>
                </div>
                <div style={{marginTop: "18px"}}>
                <div className="inner_navcontainer">
                    <div className="inner_contactcontainer">
                        <form onSubmit={this.onSubmit}>
                            <label htmlFor="fname">First Name</label>
                            <input type="text" 
                            id="fname" 
                            name="firstname" 
                            placeholder="Your first name..."
                            required
                            className="form-control"
                            value={this.state.firstName}
                            onChange={this.onChangeFirstName}></input>

                            <label htmlFor="lname">Last Name</label>
                            <input type="text" 
                            id="lname" 
                            name="lastname" 
                            placeholder="Your last name..."
                            required
                            className="form-control"
                            value={this.state.lastName}
                            onChange={this.onChangeLastName}></input>

                            <label htmlFor="email">E-mail</label>
                            <input type="email" 
                            id="email" 
                            name="email" 
                            placeholder="Your e-mail..."
                            required
                            className="form-control"
                            value={this.state.email}
                            onChange={this.onChangeEmail}></input>

                            <label htmlFor="message">What do you need to share?</label>
                            <textarea id="message" 
                            name="message" 
                            placeholder="Write your message here..."
                            required
                            className="form-control"
                            value={this.state.message}
                            onChange={this.onChangeMessage}></textarea>

                            <button type="submit" style={{marginTop: "20px"}}>{buttonText}</button>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
        );      
    }
}

export default ContactUs;