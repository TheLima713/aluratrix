import {
  Box,
  Text,
  TextField,
  Image,
  Button,
  Icon,
} from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4MzMwOCwiZXhwIjoxOTU4ODU5MzA4fQ.KSQ2JTLdQkr_iAt62p_njCWvFi88NnG4OGrEbqvZXYQ";
const SUPABASE_URL = "https://cdgumxhojlmimopqulxf.supabase.co";
const supabaseClient = createClient(SUPABASE_URL,SUPABASE_ANON_KEY);

//TODO make username global DONE!
//TODO use supabase's created_at to display time and date DONE!
//TODO fix date to show today and or yesterday DONE!
//TODO make loading screen
//TODO make mouseover with profile for user and use database for info
//TODO make edit work with database DONE!
//TODO make delete work with database DONE!


export default function ChatPage() {
  //const username = "TheLima713";
  const [message, setMsg] = React.useState({text:"",edit:0});
  const [msgList, setMsgList] = React.useState([]);

  const router = useRouter();
  const { username } = router.query

  React.useEffect(()=>{
    supabaseClient
    .from("messages")
    .select("*")
    .order("id",{ascending:false})
    .then(({data})=>{
      console.log("Initial select: " + data);
      setMsgList(data);
    })  
  },[])

  //FUNCTIONS

  function writeDate(time){
    const day = new Date().getDate();
    const dayDiff = day - parseInt(time.substring(8,10));
    var date = "";
    switch(dayDiff){
      case 0:
        date = "Hoje, " + time.substring(11,16)
        break;
      case 1:
        date = "Ontem, " + time.substring(11,16)
          break;
      default:
        date = time.substring(8,10)+ "/" + time.substring(5,7) + "/" + time.substring(0,4)

    }
    return date;
  }
  function mouseOver(msgAtual){
    console.log("Mouse over " + msgAtual.from)
  }
  function handleNewMsg(newMsg) {
    const mensagem = {
      from: username,
      text: newMsg
    };

    
    supabaseClient
      .from("messages")
      .insert([mensagem])
      .then(({data})=>{
        console.log("Performed insert: ",data);
        setMsgList([data[0], ...msgList]);
      })
      
      supabaseClient
      .from("messages")
      .select("*")
      .order("id",{ascending:false})
      .then(({data})=>{
        console.log("Initial select: " + data);
        setMsgList(data);
      })  

    setMsg({text:"",edit:0});
  }
  function editMsg(eMsg){
    setMsgList(msgList.map((editMsg)=>{
        if(editMsg.id==eMsg.edit){
            editMsg.text = eMsg.text;
            return editMsg;
        }
        else{
            return editMsg;
        }
    }));
    supabaseClient
      .from("messages")
      .update({text:eMsg.text})
      .match({id:eMsg.edit})
      .then(({data})=>{
        console.log("Performed update: ",data);
      });
    setMsg({text:"",edit:0});
  }
  function deleteMsg(delMsg) {
    supabaseClient
      .from("messages")
      .delete()
      .match({id:delMsg.id})
      .then(({data})=>{
        console.log("Performed delete: ",data);
      });
      setMsgList(msgList.filter((msgAtual)=>{
        return msgAtual.id != delMsg.id
      }));
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList 
            mensagens={msgList} 
            setMsgList={setMsgList} 
            deleteMsg={deleteMsg} 
            setMsg={setMsg} 
            mouseOver={mouseOver}
            writeDate={writeDate}
            />
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
          <Image
            styleSheet={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "inline-block",
              marginRight: "8px",
            }}
            src={`https://github.com/${username}.png`}
          />
            <TextField
              value={message.text}
              onChange={(event) => {
                setMsg({text:event.target.value,edit:message.edit});
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();   
                    if(message.edit!=0){
                      editMsg(message);
                    }
                    else{   
                        handleNewMsg(message.text);
                    }
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
              iconName="arrowRight"
              onClick={() => {
                { 
                  if(message.edit!=0){
                    editMsg(message);
                  }
                  else{   
                      handleNewMsg(message.text);
                  }
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((msgAtual) => {
          return (
          <Text
            key={msgAtual.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
            <Image
              onMouseOver={()=>{
                props.mouseOver(msgAtual);
              }}
              styleSheet={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "inline-block",
                marginRight: "8px",
              }}
              src={`https://github.com/${msgAtual.from}.png`}
            />
              <Text tag="strong">{msgAtual.from}</Text>
              <Text
                styleSheet={{
                  fontSize: "15px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
              {props.writeDate(msgAtual.created_at)}
              </Text>
              <Button
                onClick={()=>{
                    props.setMsg({text:msgAtual.text,edit:msgAtual.id});
                }}
                variant="tertiary"
                iconName="FaPencilAlt"
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals["000"],
                  mainColor: appConfig.theme.colors.neutrals[300],
                  mainColorLight: appConfig.theme.colors.neutrals[500],
                  mainColorStrong: appConfig.theme.colors.neutrals[500],
                }}
              />
              <Button
                onClick={() => {
                    props.deleteMsg(msgAtual);
                }}
                variant="tertiary"
                iconName="FaTrash"
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals["000"],
                  mainColor: appConfig.theme.colors.neutrals[300],
                  mainColorLight: appConfig.theme.colors.neutrals[500],
                  mainColorStrong: appConfig.theme.colors.neutrals[500],
                }}
              />
            </Box>
            {msgAtual.text}
          </Text>
        );
      })}
    </Box>
  );
}
