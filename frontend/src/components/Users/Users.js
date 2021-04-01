import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom';
import Header from '../../containers/Header/Header';
import Spinner from '../UIElements/LoadingSpinner';
import Modal from '../UIElements/ErrorModal';
import UsersTable from './UsersList';
import ImageUpload from '../UIElements/ImageUpload';

import {
    Form,
    Button,
    Container,
    Card,
} from 'react-bootstrap'

// const UsersTable = React.lazy(() => import('./UsersList'));

const Users = (props) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [isFormValid, set_isFormValid] = useState(true)
    const [loading, set_loading] = useState(false);
    const [error, set_error] = useState();
    const [imgURL, set_imgURL] = useState();

    const addUserNameRef = useRef();
    const addUserEmailRef = useRef();
    const addUserPasswordRef = useRef();
    const addUserImageRef = useRef();

    const loginUserEmailRef = useRef();
    const loginUserPasswordRef = useRef();

    let currentRefs = [];
    const inFormButtonHandler = (...args) => {
        let allValid = false;
        currentRefs = [];
        // console.log(addTitleRef.current.value)
        args.map(item => {
            if (item.current.value !== "") {
                currentRefs.push(item.current.value);
                allValid = true;
            }
            else {
                item.current.focus()
                set_isFormValid(allValid)
                return;
            }
        });
        set_isFormValid(allValid)
    }

    const formSubmitHandler = async (event) => {
        if (isFormValid) {
            event.preventDefault();
            switch (current_action) {
                case 'signup':
                    set_loading(true);
                    try {
                        const formData = new FormData();
                        formData.append('name', currentRefs[0]);
                        formData.append('email', currentRefs[1]);
                        formData.append('password', currentRefs[2]);
                        if (imgURL) {
                            formData.append('image', imgURL)
                        }
                        else {
                            throw new Error('Image URL not found')
                        }
                        // console.log(formData.get('email'));
                        const res = await fetch('http://localhost:5000/api/users/signup', {
                            method: 'POST',
                            body: formData
                        });
                        const data = await res.json();
                        if (!res.ok) {
                            throw new Error(data.message)
                        }
                        console.log(data);
                        dispatch({ type: 'set', loggedIn: true, authToken: data.token, name: data.name, email: data.email, userId: data.userId })
                        const expiryTime = new Date(new Date().getTime() + 1000*60*60);
                        localStorage.setItem('userData', JSON.stringify({userId: data.userId, token: data.token, expiryTime: expiryTime.toISOString()}))
                        set_loading(false)
                        history.push("/");
                    }
                    catch (err) {
                        console.log(err);
                        set_loading(false)
                        set_error(err.message || 'Something went wrong, please try again')
                    }
                    break;
                case 'login':
                    set_loading(true);
                    try {
                        const loginData = new FormData();
                        loginData.append('email', currentRefs[0]);
                        loginData.append('password', currentRefs[1]);
                        console.log(currentRefs);
                        // console.log(loginData.get('email'));
                        const res = await fetch('http://localhost:5000/api/users/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: currentRefs[0],
                                password: currentRefs[1]
                            })
                            // body: loginData
                            
                        });
                        const data = await res.json();
                        if (!res.ok) {
                            throw new Error(data.message)
                        }
                        console.log(data);
                        const expiryTime = new Date(new Date().getTime() + 60*60000);
                        // const isoTime = expiryTime.toISOString();
                        // const isoCurr = new Date().toISOString();
                        // console.log( new Date(), 'Current: ', new Date().toISOString(), 'Exp: ', expiryTime.toISOString());
                        // console.log('Current: ', new Date(isoCurr), 'Exp: ', new Date(isoTime))
                        dispatch({ type: 'set', loggedIn: true, authToken: data.token, name: data.name, email: data.email, userId: data.userId, expiryTime: expiryTime })
                        localStorage.setItem('userData', JSON.stringify({userId: data.userId, token: data.token, expiryTime: expiryTime.toISOString()}))
                        set_loading(false)
                        history.push("/")
                    }
                    catch (err) {
                        console.log(err);
                        set_loading(false)
                        set_error(err.message || 'Something went wrong, please try again')
                    }
                    break;
                default:
            }
        }
        else {
            return
        }
    }

    const errorHandler = () => {
        set_error(null);
    };

    const imageInputHandler = (image) => {
        if (image.length !== 0) {
            set_imgURL(image);
        }
    };

    const current_action = useSelector(state => state.current_action)
    let user_form;
    switch (current_action) {
        case 'signup':
            user_form = <Card.Body>
                <Card.Title>
                    Signup
                </Card.Title>
                <Form onSubmit={(event) => { formSubmitHandler(event) }}>
                    <Form.Group controlId="forName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control ref={addUserNameRef} type="text" placeholder="Full Name" required />
                    </Form.Group>
                    <Form.Group controlId="forEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control ref={addUserEmailRef} type="email" placeholder="example@example.com" required />
                    </Form.Group>
                    <Form.Group controlId="forPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref={addUserPasswordRef} type="password" placeholder="Password" required />
                    </Form.Group>
                    {/* <Form.Group controlId="forImageURL">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control ref={addUserImageRef} type="url" placeholder="e.g https://exampleimage.jpg" required />
                    </Form.Group> */}
                    <ImageUpload onInput={imageInputHandler} />
                    {/* <img src={imgURL} alt="Image Preview" width="150px" /> */}
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => {
                            inFormButtonHandler(addUserNameRef, addUserEmailRef, addUserPasswordRef);
                        }}>
                        Signup
                    </Button>
                </Form>
            </Card.Body>
            break;
        case 'login':
            user_form = <Card.Body>
                <Card.Title>
                    Login
                </Card.Title>
                <Form onSubmit={(event) => { formSubmitHandler(event) }}>
                    <Form.Group controlId="forEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control ref={loginUserEmailRef} type="email" placeholder="example@example.com" required />
                    </Form.Group>
                    <Form.Group controlId="forPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref={loginUserPasswordRef} type="password" placeholder="Password" required />
                    </Form.Group>
                    <Button
                        variant="success"
                        type="submit"
                        onClick={() => {
                            inFormButtonHandler(loginUserEmailRef, loginUserPasswordRef);
                        }}>
                        Login
                </Button>
                </Form>
            </Card.Body>
            break;
        case 'view_all_users':
            user_form = <Card.Body>
                <Card.Title>
                    All Users
                </Card.Title>
                <UsersTable />
            </Card.Body>
            break;
        default:
    }
    return (
        <React.Fragment>
            <Header />
            <Container style={{ width: '50%' }}>
                <Modal error={error} onClear={errorHandler} />
                <Card className="m-4">
                    {user_form}
                    {loading ? <Spinner asOverlay /> : null}
                </Card>
            </Container>
        </React.Fragment>
    )
}

export default Users;