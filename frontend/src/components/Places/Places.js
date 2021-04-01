import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Spinner from '../UIElements/LoadingSpinner';
import Modal from '../UIElements/ErrorModal';
import Header from '../../containers/Header/Header';
import ImageUpload from '../UIElements/ImageUpload';

import {
    Form,
    Button,
    Container,
    Card,
    Dropdown
} from 'react-bootstrap';

// const Spinner = React.lazy(() => import('../UIElements/LoadingSpinner'));
// const Modal = React.lazy(() => import('../UIElements/ErrorModal'));

const Places = (props) => {
    const history = useHistory()

    const [isFormValid, set_isFormValid] = useState(true)
    const [loading, set_loading] = useState(false);
    const [error, set_error] = useState();
    const [usersList, set_usersList] = useState([]);
    const [imgURL, set_imgURL] = useState();

    const current_action = useSelector(state => state.current_action)
    const authToken = useSelector(state => state.authToken);

    const addTitleRef = useRef();
    const addDescRef = useRef();
    const addImageRef = useRef();
    const addCreator = useRef();

    const getByPlaceIdRef = useRef();

    const getByUserIdRef = useRef();

    const updatePlaceIdRef = useRef();
    const updatePlaceTitleRef = useRef();
    const updatePlaceDescRef = useRef();

    const delPlaceIdRef = useRef();

    useEffect(() => {
        if (current_action === 'add_place' && authToken) {
            console.log('abhi maja ayega na biru')
            const getUsers = async () => {
                try {
                    const res = await fetch('http://localhost:5000/api/users/', {
                        headers: {
                            Authorization: 'Bearer ' + authToken
                        }
                    });
                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.message)
                    }
                    let usersArray = [];
                    data.users.map(user => usersArray.push(
                        <option value={user.id}>{user.name}</option>
                    ))
                    set_usersList(usersArray);
                    set_loading(false)
                }
                catch (err) {
                    console.log(err);
                    set_loading(false);
                    set_error(err.message || 'Something went wrong, please try again');
                }
            }
            getUsers();
        }
    }, [imgURL])

    let currentRefs = [];
    const inFormButtonHandler = (...args) => {
        // console.log(addTitleRef.current.value)
        let allValid = false;
        currentRefs = [];
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
                case 'add_place':
                    set_loading(true);
                    try {
                        const formData = new FormData();
                        formData.append('title', currentRefs[0]);
                        formData.append('description', currentRefs[1]);
                        if (imgURL) {
                            formData.append('image', imgURL)
                        }
                        else {
                            throw new Error('Image URL not found')
                        }
                        formData.append('creator', currentRefs[2]);
                        const res = await fetch('http://localhost:5000/api/places', {
                            method: 'POST',
                            headers: {
                                Authorization: 'Bearer ' + authToken
                            },
                            // body: JSON.stringify({
                            //     title: currentRefs[0],
                            //     description: currentRefs[1],
                            //     image: currentRefs[2],
                            //     creator: currentRefs[3],
                            // })
                            body: formData
                        });
                        const data = await res.json();
                        if (!res.ok) {
                            throw new Error(data.message)
                        }
                        console.log(data);
                        set_loading(false)
                        history.push("/");
                    }
                    catch (err) {
                        console.log(err);
                        set_loading(false)
                        set_error(err.message || 'Something went wrong, please try again')
                    }
                    break;
                case 'get_place_by_id':
                    set_loading(true);
                    try {
                        const res = await fetch('http://localhost:5000/api/places/' + currentRefs[0]);
                        const data = await res.json();
                        if (!res.ok) {
                            throw new Error(data.message)
                        }
                        console.log(data);
                        set_loading(false)
                    }
                    catch (err) {
                        console.log(err);
                        set_loading(false)
                        set_error(err.message || 'Something went wrong, please try again')
                    }
                    break;
                case 'get_place_by_user_id':
                    set_loading(true);
                    try {
                        const res = await fetch('http://localhost:5000/api/places/users/' + currentRefs[0], {
                            headers: {
                                Authorization: 'Bearer ' + authToken
                            }
                        });
                        const data = await res.json();
                        if (!res.ok) {
                            throw new Error(data.message)
                        }
                        console.log(data);
                        set_loading(false)
                    }
                    catch (err) {
                        console.log(err);
                        set_loading(false)
                        set_error(err.message || 'Something went wrong, please try again')
                    }
                    break;
                case 'update_place':
                    set_loading(true);
                    try {
                        const res = await fetch('http://localhost:5000/api/places/' + currentRefs[0], {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + authToken
                            },
                            body: JSON.stringify({
                                title: currentRefs[1],
                                description: currentRefs[2],
                            })
                        });
                        const data = await res.json();
                        if (!res.ok) {
                            throw new Error(data.message)
                        }
                        console.log(data);
                        set_loading(false);
                        history.push("/");
                    }
                    catch (err) {
                        console.log(err);
                        set_loading(false)
                        set_error(err.message || 'Something went wrong, please try again')
                    }
                    break;
                case 'delete_place':
                    set_loading(true);
                    try {
                        const res = await fetch('http://localhost:5000/api/places/' + currentRefs[0], {
                            method: 'DELETE',
                            headers: {
                                Authorization: 'Bearer ' + authToken
                            }
                        });
                        const data = await res.json();
                        if (!res.ok) {
                            throw new Error(data.message)
                        }
                        console.log(data);
                        set_loading(false);
                        history.push("/");
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
        console.log(image);
        if (image.length !== 0) {
            set_imgURL(image);
        }
    };

    let place_form;
    switch (current_action) {
        case 'add_place':
            let example = "addplace case";
            let [placeInputs, set_placeInputs] = useState({
                title: '',
                desc: '',
                imageURL: '',
                creator: ''
            });
            // 
            // console.log(usersList);
            place_form = <Card.Body>
                <Card.Title>
                    Add Place
                </Card.Title>
                <Form onSubmit={(event) => { formSubmitHandler(event) }}>
                    <Form.Group controlId="forTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control ref={addTitleRef} type="text" placeholder="Place Title" required />
                    </Form.Group>

                    <Form.Group controlId="forDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control ref={addDescRef} as="textarea" rows={3} placeholder="Place Description" required />
                    </Form.Group>
                    {/* <Form.Group controlId="forImageURL">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control ref={addImageRef} type="url" placeholder="e.g https://exampleimage.jpg" required />
                    </Form.Group> */}
                    <ImageUpload onInput={imageInputHandler} />
                    <Form.Group controlId="forCreator">
                        <Form.Label>Creator</Form.Label>
                        <Form.Control ref={addCreator} as="select" defaultValue="Select Creator">
                            <option value="">Select Creator</option>
                            {usersList}
                        </Form.Control>
                    </Form.Group>
                    {/* <img src={imgURL} alt="Image Preview" width="150px"/> */}
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => {
                            inFormButtonHandler(addTitleRef, addDescRef, addCreator);
                        }}>
                        Add Place
                    </Button>
                </Form>
            </Card.Body>
            break;
        case 'get_place_by_id':
            let [idPlaceInputs, set_idPlaceInputs] = useState({
                id: ''
            });
            place_form = <Card.Body>
                <Card.Title>
                    Get Place By It's ID
                </Card.Title>
                <Form onSubmit={(event) => { formSubmitHandler(event) }}>
                    <Form.Group controlId="forPlaceID">
                        <Form.Label>Place ID</Form.Label>
                        <Form.Control ref={getByPlaceIdRef} type="text" placeholder="Place ID" required />
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => {
                            inFormButtonHandler(getByPlaceIdRef);
                        }}>
                        Fetch Place
                    </Button>
                </Form>
            </Card.Body>
            break;
        case 'get_place_by_user_id':
            let [userPlaceInputs, set_userPlaceInputs] = useState({
                userid: ''
            });
            place_form = <Card.Body>
                <Card.Title>
                    Get Place(s) By User ID
                </Card.Title>
                <Form onSubmit={(event) => { formSubmitHandler(event) }}>
                    <Form.Group controlId="forUserID">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control ref={getByUserIdRef} type="text" placeholder="User ID" required />
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => {
                            inFormButtonHandler(getByUserIdRef);
                        }}>
                        Fetch Place
                    </Button>
                </Form>
            </Card.Body>
            break;
        case 'update_place':
            let [updatePlaceInputs, set_updatePlaceInputs] = useState({
                id: '',
                title: '',
                desc: ''
            });
            place_form = <Card.Body>
                <Card.Title>
                    Update Place
                </Card.Title>
                <Form onSubmit={(event) => { formSubmitHandler(event) }}>
                    <Form.Group controlId="forPlaceID">
                        <Form.Label>Place ID</Form.Label>
                        <Form.Control ref={updatePlaceIdRef} type="text" placeholder="Place ID" required />
                    </Form.Group>
                    <Form.Group controlId="forTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control ref={updatePlaceTitleRef} type="text" placeholder="Place Title" required />
                    </Form.Group>
                    <Form.Group controlId="forDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control ref={updatePlaceDescRef} as="textarea" rows={3} placeholder="Place Description" required />
                    </Form.Group>
                    <Button
                        variant="warning"
                        type="submit"
                        onClick={() => {
                            inFormButtonHandler(updatePlaceIdRef, updatePlaceTitleRef, updatePlaceDescRef);
                        }}>
                        Update Place
                    </Button>
                </Form>
            </Card.Body>
            break;
        case 'delete_place':
            let [delPlaceInputs, set_delPlaceInputs] = useState({
                id: ''
            });
            place_form = <Card.Body>
                <Card.Title>
                    Delete Place By It's ID
                </Card.Title>
                <Form onSubmit={(event) => { formSubmitHandler(event) }}>
                    <Form.Group controlId="forPlaceID">
                        <Form.Label>Place ID</Form.Label>
                        <Form.Control ref={delPlaceIdRef} type="text" placeholder="Place ID" required />
                    </Form.Group>
                    <Button
                        variant="danger"
                        type="submit"
                        onClick={() => {
                            inFormButtonHandler(delPlaceIdRef);
                        }}>
                        Delete Place
                    </Button>
                </Form>
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
                    {place_form}
                    {loading ? <Spinner asOverlay /> : null}
                </Card>
            </Container>
            {/* <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form> */}

        </React.Fragment>
    )
}

export default Places;