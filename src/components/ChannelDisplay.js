import React from "react";
import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import appConfig from "../../config.json";

export function ChannelDisplay(props) {
  const [channelName, setChannelName] = React.useState(props.currChannel.name);

  return (
    <Box
      key={props.currChannel.id}
      tag="li"
      styleSheet={{
        width: "100%",
        display: "inline-flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "5px",
        margin: "10px",
        backgroundColor:
          props.channel == props.currChannel.id
            ? appConfig.theme.colors.neutrals[700]
            : appConfig.theme.colors.neutrals[800],
        hover: {
          cursor: "pointer",
          backgroundColor: appConfig.theme.colors.neutrals[700],
        },
      }}
    >
      <Box
        onClick={() => {
          props.setChannel(props.currChannel.id);
        }}
        styleSheet={{
          flex: 6,
        }}
      >
        {props.focus != props.currChannel.id && (
          <Text
            styleSheet={{
              padding: "10px",
              justifyContent: "left",
            }}
          >
            {props.currChannel.name}
          </Text>
        )}
        {props.focus == props.currChannel.id && (
          <TextField
            value={channelName}
            onChange={(event) => {
              setChannelName(event.target.value);
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                const channel = {
                  id: props.currChannel.id,
                  name: channelName,
                  type: "text",
                };
                props.editChannel(channel);
                props.setFocus(0);
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
      </Box>
      <Box>
        <Button
          onClick={() => {
            props.setFocus(
              props.focus == props.currChannel.id ? 0 : props.currChannel.id
            );
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
            props.deleteChannel(props.currChannel);
            props.setChannel(1);
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
  );
}
