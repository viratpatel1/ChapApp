import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from "../image/noavatar.jpg";
import "../CSS/ChatOnline.css";



const Local = `http://localhost:4000/`;

const ChatOnline = ({ userlist, onlineUsers, currentId, setCurrentChat }) =>
{
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() =>
    {
        const getUser = async () =>
        {
            try
            {
                const res = await axios.get(`${Local}req/`)
                setFriends(res.data);
                // console.log(friends)
            }
            catch (error)
            {
                console.log(error)
            }
        }
        getUser();
    }, [friends])

    // useEffect(() =>
    // {
    //     setOnlineFriends(friends.filter(m => onlineUsers.includes(m._id)))
    // }, [onlineUsers, friends])

    // console.log("OU ", onlineUsers)

    const handleClick = async (user) =>
    {
        try
        {
            const res = await axios.get(`${Local}conversation/find/${currentId}/${user._id}`)
            setCurrentChat(res.data);

            // console.log("res ", res.data);

            if (!res.data)
            {
                const news = await axios.post(`${Local}conversation/`, { senderId: currentId, receiverId: user._id })
                    .then((res) => console.log("New User Added ", res))
                    .catch((err) => console.log("err ", err));
                // console.log("news ", news);
            }
        } catch (error)
        {
            console.log(error)
        }
    }
    // console.log("ul ",userlist)

    return (
        <div className="ChatOnline">
            {friends.map((o) =>
            {
                return (
                    <>

                        {(o._id != currentId) ? (<>
                            <div className="ChatOnlineFriend" onClick={() => handleClick(o)}>
                                <div className="ChatOnlineImgContainer" >
                                    <img className="ChatOnlineImg" src={o?.profilepic ? o.profilepic : Avatar} alt="Img" />
                                    <div className="ChatOnlineBadge">
                                        <span className="ChatOnlineName">
                                            {o._id != currentId ? o.username : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>) : ""}
                    </>
                )
            }
            )}
        </div>
    )
}

export default ChatOnline
