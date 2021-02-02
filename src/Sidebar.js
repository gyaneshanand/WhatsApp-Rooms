import React, { useState , useEffect} from 'react';
import './Sidebar.css';
import { Avatar,IconButton  } from "@material-ui/core";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import SideBarChat from './SideBarChat';
import db from './firebase';
import { useStateValue } from './StateProvider';

function Sidebar() {

    const [rooms,setRooms] = useState([]);
    const [{user} , dispatch] = useStateValue();

    useEffect( () => {
        //To update the Chat Rooms in the Side Bar Chat
        const unsubscribe = db.collection("rooms").onSnapshot((snapshot)=>{
            setRooms(snapshot.docs.map(
                doc => (
                    {
                        id : doc.id,
                        data : doc.data(),
                    }
                )
            ));
        });
        return () => {
            unsubscribe();
        }

    },[]);

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user?.photoURL}/>
                
                <div className="sidebar__headerRight">

                    <IconButton>
                        <DonutLargeIcon/>
                    </IconButton>

                    <IconButton>
                        <ChatIcon/>
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </div>

            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlinedIcon/>
                    <input placeholder="Search or Start new chat" type="text"/>
                </div>

            </div>
            <div className="sidebar__chats">
                <SideBarChat addNewChat/>
                {rooms.map(room => (
                    <SideBarChat key={room.id} id={room.id} name={room.data.name} />
                ))}
            </div>

            
        </div>
    )
}

export default Sidebar
