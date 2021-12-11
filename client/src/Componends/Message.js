import React from 'react';
import "../CSS/Message.css";
import { format } from "timeago.js";

const Message = ({ message, own, user }) =>
{
    // console.log("user ", user)
    return (
        <div className={own ? "Message own" : "Message"}>
            <div className="MessageTop">
                {/* <img className="MessageImg" src="../image/Super30.jpg" alt="" /> */}
                {user.map((data) =>
                {
                    return (
                        <>
                            {(data._id === message.sender) ? (<p className='MessageImg'>{data.username}</p>) : ""}
                        </>
                    )
                }
                )}
                <p className="MessageText">{(message.text) ? message.text : "Empty Text"}</p>
            </div>

            <div className="MessageBottom">{format(message.createdAt)}</div>
        </div>
    )
}

export default Message;
