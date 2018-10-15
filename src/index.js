import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Route, Switch, Router } from "react-router-dom";
import './index.css';
import * as serviceWorker from './serviceWorker';
import indexRoutes from "./Routes/index.jsx";
import User from './Components/User.jsx';

const hist = createBrowserHistory();

ReactDOM.render(
<Router history={hist}>
  <Switch>
      {indexRoutes.map((prop, key) => {
        return <Route path={prop.path} component={prop.component} key={key} />;
      })}
  </Switch>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
