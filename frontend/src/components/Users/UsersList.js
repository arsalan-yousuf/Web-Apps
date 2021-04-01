import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
// import Header from '../../containers/Header/Header';
// import Spinner from '../UIElements/LoadingSpinner';
// import Modal from '../UIElements/ErrorModal';
import {
    Table,
    thead,
    tbody,
    tr,
    td,
    th
} from 'react-bootstrap';

const UsersList = () => {
    const [loading, set_loading] = useState(false);
    const [error, set_error] = useState();
    const [usersList, set_usersList] = useState([]);

    const authToken = useSelector(state => state.authToken);

    useEffect(() => {
        const getUsers = async () => {
            set_loading(true)
            try {
                const res = await fetch('http://localhost:5000/api/users/', {
                    headers:{
                        Authorization : 'Bearer '+authToken
                    }
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message)
                }
                let usersArray = [];
                data.users.map(user => usersArray.push(
                <tr>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                </tr>))
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
    }, [])

    // const errorHandler = () => {
    //     set_error(null);
    // };

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {usersList}
            </tbody>
        </Table>
    )
}

export default UsersList;
