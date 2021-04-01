import React from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useHistory } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const dispatch = useDispatch();
    let history = useHistory();

    const loggedIn = useSelector(state => state.loggedIn)
    const name = useSelector(state => state.name)

    const loginButtonHandler = () => {
        dispatch({ type: 'set', current_action: 'login' })
        history.push("/api/users")
    }

    const logoutButtonHandler = () => {
        dispatch({ type: 'set', loggedIn: false, authToken: null, userId: null, name: null, email: null, expiryTime: null })
        localStorage.removeItem('userData');
        history.push("/")
    }

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#">Places & Users</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link><NavLink to="/" className="NavLink_custom"> Home</NavLink></Nav.Link>
                <Nav.Link><NavLink to="/api/places" className="NavLink_custom">Places</NavLink></Nav.Link>
                <Nav.Link><NavLink to="/api/users" className="NavLink_custom">Users</NavLink></Nav.Link>
                {/* <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="api/places">Places</Nav.Link>
                <Nav.Link href="api/users">Users</Nav.Link> */}
            </Nav>
            <Form inline>
                {/* <FormControl type="text" placeholder="Search" className="mr-sm-2" disabled="true" /> */}
                {loggedIn ? <h5 style={{color: 'white', marginRight: '10px'}}>{name}</h5> : null }
                {loggedIn ? 
                <Button variant="outline-info" onClick={logoutButtonHandler}>Logout</Button> :
                <Button variant="outline-info" onClick={loginButtonHandler}>Login</Button>
                } 
            </Form>
        </Navbar>
    )
}

export default Header;