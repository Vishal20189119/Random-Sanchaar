import { Box, Text, Input, Button } from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";

export default function ActualChatBox({ id, socket }) {
  const [content, setContent] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [roomId, setRoomId] = useState();
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const buttonRef = useRef(null);
  const [userLeft, setUserLeft] = useState(false);

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
    messageInputRef.current.focus();

  }, [messageList]);

  useEffect(() => {
    console.log("Mounting happening");
    socket.on("getRoom", (roomId) => setRoomId(roomId));

    socket.on("message", (message) => {
      console.log("message: ", message);
      setMessageList((prevMessages) => [...prevMessages, message]);
    });
    socket.on("roomStatus", (data) => {
      console.log(data);
      if(data==="User left") setUserLeft(true);
      socket.disconnect();
    });

    return () => {
      console.log("Unmounting happening");
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if(content==='') return
    socket.emit("message", { id, roomId, content });
    setContent("");
  };

  const handleKeyPress = (e)=>{
    if(e.key==='Enter' || e.keyCode === 13){
      buttonRef.current.click()
    }
  }

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      // border={'2px solid black'}
      maxWidth={'800px'}
      margin={'auto'}
      height={'80vh'}
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
          <Button>Start New Chat</Button>
        </>
          
        
        ):(
        <Box display={'flex'} width={'100%'}>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"Write a message"}
            ref={messageInputRef}
            onKeyDown={handleKeyPress}
          />
          <Button ref={buttonRef} onClick={sendMessage}>Send Message</Button>
        </Box>

      )}

    </Box>
  );
}
