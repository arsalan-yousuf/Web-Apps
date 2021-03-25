import React from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, Route, withRouter } from 'react-router-dom';
import './Header.css'

const Header = () => {
    const dispatch = useDispatch();

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
                <FormControl type="text" placeholder="Search" className="mr-sm-2" disabled="true" />
                <Button variant="outline-info">Login</Button>
            </Form>
        </Navbar>
    )
}

export default Header;