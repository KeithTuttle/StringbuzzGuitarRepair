import React from 'react';
import { Redirect } from 'react-router-dom';
import userStore from '../store/UserStore';
import * as UserActions from '../store/actions/userActions';
import axios from 'axios';
import { User } from '../viewModels/UserWithErrorMessage';
import { Button, Card, Modal } from 'react-bootstrap';
import AddInstrumentModal from './add-instrument-modal.component';
import { Instrument } from '../viewModels/InstrumentWithErrorMessage';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';

interface IProps {

}

// defines the type of the state
interface InstrumentViewState {
    email: string | undefined;
    modalShow: boolean;
    instruments: Instrument[];
    dataLoaded: boolean;
    showDeleteModal: boolean;
}

export default class ViewInstrument extends React.Component<IProps, InstrumentViewState> {
    constructor(props: IProps) {
        super(props);
        this.setModalShow = this.setModalShow.bind(this);
        this.getUsersInstruments = this.getUsersInstruments.bind(this);
        this.deleteUsersInstrument = this.deleteUsersInstrument.bind(this);
        this.state = {
            email: userStore.getUser()?.email,
            modalShow: false,
            instruments: [],
            dataLoaded: false,
            showDeleteModal: false
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
        this.getUsersInstruments();
    }

    getUsersInstruments(){
        console.log("getting user instruments")
        var path="";
        if(process.env.NODE_ENV === "development"){ path = "http://localhost:5000"}
        var email = userStore.getUser()?.email;
        if (email === "" || email === undefined){
            var localStorageEmail = localStorage.getItem("user") ?? "";
            email = localStorageEmail;
        }
        axios.get<Instrument[]>(`${path}/instrument/get/${email}`)
            .then(result => {
                this.setState({
                    instruments: result.data,
                    dataLoaded: true
                });
                console.log(result);
            })
        .catch(err => console.log(err));
    }

    deleteUsersInstrument(serialNum: string){
        const MySwal = withReactContent(Swal);
        var path="";
        if(process.env.NODE_ENV === "development"){ path = "http://localhost:5000"}
        MySwal.fire({
            title: <p>Are You sure?</p>,
            confirmButtonText:"Delete",
            html:<p>Are you sure you want to delete this instrument?</p>,
            showCancelButton: true,
            icon:"warning"
        }).then(function (input: any) {
            var dismissed = input.isDismissed;
            if(input.isDismissed){
                return;
            }
            axios.delete<Instrument>(`${path}/instrument/delete/${serialNum}`)
            .then(result => {
                // this.setState({
                //     instruments: this.state.instruments.filter(x => x.serialNum !== serialNum)
                // });
                return MySwal.fire(<p>Instrument Deleted</p>,<span>You have successfully deleted your instrument from the shop!</span>, "success").then(() => {
                    window.location.reload();
                })
            })
            .catch(err => console.log(err));
        })
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

    setModalShow(show: boolean){
        this.setState({
            modalShow: show
        });
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
        else if (!this.state.dataLoaded || this.state.instruments.length === 0) {
            var email = localStorage.getItem("user");
            if(email != null && userStore.getUser() == null){
                this.getUserFromLocalStorage(email);
            }
            return (
                <div className="container">
                    <div style={{marginBottom: 15}} className="row justify-content-end">
                        <div className="col-2">
                            {/* Button Trigger Modal */}
                            <Button className="btn sbButton" onClick={() => {return this.setModalShow(true);}}>
                                Add Instrument
                            </Button>

                            <AddInstrumentModal
                                show={this.state.modalShow}
                                onHide={() => {
                                    return this.setModalShow(false);
                                }}
                            /> 
                        </div>
                    </div>
                </div>
            );
        }
        else if (this.state.dataLoaded) {
            var email = localStorage.getItem("user");
            if(email != null && userStore.getUser() == null){
                this.getUserFromLocalStorage(email);
            }
            return (
                <div className="container">
                    <div style={{marginBottom: 15}} className="row justify-content-end">
                        <div className="col-2">
                            {/* Button Trigger Modal */}
                            <Button className="btn sbButton" onClick={() => {return this.setModalShow(true);}}>
                                Add Instrument
                            </Button>

                            <AddInstrumentModal
                                show={this.state.modalShow}
                                onHide={() => {
                                    return this.setModalShow(false);
                                }}
                            /> 
                        </div>
                    </div>
                    <div className="row">
                        {this.state.instruments.map((inst) => (
                            <div key={inst.serialNum} style={{marginBottom: 15}} className="col">
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={"images/"+inst.image.filename} />
                                <Card.Body>
                                    <Card.Title>{inst.instrumentModel}</Card.Title>
                                    <Card.Text>
                                    <span><b>Type:</b> {inst.type}</span><br></br>
                                    <span><b>Color:</b> {inst.color}</span><br></br>
                                    <span><b>Year:</b> {inst.year}</span><br></br>
                                    <span><b>Has Case:</b> {inst.hasCase.toString()}</span><br></br>
                                    <span><b>Serial Number:</b> {inst.serialNum}</span><br></br>
                                    <span><b>Owner Email:</b> {inst.user}</span><br></br>
                                    </Card.Text>
                                    <Button variant="danger" onClick={() => {this.deleteUsersInstrument(inst.serialNum);}}>Delete</Button>
                                </Card.Body>
                            </Card>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    }
}