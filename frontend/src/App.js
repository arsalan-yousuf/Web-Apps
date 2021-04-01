import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Layout from './containers/Layout';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch, useSelector, connect } from 'react-redux';
// import Body from './containers/Body/Body';
// import UsersList from './components/Users/UsersList';
import Places from './components/Places/Places';
import Users from './components/Users/Users';
// const Places = React.lazy(() => import('./components/Places/Places'));
// const Users = React.lazy(() => import('./components/Users/Users'));

// import {
//   Button,
//   Alert,
//   Breadcrumb,
//   Card,
//   Form,
//   FormGroup,
//   Container,
//   Row,
//   Col
// } from 'react-bootstrap';

let logoutTimer;

const App = (props) => {            
  let history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(props.expiryTime, props.authToken)
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData.token && new Date(userData.expiryTime).getTime() > new Date().getTime()) {
        console.log('token exists')
        dispatch({ type: 'set', loggedIn: true, authToken: userData.token, userId: userData.userId, expiryTime: userData.expiryTime })
      }
    }
    catch (err) {
      console.log(err);
    }
  }, [])

  useEffect(() => {
    if (props.authToken && props.expiryTime) {
      let remTime = new Date(props.expiryTime).getTime() - new Date().getTime();
      // console.log(new Date(props.expiryTime).getTime())
      // console.log(new Date().getTime())
      logoutTimer = setTimeout(() => {
        dispatch({ type: 'set', loggedIn: false, authToken: null, userId: null, name: null, email: null, expiryTime: null })
        localStorage.removeItem('userData');
        history.push("/")
      }, remTime)
    }
    else {
      clearTimeout(logoutTimer)
    }
  }, [props.expiryTime, props.authToken])
  return (
    <div className="App">
      <Switch>
        <Route exact path="/api/places" name="Places Route" render={props => <Places {...props} />} />
        <Route exact path="/api/users" name="Users Route" render={props => <Users {...props} />} />
        <Route path="/" name="Home" render={props => <Layout {...props} />} />
      </Switch>
    </div>
  )
}
// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <Switch>
//           <Route exact path="/api/places" name="Places Route" render={props => <Places {...props} />} />
//           <Route exact path="/api/users" name="Users Route" render={props => <Users {...props} />} />
//           <Route path="/" name="Home" render={props => <Layout {...props} />} />
//         </Switch>
//         {/* <Container fluid>
//         <header className="App-header">
//           <Alert>
//             <Breadcrumb>
//               <Breadcrumb.Item>Test 1</Breadcrumb.Item>
//               <Breadcrumb.Item>Test 2</Breadcrumb.Item>
//               <Breadcrumb.Item active>Test 3</Breadcrumb.Item>
//             </Breadcrumb>
//           </Alert>
//         </header>
//         <Alert variant="primary">This is a button</Alert>
//           <Row>
//             <Col md>
//               <Card className="m-4" style={{ width: '20rem', display: 'inline-block' }}>
//                 <Card.Img src="https://picsum.photos/300" />
//                 <Card.Body>
//                   <Card.Title>
//                     Example Card
//                   </Card.Title>
//                   <Card.Text>
//                     This is an example of react bootstarp cards
//                   </Card.Text>
//                   <Button>Card Button</Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md>
//               <Card className="m-4" style={{ width: '20rem', display: 'inline-block' }}>
//                 <Card.Title>Login</Card.Title>
//                 <Card.Body>
//                   <FormGroup controlId="forEmail">
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control type="email" placeholder="example@email.com" />
//                   </FormGroup>
//                   <FormGroup controlId="forPassword">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control type="password" placeholder="Password" />
//                   </FormGroup>
//                    <Form.Text>Your information will not be shared</Form.Text> */}
//         {/* <Button variant="success" type="submit">Login</Button>
//                 </Card.Body>
//               </Card >
//             </Col >
//           </Row >
//         </Container > */}

//       </div >
//     );
//   }
// }

function mapStateToProps(state, ownProps) {
  return {
    expiryTime: state.expiryTime,
    authToken: state.authToken
  };
}

export default connect(mapStateToProps)(App);
