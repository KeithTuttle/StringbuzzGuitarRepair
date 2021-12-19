import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import userStore from '../store/UserStore';
import { Instrument, InstrumentWithErrorMessage} from '../viewModels/InstrumentWithErrorMessage';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';


function AddInstrumentModal(props: any) {
    const [type, setType] = useState('');
    const [model, setModel] = useState('');
    const [image, setImage] = useState<FileList | null>(null);
    const [color, setColor] = useState('');
    const [year, setYear] = useState('');
    const [serialNum, setSerialNum] = useState('');
    const [hasCase, setHasCase] = useState(false);

    const addInstrument = () => {
        //validate input
        const MySwal = withReactContent(Swal);
        if(serialNum === "" || serialNum === undefined){
            return MySwal.fire(<p>Serial Number is required</p>,<span>an instrument must have a serial number</span>, "error");
        }
        if(image === null || image[0] === undefined){
            return MySwal.fire(<p>A picture is required</p>,<span>an instrument must have a picture so we know what it looks like!</span>, "error");
        }
        var instYear = parseInt(year);
        if(isNaN(instYear) || instYear == null || instYear < 1800){
            return MySwal.fire(<p>Must enter a valid year</p>,<span>Make sure you enter a number for the year the instrument was made. If you aren't sure, take your best guess!</span>, "error");
        }
        if(image !== null){
            var path="";
            if(process.env.NODE_ENV === "development"){ path = "http://localhost:5000"}
            var fd = new FormData();
            fd.append("image", image[0]);
            fd.append("type", type);
            fd.append("instrumentModel", model);
            fd.append("year", year);
            fd.append("color", color);
            fd.append("serialNum", serialNum);
            fd.append("hasCase", JSON.stringify(hasCase));
            fd.append("user", userStore.getUser()?.email ?? '');
            axios.post<InstrumentWithErrorMessage>(path+'/instrument/add', fd)
            .then(result => {
                if(result.data.error.includes("already registered")){
                    return MySwal.fire(<p>Instrument Already Registered</p>,<span>{result.data.error}</span>, "error");
                }
                else if(result.data.error == ""){
                    props.onHide();
                    window.location.reload();
                }
            })
            .catch(err => console.log(err));
        }
    }

    const imageChanged = (file: FileList | null) => {
        if (file !== null){
            setImage(file);
        }
    }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add An Instrument
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h4>Instrument Details</h4>
            <Form>
                <Form.Group className="mb-3" controlId="instrumentForm.ControlInput6">
                    <Form.Label>Instrument Picture</Form.Label>
                    <div>
                        <input type="file" accept="image/png, image/jpeg" onChange={ (e) => imageChanged(e.target.files) } />
                    </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="instrumentForm.ControlInput1">
                    <Form.Label>Instrument Type</Form.Label>
                    <Form.Control type="text" placeholder="Guitar, Bass, Mandolin, Banjo, etc..." onChange={e => setType(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="instrumentForm.ControlInput1">
                    <Form.Label>Instrument Model</Form.Label>
                    <Form.Control type="text" placeholder="Fender Strat, Fender Telecaster, Gibson SG, etc..." onChange={e => setModel(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="instrumentForm.ControlInput2">
                    <Form.Label>Instrument Color</Form.Label>
                    <Form.Control type="text" placeholder="Sunburst, Red, Natural, etc..." onChange={e => setColor(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="instrumentForm.ControlInput3">
                    <Form.Label>Year Made</Form.Label>
                    <Form.Control type="number" placeholder="Year Instrument was built" onChange={e => setYear(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="instrumentForm.ControlInput4">
                    <Form.Label>Serial Number</Form.Label>
                    <Form.Control type="text" placeholder="Serial number typically found on back of headstock" onChange={e => setSerialNum(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="instrumentForm.ControlInput5">
                    <Form.Check type="checkbox" label="Check if this instrument has a case" onChange={e => setHasCase(e.target.checked)} />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          <Button onClick={addInstrument}>Add Instrument</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  export default AddInstrumentModal;