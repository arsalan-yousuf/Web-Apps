import React, {useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
// import Header from '../Header/Header';
import {
    Container,
    Row,
    Col,
    Card,
    Button
} from 'react-bootstrap';
import './Body.css';

const Body = () => {
    let history = useHistory();
    const dispatch = useDispatch()
    // const userData = useSelector(state => state)

    useEffect(() => {
        console.log('Body useEffect')
        dispatch({ type: 'set', current_action: '' })
    }, [])
    
    return (
        <React.Fragment>
            <Container>
                <h4> Places </h4>
                <Row>
                    <Col className="body_cards">
                        <Card className="m-4" style={{ width: '11.5rem', display: 'inline-block' }}>
                            <Card.Img src="https://icon-library.com/images/icon-place/icon-place-12.jpg" />
                            <Card.Body>
                                <Card.Title>
                                    Add
                                </Card.Title>
                                <Card.Text>
                                    Add a new place
                                </Card.Text>
                                <Button onClick={() => {
                                    dispatch({ type: 'set', current_action: 'add_place' })
                                    history.push("api/places")
                                }}>Add Place</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="body_cards">
                        <Card className="m-4" style={{ width: '11.5rem', display: 'inline-block' }}>
                            <Card.Img src="https://icon-library.com/images/icon-place/icon-place-12.jpg" />
                            <Card.Body>
                                <Card.Title>
                                    Get by ID
                                </Card.Title>
                                <Card.Text>
                                    Get place by it's ID
                                </Card.Text>
                                <Button onClick={() => {
                                    dispatch({ type: 'set', current_action: 'get_place_by_id' })
                                    history.push("api/places")
                                }}>Get Place by ID</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="body_cards">
                        <Card className="m-4" style={{ width: '12rem', display: 'inline-block' }}>
                            <Card.Img src="https://icon-library.com/images/icon-place/icon-place-12.jpg" />
                            <Card.Body>
                                <Card.Title>
                                    Get by User
                                </Card.Title>
                                <Card.Text>
                                    Get place by user ID
                                </Card.Text>
                                <Button onClick={() => {
                                    dispatch({ type: 'set', current_action: 'get_place_by_user_id' })
                                    history.push("api/places")
                                }}>Get Place by User</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="body_cards">
                        <Card className="m-4" style={{ width: '11.5rem', display: 'inline-block' }}>
                            <Card.Img src="https://icon-library.com/images/icon-place/icon-place-12.jpg" />
                            <Card.Body>
                                <Card.Title>
                                    Update Place
                                </Card.Title>
                                <Card.Text>
                                    Update a place
                                </Card.Text>
                                <Button onClick={() => {
                                    dispatch({ type: 'set', current_action: 'update_place' })
                                    history.push("api/places")
                                }} variant="warning">Update Place</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="body_cards">
                        <Card className="m-2" style={{ width: '11.5rem', display: 'inline-block' }}>
                            <Card.Img src="https://icon-library.com/images/icon-place/icon-place-12.jpg" />
                            <Card.Body>
                                <Card.Title>
                                    Delete Place
                                </Card.Title>
                                <Card.Text>
                                    Delete a place
                                </Card.Text>
                                <Button onClick={() => {
                                    dispatch({ type: 'set', current_action: 'delete_place' })
                                    history.push("api/places")
                                }} variant="danger">Delete Place</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <h4> Users </h4>
                <Row>
                    <Col>
                        <Card className="m-4" style={{ width: '12rem', display: 'inline-block' }}>
                            <Card.Img src="https://cdn4.iconfinder.com/data/icons/instagram-ui-twotone/48/Paul-18-512.png" />
                            <Card.Body>
                                <Card.Title>
                                    Add
                                </Card.Title>
                                <Card.Text>
                                    Add a new user
                                </Card.Text>
                                <Button onClick={() => {
                                    dispatch({ type: 'set', current_action: 'signup' })
                                    history.push("api/users")
                                }}>Signup</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="m-4" style={{ width: '12rem', display: 'inline-block' }}>
                            <Card.Img src="https://cdn4.iconfinder.com/data/icons/instagram-ui-twotone/48/Paul-18-512.png" />
                            <Card.Body>
                                <Card.Title>
                                    Login
                                </Card.Title>
                                <Card.Text>
                                    Login a user
                                </Card.Text>
                                <Button onClick={() => {
                                    dispatch({ type: 'set', current_action: 'login' })
                                    history.push("api/users")
                                }} variant="success">Login</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="m-4" style={{ width: '12rem', display: 'inline-block' }}>
                            <Card.Img src="https://cdn4.iconfinder.com/data/icons/instagram-ui-twotone/48/Paul-18-512.png" />
                            <Card.Body>
                                <Card.Title>
                                    View all Users
                                </Card.Title>
                                <Card.Text>
                                    View all users
                                </Card.Text>
                                <Button onClick={() => {
                                    dispatch({ type: 'set', current_action: 'view_all_users' })
                                    history.push("api/users")
                                }} variant="secondary">View Users</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default Body;