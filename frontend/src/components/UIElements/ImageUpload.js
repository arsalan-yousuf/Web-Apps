import React, {useState, useRef, useEffect} from 'react';
import {
    Form,
    Container,
    Row,
    Col,
    Image
} from 'react-bootstrap'

const ImageUpload = (props) => {
    const imgRef = useRef();
    const [imgURL, set_imgURL] = useState();

    useEffect(() => {

    },[imgURL])

    const imageChangeHandler = (event) => {
        if(event.target.files && event.target.files.length === 1){
            console.log(event.target.files[0]);
            const fileReader = new FileReader();
            fileReader.onload = () => {
                set_imgURL(fileReader.result);
                props.onInput(fileReader.result);
            };
            fileReader.readAsDataURL(event.target.files[0]);
        }
    }
    return (
        <React.Fragment>
            <Form.Group>
                <Form.File id="exampleFormControlFile1" label="Upload Image"  onChange={(event) => imageChangeHandler(event)} accept=".jpg,.png,.jpeg"/>
            </Form.Group>
            <Container>
                <Row>
                    <Col xs={6} md={4}>
                        <Image ref={imgRef} src={imgURL} rounded alt="Preview" width="150px"/>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default ImageUpload;