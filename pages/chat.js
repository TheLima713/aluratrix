
import appConfig from "../config.json";
import React from "react";
import { useRouter } from "next/router";
import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import { createClient } from "@supabase/supabase-js";

import { ButtonSendSticker } from "../src/components/ButtonSendSticker";
import { MessageList } from "../src/components/MessageList";
import { ChannelList } from "../src/components/ChannelList";

//TODO make username global DONE!
//TODO use supabase's created_at to display time and date DONE!
//TODO fix date to show today and or yesterday DONE!
//TODO make loading screen DONE!
//TODO make edit work with database DONE!
//TODO make delete work with database DONE!
//TODO make mouseover with profile for user and use database for info
//TODO change stickers on config.json to object, and replace :{name}: with embeded sticker DONE!
//TODO make delete and update message call the listener DONE!!

function ChatPage({ SUPABASE_ANON_KEY, SUPABASE_URL }) {
  //const username = "TheLima713";
  const [message, setMsg] = React.useState({ text: "", edit: 0 });
  const [updateMsg, setUpdateMsg] = React.useState(true);
  const [msgList, setMsgList] = React.useState([]); //necessario passar por função caso listener precise do valor atual

  const [msgsLoaded, setMsgsLoaded] = React.useState(false);

  const [channel, setChannel] = React.useState(1);
  const [channelList,setChannelList] = React.useState([]);


  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const router = useRouter();
  const username = router.query.username; //nao é em tempo real, diferentemente do useState!

  React.useEffect(() => {
    supabaseClient
      .from("messages")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        //console.log("Initial select: " + data);
        setMsgList(data);
        setMsgsLoaded(true);
      });
      
    realTimeMsgListener((eventType, newMsg) => {
      if (eventType === "INSERT") {
        setMsgList((currentMsgList) => {
          return [newMsg, ...currentMsgList];
        });
      } else if (eventType === "DELETE") {
        setMsgList((currentMsgList) => {
          return currentMsgList.filter((msgAtual) => {
            return msgAtual.id !== newMsg.id;
          });
        });
      } else if (eventType === "UPDATE") {
        setMsgList((currentMsgList) => {
          return currentMsgList.map((editMsg) => {
            if (editMsg.id === newMsg.id) {
              editMsg.text = newMsg.text;
            }
            return editMsg;
          });
        });
      }
    });

    supabaseClient
    .from("channels")
    .select("*")
    .order("id", { ascending: true })
    .then(({ data }) => {
      setChannelList(data);
    });

    const a = realTimeChannelListener((eventType, newChannel) => {
      if (eventType === "INSERT") {
        setChannelList((currentChannelList) => {
          return [...currentChannelList, newChannel];
        });
      } else if (eventType === "DELETE") {
        setChannelList((currentChannelList) => {
          return currentChannelList.filter((currChannel) => {
            return currChannel.id !== newChannel.id;
          });
        });
      } else if (eventType === "UPDATE") {
        setChannelList((currentMsgList) => {
          return currentMsgList.map((editChannel) => {
            if (editChannel.id === newChannel.id) {
              editChannel.name = newChannel.name;
              return editChannel;
            } else {
              return editChannel;
            }
          });
        });
      }
    });
  }, []);

  //effect pra atualizar a mensagem sempre, checando se a ultima "palavra" eh um emoji
  React.useEffect(() => {
    var currMsgSplit = message.text.split(" ");
    var lastMsg = currMsgSplit[currMsgSplit.length - 1];
    for (var n = 0; n < currMsgSplit.length; n++) {
      if (
        currMsgSplit[n].length != 1 &&
        currMsgSplit[n].startsWith(":") &&
        currMsgSplit[n].endsWith(":")
      ) {
        currMsgSplit[n] = currMsgSplit[n].replaceAll(":", "");
        currMsgSplit[n] = currMsgSplit[n].replaceAll("_", " ");
        fetch("https://unpkg.com/emoji.json@13.1.0/emoji.json")
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            data.every((emoji) => {
              if (emoji.name === currMsgSplit[n]) {
                //console.log("emoji: ", emoji)
                setMsg((currMsg) => {
                  currMsgSplit[n] = emoji.char + " ";
                  var text = currMsgSplit.join(" ");
                  return { text: text, edit: message.edit };
                });
                return false;
              } else {
                return true;
              }
            });
          });
      }
    }
  }, [updateMsg]);

  //FUNCTIONS

  function realTimeMsgListener(msgFunc) {
    return supabaseClient
      .from("messages")
      .on("*", (response) => {
        if (response.eventType === "INSERT") {
          //console.log('insert response: ', response.new)
          msgFunc("INSERT", response.new);
        } else if (response.eventType === "DELETE") {
          //console.log('delete response: ', response.old)
          msgFunc("DELETE", response.old);
        } else if (response.eventType === "UPDATE") {
          //console.log('update response: ', response.new)
          msgFunc("UPDATE", response.new);
        }
      })
      .subscribe()
  }

  function realTimeChannelListener(channelFunc) {
    return supabaseClient
      .from("channels")
      .on("*", (response) => {
        if (response.eventType === "INSERT") {
          //console.log('insert response: ', response.new)
          channelFunc("INSERT", response.new);
        } else if (response.eventType === "DELETE") {
          //console.log('delete response: ', response.old)
          channelFunc("DELETE", response.old);
        } else if (response.eventType === "UPDATE") {
          //console.log('update response: ', response.new)
          channelFunc("UPDATE", response.new);
        }
      })
      .subscribe();
  }

  function handleNewMsg(newMsg) {
    if (newMsg.startsWith("/") && !newMsg.startsWith("//")) {
      var cc = newMsg.charCodeAt(1);
      var isAN =
        (cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123);
      if (!isAN) {
        newMsg = newMsg.replace("/", "");
      }
    }
    const mensagem = {
      from: username,
      text: newMsg,
      msg_channel: channel
    };

    supabaseClient
      .from("messages")
      .insert([mensagem])
      .then((data) => {
        //
      });
    setMsg({ text: "", edit: 0 });
  }
  function editMsg(eMsg) {
    supabaseClient
      .from("messages")
      .update({ text: eMsg.text })
      .match({ id: eMsg.edit, from: username })
      .then((data) => {
        //
      });
    setMsg({ text: "", edit: 0 });
  }
  function deleteMsg(delMsg) {
    if (delMsg.from === username) {
      supabaseClient
        .from("messages")
        .delete()
        .match({ id: delMsg.id })
        .then((data) => {
          //
        });
    }
  }
  function handleNewChannel(newChannel){
    if(username=="TheLima713"){
      const channel = {
        name: newChannel.name,
        type: 'text'
      }
      supabaseClient
        .from("channels")
        .insert([channel])
        .then((data) => {
          //
        });
    }
  }
  function editChannel(eChannel){
    if(username=="TheLima713"){
      supabaseClient
        .from("channels")
        .update({name:eChannel.name})
        .match({ id: eChannel.id})
        .then((data) => {
          //
        });
    }
  }
  function deleteChannel(delChannel){
    if(username=="TheLima713"){
      supabaseClient
        .from("channels")
        .delete()
        .match({ id: delChannel.id})
        .then((data) => {
        });
    }
  }

  if (!msgsLoaded) {
    return (
      <>
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            styleSheet={{
              width: "100%",
              height: "100vh",
            }}
            className="load"
            src="https://res.cloudinary.com/practicaldev/image/fetch/s--eTg89weN--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/6plr4gy0co6qpd3a484f.gif"
          />
        </Box>
      </>
    );
  }

  return (
    //background
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.neutrals[200],
        backgroundImage: `url(https://wallpapercave.com/dwp1x/wp3116860.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
      }}
    >
      {/*chat page container*/}
      <Box
        styleSheet={{
          opacity: "0.9",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100vh",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
          color: appConfig.theme.colors.neutrals[200],
        }}
      >
        <Header />
        <Box
        styleSheet={{
          opacity: "0.9",
          display: "flex",
          flexDirection: "row",
          flex: 1,
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "100%",
          maxHeight: "90%",
          color: appConfig.theme.colors.neutrals[200],
          justifyContent:"space-between"
        }}
        >
          <Box
            styleSheet={{
              position: "relative",
              display: "flex",
              flex: 4,
              height: "100%",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              flexDirection: "column",
              borderRadius: "5px",
              paddingRight: "8px",
              marginRight: "16px",
            }}
          >
            <ChannelList 
              channel={channel}
              setChannel={setChannel}
              channelList={channelList}
              setChannelList={setChannelList}
              handleNewChannel={handleNewChannel}
              editChannel={editChannel}
              deleteChannel={deleteChannel}
            />
          </Box>
          <Box
            styleSheet={{
              position: "relative",
              display: "flex",
              flex: 7,
              height: "100%",
              backgroundColor: appConfig.theme.colors.neutrals[600],
              flexDirection: "column",
              borderRadius: "5px",
              paddingLeft: "8px",
              marginLeft: "16px",
            }}
          >
            <MessageList
              msgList={msgList}
              setMsgList={setMsgList}
              deleteMsg={deleteMsg}
              setMsg={setMsg}
              channel={channel}
            />
            <Box
              as="form"
              styleSheet={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                styleSheet={{
                  maxWidth: "50px",
                  maxHeight: "50px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                  flex: "1",
                }}
                src={`https://github.com/${username}.png`}
              />
              <TextField
                value={message.text}
                onChange={(event) => {
                  setMsg({ text: event.target.value, edit: message.edit });
                  setUpdateMsg((currUpdateMsg) => {
                    return !currUpdateMsg;
                  });
                }}
                onKeyPress={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (message.edit != 0) {
                      editMsg(message);
                    } else {
                      handleNewMsg(message.text);
                    }
                  }
                }}
                placeholder="Insira sua mensagem aqui..."
                type="textarea"
                styleSheet={{
                  width: {
                    sm: "50%",
                    md: "60%",
                    lg: "70%",
                  },
                  border: "0",
                  resize: "none",
                  borderRadius: "5px",
                  padding: "8px 8px",
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                  marginHorizontal: "12px",
                  marginTop: "10px",
                  color: appConfig.theme.colors.neutrals[200],
                  flex: "1",
                }}
              />
              <Box
                styleSheet={{
                  display: "inline-flex",
                  justifyContent: "center",
                }}
              >
                <ButtonSendSticker
                  onStickerClick={(stickername) => {
                    handleNewMsg("/sticker:" + stickername);
                  }}
                />
                <Button
                  styleSheet={{
                    minWidth: "50px",
                    minHeight: "50px",
                    margin: "5px",
                  }}
                  buttonColors={{
                    contrastColor: appConfig.theme.colors.neutrals["000"],
                    mainColor: appConfig.theme.colors.primary[500],
                    mainColorLight: appConfig.theme.colors.primary[400],
                    mainColorStrong: appConfig.theme.colors.primary[600],
                  }}
                  iconName="arrowRight"
                  onClick={() => {
                    {
                      if (message.edit != 0) {
                        editMsg(message);
                      } else {
                        handleNewMsg(message.text);
                      }
                    }
                  }}
                />
              </Box>
            </Box>
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
        <Text variant="heading4">Chat</Text>
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

export async function getServerSideProps() {
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = process.env;
  return {
    props: {
      SUPABASE_ANON_KEY,
      SUPABASE_URL,
    },
  };
}

export default ChatPage;

//dummy
