import { Box, Text, Input, Button } from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import io from 'socket.io-client'
let id = 2;

export default function ActualChatBox() {
  const [content, setContent] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [roomId, setRoomId] = useState();
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const buttonRef = useRef(null);
  const [userLeft, setUserLeft] = useState(false);
  const [both, setBoth] = useState(false);
  const [toggleChat, setToggleChat] = useState(false);
  // const [id, setId] = useState(undefined);
  const socketRef = useRef();
  
  // const [id, setId] = useState();

  const customScrollbarStyle = {
    "&::-webkit-scrollbar": {
      width: "3px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "gray",
    },
    "&::-webkit-scrollbar-track": {
      background: "white",
    },
  };

  useEffect(() => { 
    console.log("Just after the component mounted: ", chatContainerRef);  //This is shwoing chatContainerRef.current to be null don't know why, according to me it should give some values
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    if(both) messageInputRef.current.focus();

  }, [messageList]);
  useEffect(()=>{
    if(both) messageInputRef.current.focus();
  })

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      // The connection is established, and you can now access socket.id
      const socketId = socketRef.current.id;
      id = socketId;
    });
    console.log("Socketid: ", socketRef.current.id)
    console.log("Mounting happening");
    socketRef.current.on("getRoom", (roomId) => setRoomId(roomId));
    socketRef.current.on("message", (message) => {
      console.log("message: ", message);
      setMessageList((prevMessages) => [...prevMessages, message]);
    });
    socketRef.current.on("roomStatus", (data) => {
      console.log(data);
      if(data==="User left") setUserLeft(true);
      socketRef.current.disconnect();
    });
    socketRef.current.on('user count', (count)=>{
      if(count==2) setBoth(true);
      console.log(count);
    })
    
    return () => {
      console.log("Unmounting happening");
      socketRef.current.disconnect();
    };
  }, [toggleChat]);

  const sendMessage = () => {
    if(content==='') return
    socketRef.current.emit("message", { id, roomId, content });
    setContent("");
  };

  const handleKeyPress = (e)=>{
    if(e.key==='Enter' || e.keyCode === 13){
      buttonRef.current.click()
    }
  }
  const handleNewChat = ()=>{
    setToggleChat(!toggleChat);
    setBoth(false);
    setMessageList([]);
    setUserLeft(false);
  }

  return (
    <>
      {both? (
        
        <Box
          display={'flex'}
          flexDirection={'column'}
          // border={'2px solid black'}
          maxWidth={'800px'}
          margin={'auto'}
          height={'80vh'}
          borderLeft={'2px solid grey'}
          borderRight={'2px solid grey'}
          px={3}
        >
          <Box
            height={"100%"}
            // border={'2px solid black'}
            overflowY={"scroll"}
            ref={chatContainerRef}
            css={customScrollbarStyle}
            width={'100%'}
            mb={4}
            // width={{base: '90vw', md: '600px', lg: '800px'}}
          >
            {/* <ScrollableChat messages={messages}/> */}
            {messageList?.map((m, i) => (
              <Box
              // border={'2px solid black'}
                display={"flex"}
                justifyContent={
                  m.id===id ? "flex-end" : "flex-start"
                }
                m={"3px"}
                mx={"10px"}
              >
      

                <Text
                  bgColor={m.id===id ? "#a0dca3" : "#c0daf0"}
                  borderRadius={"50px"}
                  p={2}
                  pl={4}
                  pr={4}
                  borderTopRightRadius={m.id===id ? "0" : "50px"}
                  borderTopLeftRadius={m.id===id ? "50" : "0"}
                  maxWidth={"70%"}
                >
                  {m.content}
                </Text>
              </Box>
            ))}
          </Box>
          {userLeft?(
            <>
              <h1>The other user has left the chat</h1>
              <Button onClick={handleNewChat}>Start New Chat</Button>
            </>
              
            
            ):(
            <Box display={'flex'} width={'100%'}>
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"Write a message"}
                ref={messageInputRef}
                onKeyDown={handleKeyPress}
                mr={2}
              />
              <Button ref={buttonRef} onClick={sendMessage}>Send Message</Button>
            </Box>

          )}

        </Box>
      ): <h1>Connecting to stranger...</h1>}
    </>


  );
}
