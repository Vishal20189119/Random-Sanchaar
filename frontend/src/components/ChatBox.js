import { 
  Box ,
  Text,
  Input,
  Button,

} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import ActualChatBox from './ActualChatBox';
// import {socket} from '../chatlogics.js'
import io from 'socket.io-client'





export default function ChatBox() {
  
  const [chatEnable, setChatEnable] = useState(false);
  const [id, setId] = useState();
 
  console.log(chatEnable);
  

  return (
    <>
    <Text
      textAlign={'center'}
      fontSize={'3xl'}
      m={3}
    >
            Welcome to Random Sanchaar</Text>
    <Box p={5}>
      {chatEnable?<ActualChatBox id={id} socket={io('http://localhost:5000')}/>:(
        <>
          <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'}>
              <Input width={'800px'} minWidth={'300px'} m={2} value={id} onChange={(e)=>setId(e.target.value)} placeholder='Enter the Id to begin the chat'/>
            <Button onClick={()=>setChatEnable(true)} px={10} m={2}>Click to begin the chat</Button>
            
          </Box>
        </>

      )}
    </Box>
    
    </>
  )
}
