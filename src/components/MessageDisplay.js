import React from "react";
import { Box, Button, Text, Image } from "@skynexui/components";
import appConfig from "../../config.json";
import { UserCard } from "./UserCard";

export function MessageDisplay(props) {
  var msgAtual = props.msgAtual;

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
        <UserCard msgAtual={msgAtual} />
        <Text 
          tag="strong"
          styleSheet={{
            fontSize: "2.5vh",
          }}
        >
          {msgAtual.from}
        </Text>
        <Text
          styleSheet={{
            fontSize: "2vh",
            marginLeft: "8px",
            color: appConfig.theme.colors.neutrals[300],
          }}
          tag="span"
        >
          {writeDate(msgAtual.created_at)}
        </Text>
        <Box
          styleSheet={{
            display: "inline-flex",
          }}
        >
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
      </Box>
      <Box
        styleSheet={{
          wordBreak: "break-all",
        }}
      >
        {showMsg(msgAtual)}
      </Box>
    </Text>
  );
}
