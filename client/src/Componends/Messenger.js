import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { io } from "socket.io-client";
import "../CSS/Messenger.css";
import ChatOnline from './ChatOnline';
import Conversation from './Conversation';
import Message from './Message';
import Navbar from './Navbar';

// const Local = `http://localhost:4000/`;
const Local = `https://chatsappss.herokuapp.com/`;


const Messenger = () =>
{
    const history = useHistory();
    const [userlist, setUserList] = useState([])
    const [datalist, setDataList] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [user, setUser] = useState([])
    const [toCheck, setToCheck] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef()
    const socket = useRef();

    const fetchtoken = localStorage.getItem("token");
    const UserData = localStorage.getItem("UserData");

    // io.emit("getUsers", users);

    //For Socket.io
    useEffect(() => 
    {

        socket.current = io(Local, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            extraHeaders: {
                "my-custom-header": "abcd"
            }
        });
        socket.current.on("getMessage", data =>
        {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() =>
    {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages(prev => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);


    // All User
    useEffect(() =>
    {
        const getUser = async () =>
        {
            try
            {
                const res = await axios.get(`${Local}req/`)
                // const res = await axios.get(`${\Local}req?userId=${friendId}`)

                setUser(res.data);
            }
            catch (error)
            {
                console.log(error)
            }
        }
        getUser();
    }, [datalist])

    // To check for Login User for socket
    useEffect(() =>
    {
        socket.current.emit("addUser", datalist._id);
        socket.current.on("getUsers", (users) =>
        {
            // console.log("u ", users);
            setOnlineUsers(users)
            // setToCheck(user.map((f, i) => f._id));
            // setOnlineUsers(toCheck.filter((f) => users.some((u) => u.userId === f)))
        })
    }, [datalist, toCheck])

    // console.log("toCheck ", toCheck);
    // console.log("online ", onlineUsers);

    useEffect(() =>
    {
        fetch(`${Local}conversation`)
            .then((res) => res.json())
            .then((result) => setUserList(result))
            .catch((err) => console.log(err));

        setDataList(JSON.parse(UserData))
    }, [setUserList])



    // To Check for Token
    useEffect(() =>
    {
        try
        {
            if ((UserData !== "undefined") && (UserData !== "") && (UserData !== null))
            {
                history.push("/");
            } else
            {
                history.push("/login");
            }
        } catch (error)
        {

        }
    }, [UserData, fetchtoken])


    useEffect(() =>
    {
        const getmessage = async () =>
        {
            try
            {
                const res = await axios.get(`${Local}message/${currentChat?._id}`);
                setMessages(res.data)
            } catch (err)
            {
                console.log(err)
            }
        }
        getmessage();
    }, [currentChat])

    // const Check = async (e) =>
    // {
    //     userlist.map((data, i) =>
    //     {

    //         var find = data.members.forEach(ele =>
    //         {
    //             if (ele === datalist._id)
    //             {
    //                 console.log(ele)
    //             }
    //         })
    //     })
    // }

    const handleSubmit = async (e) =>
    {
        // e.preventDefault()
        const message = {
            sender: datalist._id,
            text: newMessage,
            conversationId: currentChat._id
        };
        const receiverId = currentChat.members.find((mem) => mem !== datalist._id);

        socket.current.emit("sendMessage", { senderId: datalist._id, receiverId, text: newMessage });

        try
        {
            const res = await axios.post(`${Local}message`, message);
            setMessages([...messages, res.data])
            setNewMessage("");
        } catch (err)
        {
            console.log(err)
        }

    }


    //For smooth Scroll After Every Msg
    useEffect(() =>
    {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    // console.log("183 ", messages);
    // console.log("184 ", UserData);
    // console.log("185 ", datalist);
    // console.log("186 ", userlist);
    // console.log("187 ", user);

    return (
        <>
            {UserData ? (<Navbar />) : ""}
            <div className="messenger">
                {/* <div className="chatmenu">
                <div className=" MenuSection">
                    <input placeholder=" Search for Friends" className="chatInput" /> */}
                {/* <Conversation onClick={Check} conversationIds={userlist} currentUser={datalist} /> */}

                {/* {user.map((c, i) => (
                        <div onClick={Check}>
                        <Conversation currentUser={datalist} />
                        </div>
                    ))} */}

                {/* {userlist.map((c, i) => (
                        <div onClick={() => setCurrentChat(c)}>
                            <Conversation conversation={c} currentUser={datalist} />
                        </div>
                    ))} */}
                {/* </div>
            </div> */}
                <div className="chatOnline">
                    <div className="OnlineSection ">
                        <ChatOnline onlineUsers={onlineUsers} currentId={datalist._id} setCurrentChat={setCurrentChat} userlist={userlist} />
                    </div>
                </div>
                <div className="chatBox">
                    {currentChat ? <>
                        <div className="BoxSection">

                            <div className="BoxTop">
                                {messages.map((data) => (
                                    <div ref={scrollRef} >
                                        <Message message={data} own={data.sender === datalist._id} user={user} />
                                    </div>
                                ))}

                            </div>
                        </div>
                        <div className="BoxBottom">
                            <textarea onKeyPress={(event) => event.key === "Enter" ? handleSubmit() : null} onChange={(e) => setNewMessage(e.target.value)} value={newMessage} className="ChatAreaInput" placeholder="Message"></textarea>
                            <button className="ChatSubmit" onClick={handleSubmit}>Send</button>
                        </div>
                    </> : (<><span className="noConversation">Start a Conversation</span> <div className="BoxBottom">
                        <textarea onKeyPress={(event) => event.key === "Enter" ? handleSubmit() : null} onChange={(e) => setNewMessage(e.target.value)} value={newMessage} className="ChatAreaInput" placeholder="Message"></textarea>
                        <button className="ChatSubmit" onClick={handleSubmit}>Send</button>
                    </div></>)}
                </div>

            </div>
        </>
    )
}

export default Messenger
