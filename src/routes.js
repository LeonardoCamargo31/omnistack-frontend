import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Main from './pages/Main'
import Box from './pages/Box'
import box from './pages/Box';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/box/:id" component={box} />
        </Switch>
    </BrowserRouter>
)

export default Routes