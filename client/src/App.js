import
{
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import './App.css';
import Login from './Componends/Login';
import Messenger from './Componends/Messenger';
import Signup from './Componends/Signup';
import Navbar from "./Componends/Navbar";

function App()
{
  const history = useHistory();
  const UserName = localStorage.getItem("UserData");
  // console.log("U ", UserName)


  return (
    <div className="Messenger">
      {/* {UserName ? (<Navbar />) : ""} */}
      <Router>
        <Switch>
          {/* <Route exact path="/" component={Login} /> */}
          <Route exact path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/" component={Messenger} />
          {/* <Route/> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
