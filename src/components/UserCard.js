import React from "react";
import { Box, Button, Text, Image } from "@skynexui/components";
import appConfig from "../../config.json";

export function UserCard(props) {
  const [mouseOver, setMouseOver] = React.useState(0);
  const [followers, setFollowers] = React.useState("");
  const [userReps, setUserReps] = React.useState("");
  const msgAtual = props.msgAtual;

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
    <>
      {mouseOver === msgAtual.id ? (
        <>
          {getUserCardInfo(msgAtual)}
          <Box
            onMouseLeave={() => {
              setMouseOver(0);
            }}
            styleSheet={{
              position: "relative",
              width: "35vh",
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
                    backgroundColor: appConfig.theme.colors.neutrals[400],
                    padding: "1vh",
                    width: "15vh",
                    height: "15vh",
                    borderRadius: "50%",
                    hover: {
                      backgroundColor: appConfig.theme.colors.primary[600],
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
    </>
  );
}
