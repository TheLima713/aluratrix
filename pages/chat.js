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

export default function ChatPage() {
  const [message, setMsg] = React.useState({text:"",edit:0});
  const [msgList, setMsgList] = React.useState([]);

  // Sua lógica vai aqui

  //USER
  //usuario digita message em textarea
  //usuario aperta enter
  //adicionar texto em uma lista

  //DEV
  // [ ] useState dentro de um onChange, com if() para checar pelo Enter
  // [ ] quando apertarem Enter, adicionar message a uma lista, limpar campo

  // ./Sua lógica vai aqui

  function handleNewMsg(newMsg) {
    const mensagem = {
      id: msgList.length + 1,
      from: "TheLima713",
      text: newMsg,
    };
    setMsg({text:"",edit:0});
    setMsgList([mensagem, ...msgList]);
  }

  function deleteMsg(delMsg) {
    setMsgList(msgList.filter(msgList.id != delMsg.id));
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
          <MessageList mensagens={msgList} setMsgList={setMsgList} setMsg={setMsg}/>
          {/*msgList.map((msgAtual)=>{
              return(
                  <li key={msgAtual.id}>
                      {msgAtual.from}: {msgAtual.text}
                  </li>
              )
          })*/}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={message.text}
              onChange={(event) => {
                setMsg({text:event.target.value,edit:message.edit});
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();   
                    if(message.edit!=0){
                      setMsgList(msgList.map((editMsg)=>{
                          if(editMsg.id==message.edit){
                              console.log("Editing message [" + editMsg.id + "]" + editMsg.text + " to message " + message.text)
                              const msg = {
                                id: editMsg.id,
                                from: editMsg.from,
                                text: message.text,
                              };
                              return msg;
                          }
                          else{
                              return editMsg;
                          }
                      }))
                      setMsg({text:"",edit:0});
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
                  if (message.text) {
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
        overflow: "scroll",
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
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${msgAtual.from}.png`}
              />
              <Text tag="strong">{msgAtual.from}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              {/*
              <Icon
                name="FaPencilAlt"  styleSheet={{
                    marginLeft: '15px',
                    width: '15px',
                    height: '15px',
                    color: appConfig.theme.colors.neutrals['000'],
                    hover: {
                        color: appConfig.theme.colors.primary['200'],
                    },
                    display:'flex',
                    alignItems: 'center'
                }}
                onClick={()=>{
                    props.setMsg({text:msgAtual.text,edit:msgAtual.id});
                }}
              />
              <Icon
                name="FaTrash"  styleSheet={{
                    marginLeft: '15px',
                    width: '15px',
                    height: '15px',
                    color: appConfig.theme.colors.neutrals['000'],
                    hover: {
                        color: appConfig.theme.colors.primary['200'],
                    },
                    display: 'flex',
                    alignItems: 'center'
                }}
                onClick={() => {
                    props.setMsgList(props.mensagens.filter((msg)=>{
                        return msg.id!==msgAtual.id
                    }))
                }}
            />
            */}
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
                    props.setMsgList(props.mensagens.filter((msg)=>{
                        return msg.id!==msgAtual.id
                    }))
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
