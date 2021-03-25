import React from 'react';
import { NavLink, Route, Switch, withRouter } from 'react-router-dom';

import Header from './Header/Header';
import Body from './Body/Body';

const Layout = () => {
    return (
        <React.Fragment>
            <Header />
            <Body/>
        </React.Fragment>
    )
}

export default Layout;