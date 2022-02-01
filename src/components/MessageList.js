import React from "react";
import { Box, Button, Text, Image } from "@skynexui/components";
import appConfig from "../../config.json";
import { MessageDisplay } from "./MessageDisplay";

export function MessageList(props) {
  return (
    <Box
      key={props.channel}
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
      {props.msgList.map((msgAtual) => {
          if(msgAtual.msg_channel==props.channel){
            return (
                <MessageDisplay
                  msg_channel={msgAtual.msg_channel}
                  msgAtual={msgAtual}
                  setMsg={props.setMsg}
                  deleteMsg={props.deleteMsg}
                />
            );
          }
        }
      )}
    </Box>
  );
}

