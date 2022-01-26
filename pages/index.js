import appConfig from "../config.json";
import React from "react";
import { useRouter } from "next/router";
import { Box, Button, Text, TextField, Image } from "@skynexui/components";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Title(props) {
  const Tag = props.tag || "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>
        {`
          ${Tag} {
            color: ${appConfig.theme.colors.neutrals["300"]};
            padding: 20px;
            marginbottom: 10px;
          }
        `}
      </style>
    </>
  );
}

/*Componente React
function HomePage() {
    return (
        <div>
            <GlobalStyle/>
            <Title tag="h2">Valor Ignorado </Title>
            <h2>Discord-Aluratrix</h2>
        </div>
    )
  }
  
  export default HomePage
*/

export default function PaginaInicial() {
  //const username = 'TheLima713';
  const [username, setUsername] = React.useState("TheLima713");
  const [location, setLocation] = React.useState("_");
  React.useEffect(()=> {
    fetch(`https://api.github.com/users/${username}`)
    .then(response=>response.json())
    .then(data=>{setLocation(data.location)});
  }, [username])

  const router = useRouter();




  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage:
            "url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            //quando submeter o botão de login:
            onSubmit={function (event) {
              event.preventDefault();
              router.push("/chat");
              console.log("form submitted");
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Title tag="h2">Boas vindas de volta!</Title>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>
            {/*
              <input
                type="text"
                value={username}
                onChange = {function handler(event){
                  //console.log(event.target.value);
                  //atualiza campo de username por meio da função criada por useState() do React
                  const valor = event.target.value;
                  setUsername(valor);
                }}
              />
              */}
            <TextField
              value={username}
              onChange={function handler(event) {
                //console.log(event.target.value);
                //atualiza campo de username por meio da função criada por useState() do React
                const valor = event.target.value;
                setUsername(valor);
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />

            <Button
              type="submit"
              label="Entrar"
              disabled={username.length < 3}
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            //style={{ display: username.length < 3 ? "none" : "flex" }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            <a href={`https://github.com/${username}`}>
              <Image
                styleSheet={{
                  borderRadius: "50%",
                  marginBottom: "16px",
                }}
                src={
                  (username.length<3 || !`https://github.com/${username}.png`)
                  ?"https://icon-library.com/images/no-user-image-icon/no-user-image-icon-3.jpg"
                  :`https://github.com/${username}.png`
                }
              />
            </a>
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {username}
            </Text>
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {location}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}