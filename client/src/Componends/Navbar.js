import React, { useEffect } from 'react';
import * as ReactBootStrap from "react-bootstrap";
import { useHistory, withRouter } from 'react-router-dom';
import "../CSS/Navbar.css";

const Navbar = () =>
{
    let history = useHistory();
    const UserName = localStorage.getItem("UserData");
    const User = JSON.parse(UserName)
    // console.log("U ",User)

    const Check = () =>
    {
        localStorage.removeItem("UserData");
        localStorage.removeItem("token");
        history.push("/login")
    }


    return (
        <div>
            <div className='Navbar'>
                <div className='Tag'>
                    ChapApp
                </div>
                <div className='Box'>
                    <div className='Name'>{User?.username}</div>
                    <div onClick={Check} className='Logout'>Logout</div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
