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
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

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
  const [msgList, setMsgList] = React.useState([]); //necessario passar por função caso listener precise do valor atual
  const [msgsLoaded, setMsgsLoaded] = React.useState(false);
  const [updateMsg, setUpdateMsg] = React.useState(true);
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
              return editMsg;
            } else {
              return editMsg;
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
      .subscribe();
  }
  function showMsg(msgAtual) {
    var msgSplit = msgAtual.text.split(" ");
    for (var n = 0; n < msgSplit.length; n++) {
      if (msgSplit[n].startsWith("/sticker:")) {
        var size = "4vh";
        if (msgSplit.length == 1) {
          size = "15vh";
        }
        msgSplit[n] = (
          <Image
            styleSheet={{
              maxWidth: size,
              maxHeight: size,
              display: "inline",
            }}
            src={appConfig.stickers[msgSplit[n].replace("/sticker:", "")]}
          />
        );
      } else {
        msgSplit[n] = <Text>{msgSplit[n] + " "}</Text>;
      }
    }
    return (
      <Box
        styleSheet={{
          display: "inline",
        }}
      >
        {msgSplit}
      </Box>
    );
  }
  function writeDate(time) {
    const day = new Date().getDate();
    const dayDiff = day - parseInt(time.substring(8, 10));
    var date = "";
    switch (dayDiff) {
      case 0:
        date = "Hoje, " + time.substring(11, 16);
        break;
      case 1:
        date = "Ontem, " + time.substring(11, 16);
        break;
      default:
        date =
          time.substring(8, 10) +
          "/" +
          time.substring(5, 7) +
          "/" +
          time.substring(0, 4);
    }
    return date;
  }
  function handleNewMsg(newMsg) {
    //dummy
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
    };

    supabaseClient
      .from("messages")
      .insert([mensagem])
      .then((data)=>{
        //
      })
    setMsg({ text: "", edit: 0 });
  }
  function editMsg(eMsg) {
    supabaseClient
      .from("messages")
      .update({ text: eMsg.text })
      .match({ id: eMsg.edit, from: username })
      .then((data)=>{
        //
      })
    setMsg({ text: "", edit: 0 });
  }
  function deleteMsg(delMsg) {
    if (delMsg.from === username) {
      supabaseClient
        .from("messages")
        .delete()
        .match({ id: delMsg.id })
        .then((data)=>{
          //
        })
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
      <Box
        styleSheet={{
          opacity:'0.9',
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
          color:appConfig.theme.colors.neutrals
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
            writeDate={writeDate}
            showMsg={showMsg}
          />
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
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
                width: "70%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "8px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                marginTop: "10px",
                color: appConfig.theme.colors.neutrals[200],
                flex: "1",
              }}
            />
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
  const [mouseOver, setMouseOver] = React.useState(0);
  const [followers, setFollowers] = React.useState("");
  const [userReps, setUserReps] = React.useState("");

  function getUserCardInfo(msgAtual) {
    fetch(`https://api.github.com/users/${msgAtual.from}`).then(
      async (resposta) => {
        let dados = await resposta.json();
        let followers = dados.followers;
        setFollowers(followers);
        let userReps = dados.public_repos;
        setUserReps(userReps);
      }
    );
  }

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
              wordBreak: "break-all",
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
              {mouseOver === msgAtual.id ? (
                <>
                  {getUserCardInfo(msgAtual)}
                  <Box
                    onMouseLeave={() => {
                      setMouseOver(0);
                    }}
                    styleSheet={{
                      position: "relative",
                      width: "40vh",
                      height: "35vh",
                      backgroundColor: appConfig.theme.colors.neutrals[800],
                      display: "grid",
                      justifyContent: "center",
                      borderRadius: "1vh",
                    }}
                  >
                    <Box
                      styleSheet={{
                        display: "grid",
                        alignItems: "center",
                        textAlign: "center",
                        justifyContent: "center",
                        gridGap: "10px",
                      }}
                    >
                      <a
                        style={{
                          textDecoration: "none",
                          display: "grid",
                          gridGap: "5%",
                        }}
                        href={`https://github.com/${msgAtual.from}`}
                      >
                        <Image
                          styleSheet={{
                            backgroundColor:
                              appConfig.theme.colors.neutrals[400],
                            padding: "1vh",
                            width: "15vh",
                            height: "15vh",
                            borderRadius: "50%",
                            hover: {
                              backgroundColor:
                                appConfig.theme.colors.primary[600],
                              width: "17.5vh",
                              height: "17.5vh",
                            },
                          }}
                          src={`https://github.com/${msgAtual.from}.png`}
                        />
                        <Text
                          styleSheet={{
                            color: appConfig.theme.colors.neutrals["300"],
                            hover: {
                              color: appConfig.theme.colors.primary[600],
                            },
                          }}
                        >
                          {msgAtual.from}
                        </Text>
                      </a>
                    </Box>
                    <Box
                      styleSheet={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <a
                        style={{
                          textDecoration: "none",
                          alignItems: "center",
                          textAlign: "center",
                          justifyContent: "center",
                          display: "grid",
                          color: appConfig.theme.colors.neutrals["300"],
                        }}
                        target="_blank"
                        href={`https://github.com/${msgAtual.from}?tab=followers`}
                      >
                        <Text
                          styleSheet={{
                            padding: "10px",
                            hover: {
                              color: appConfig.theme.colors.primary["300"],
                            },
                          }}
                        >
                          {followers}
                          <br />
                          {"seguidores"}
                        </Text>
                      </a>
                      <a
                        style={{
                          textDecoration: "none",
                          alignItems: "center",
                          textAlign: "center",
                          justifyContent: "center",
                          display: "grid",
                          color: appConfig.theme.colors.neutrals["300"],
                        }}
                        target="_blank"
                        href={`https://github.com/${msgAtual.from}?tab=repositories`}
                      >
                        <Text
                          styleSheet={{
                            padding: "10px",
                            hover: {
                              color: appConfig.theme.colors.primary["300"],
                            },
                          }}
                        >
                          {userReps}
                          <br />
                          {"repositórios"}
                        </Text>
                      </a>
                    </Box>
                  </Box>
                </>
              ) : (
                <Image
                  onMouseOver={() => {
                    setMouseOver(msgAtual.id);
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
              )}
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
                onClick={() => {
                  props.setMsg({ text: msgAtual.text, edit: msgAtual.id });
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
            {props.showMsg(msgAtual)}
          </Text>
        );
      })}
    </Box>
  );
}

export async function getServerSideProps() {
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = process.env;
  return {
    props: {
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    },
  };
}

export default ChatPage;

//dummy
