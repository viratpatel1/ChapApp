import React, { useEffect, useState } from 'react';
import axios from "axios";
import Avatar from "../image/noavatar.jpg";
import "../CSS/Conversation.css";

const Local = `http://localhost:4000/`;

const Conversation = ({ currentUser, conversation }) =>
{
    const [user, setUser] = useState([])

    const friendId = conversation.members.find(m => m !== currentUser._id)

    useEffect(() =>
    {
        // console.log("currentId ", currentUser._id)
        const getUser = async () =>
        {
            try
            {
                // const res = await axios.get(`${Local}req/`)
                const res = await axios.get(`${Local}req?userId=${friendId}`)

                setUser(res.data);
                // console.log("friendID ", friendId)
            }
            catch (error)
            {
                console.log(error)
            }
        }
        getUser();
    }, [currentUser, conversation])


    // console.log("32 ", user)
    // console.log("32 ", currentUser)
    // console.log("41 ", conversation)
    // console.log("LoginUser ", currentUser._id)
    return (
        <div>
            <div className="Conversation">
                {user.map((data, i) =>
                {
                    return (
                        <>
                            {(data._id === friendId) ? (<>
                                <img className="ConversationImg" src={data?.profilepic ? data.profilepic : Avatar} alt="img" />
                                <span key={data._id} className="ConversationChat">{data.username}</span>
                            </>) : ""}
                            {/* {data._id != currentUser._id ? (< div className="Conversation">
                                <img className="ConversationImg" src={data?.profilepic ? data.profilepic : Avatar} alt="img" />
                                <span key={data._id} className="ConversationChat">{data.username}</span>
                            </div>) : ""} */}
                        </>
                    )
                }
                )}

            </div>
        </div>
    )
}

export default Conversation
