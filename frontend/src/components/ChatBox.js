import { 
  Box ,
  Text,
  Input,
  Button,

} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import ActualChatBox from './ActualChatBox';
// import {socket} from '../chatlogics.js'






export default function ChatBox() {
  
  const [chatEnable, setChatEnable] = useState(false);
 
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
      {chatEnable?<ActualChatBox/>:(
        <>
          <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'}>
            <Button onClick={()=>setChatEnable(true)} px={10} m={2}>Click to begin the chat</Button>
            
          </Box>
        </>

      )}
    </Box>
    
    </>
  )
}
