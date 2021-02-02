import React, { useRef } from 'react'
import './Chat.css'
import { Avatar,IconButton  } from "@material-ui/core";
import AttachFile from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {useEffect , useState} from 'react'
import { Link, useParams } from "react-router-dom";
import db from './firebase';
import { useStateValue } from './StateProvider';
import firebase from "firebase";
import Picker  , { SKIN_TONE_MEDIUM_LIGHT } from 'emoji-picker-react';
import Linkify from 'react-linkify';

function Chat() {

    const [input , setInput] = useState("");
    const [seed , setSeed] = useState("");
    const {roomId} = useParams();
    const [roomName , setRoomName] = useState("");
    const [messages , setMessages] = useState([]);
    const [{user} , dispatch] = useStateValue();
    const [emoji, setEmoji] = useState(null);

    const addEmoji = (e,emojiObject) => {
        let emoji = e.native;
        setInput(input + emojiObject.emoji);
        console.log(input)
      };

    const checkEmojiClose = () => {
    if (emoji) {
        setEmoji(null);
    }
    };
    
    useEffect(() => {
        // To get random seed to get random avators
        setSeed(Math.floor(Math.random()*5000));
    }, [roomId]);

    useEffect( () => {
        if (roomId) {
            db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
        }//if
    },[roomId]);
   
    const sendMessage = (e) => {
        //Prevent the default behaviour of form submission
        e.preventDefault();
        //Sending the message to db
        db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .add(
                {
                    message : input,
                    name : user.displayName,
                    timestamp : firebase.firestore.FieldValue.serverTimestamp()
                }
            )
        setInput("");
    };

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
        //console.log('called')
    };
    
    useEffect(() => {
        scrollToBottom();
    },[]);

    useEffect(() => {
        scrollToBottom();
    }, [roomName,messages]);

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen{" "}
                        {messages.length !== 0
                        ? messages[messages.length - 1].timestamp
                            ?.toDate()
                            .toUTCString().slice(0, 22)
                        : "will be available after any new message."}
                    </p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body scrollbar-juicy-peach"  onClick={checkEmojiClose}>
                {
                    messages.map((message) => (
                        <p className={`chat__message ${message.name===user.displayName && "chat__reciever"}`}>
                            <span className="chat__name">{message.name}</span>
                            
                            <Linkify properties={{target: "_blank", style: {color: "red",},}}>
                                {message.message}
                            </Linkify>
                            
                            <span className="chat__timestamp">
                                {new Date(message.timestamp?.toDate()).toUTCString().slice(17, 22)}</span>                   
                        </p>
                    )
                    )
                }    
                <div ref={messagesEndRef}></div> 
            </div>

            

            <div className="chat__footer">
                <IconButton>           
                    <InsertEmoticonIcon onClick={() => setEmoji(!emoji)}/>
                    {emoji ? <Picker onEmojiClick={addEmoji} skinTone={SKIN_TONE_MEDIUM_LIGHT} 
                        groupVisibility={{flags: false,}} /> : null } 
                </IconButton>
                <form>
                    <input value={input} onChange={ e => setInput(e.target.value)}  onClick={checkEmojiClose} type="text" placeholder="Type a message"></input>
                    <button type="submit" onClick={sendMessage} >Send a Message</button>
                </form>
                <IconButton>
                    <MicIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Chat
