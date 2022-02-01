import React from "react";
import { Box, Button, Text, Image, TextField } from "@skynexui/components";
import appConfig from "../../config.json";
import { ChannelDisplay } from "./ChannelDisplay";

export function ChannelList(props) {
  const [focus, setFocus] = React.useState(0);
  const [showNew, setShowNew] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        margin: "16px",
        alignItems: "center",
      }}
    >
      {props.channelList.map((currChannel) => {
        return (
            <ChannelDisplay
              focus={focus}
              setFocus={setFocus}
              channel={props.channel}
              setChannel={props.setChannel}
              currChannel={currChannel}
              editChannel={props.editChannel}
              deleteChannel={props.deleteChannel}
            />
        );
      })}
      {showNew && (
        <TextField
          value={newName}
          onChange={(event) => {
            setNewName(event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              const channel = {
                name: newName,
                type: "text",
              };
              props.handleNewChannel(channel);
              setNewName("");
              setShowNew(false);
              setFocus(0);
            }
          }}
          styleSheet={{
            margin: "10px",
            width: "50%",
          }}
          textFieldColors={{
            neutral: {
              textColor: appConfig.theme.colors.neutrals[200],
              mainColor: appConfig.theme.colors.neutrals[900],
              mainColorHighlight: appConfig.theme.colors.primary[500],
              backgroundColor: appConfig.theme.colors.neutrals[800],
            },
          }}
        />
      )}
      <Button
        onClick={() => {
          setShowNew(!showNew);
        }}
        variant="tertiary"
        iconName="FaPlus"
        buttonColors={{
          contrastColor: appConfig.theme.colors.neutrals["000"],
          mainColor: appConfig.theme.colors.neutrals[300],
          mainColorLight: appConfig.theme.colors.neutrals[500],
          mainColorStrong: appConfig.theme.colors.neutrals[500],
        }}
      />
    </Box>
  );
}
