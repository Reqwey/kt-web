import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  GlobalStyles,
  Alert,
  Box,
  Button,
  FormControl,
  FormLabel,
  formLabelClasses,
  Avatar,
  Input,
  Typography,
  Divider,
} from "@mui/joy";
import ReportIcon from "@mui/icons-material/Report";
import ColorSchemeToggle from "../components/ColorSchemeToggle";
import logoSrc from "../assets/logo.png";
import whiteBackgroundSrc from "../assets/whitebg.jpg";
import darkBackgroundSrc from "../assets/darkbg.jpg";
import { usePostData } from "../methods/fetch_data";

interface props {
  message: string;
}

const AlertMessage: React.FC<props> = (props) => {
  if (props.message) {
    return (
      <Alert
        key="Error"
        startDecorator={
          <ReportIcon sx={{ mt: "2px", mx: "4px", fontSize: "xl2" }} />
        }
        sx={{ alignItems: "flex-start" }}
        variant="soft"
        color="danger"
      >
        <Typography fontWeight="lg" mt={0.25} color="danger">
          {props.message}
        </Typography>
      </Alert>
    );
  }
  return <br />;
};

export default function Login() {
  const navigate = useNavigate();
  const postData = usePostData();

  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState(
    ("" || localStorage.getItem("userName")) as string
  );
  const [password, setPassword] = useState("");
  const [sn, setSN] = useState(("" || localStorage.getItem("sn")) as string);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      console.log({ username, password, sn });
      const { response, error } = await postData("/api-login", {
        username,
        password,
        sn,
      });
      localStorage.setItem("sn", sn);
      if (error || !response.posted) {
        setLoading(false);
        console.log(isLoading);
        setErrorMessage(error || response.reason);
      } else {
        console.log(response.data);
        localStorage.setItem("sn", sn);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userName", response.data.userName);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("displayName", response.data.firstName);
        localStorage.setItem(
          "subjectList",
          JSON.stringify(response.data.subjectList)
        );
        navigate("/dashboard", { replace: true });
      }
    },
    [username, password, sn]
  );

  return (
    <>
      <GlobalStyles
        styles={{
          ":root": {
            "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
            "--Cover-width": "50vw", // must be `vw` only
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width:
            "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width:
              "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
            maxWidth: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: "flex",
              alignItems: "left",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                gap: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                fontWeight="lg"
                level="h4"
                startDecorator={
                  <Avatar
                    alt="Kunter Logo"
                    src={logoSrc}
                    sx={{ borderRadius: "10px" }}
                  />
                }
              >
                登录 Kunter
              </Typography>
            </Box>

            <ColorSchemeToggle />
          </Box>
          <Divider />
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .${formLabelClasses.asterisk}`]: {
                visibility: "hidden",
              },
            }}
          >
            <form onSubmit={handleSubmit}>
              <FormControl required>
                <FormLabel>用户名</FormLabel>
                <Input
                  placeholder="码课用户名"
                  type="username"
                  name="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  defaultValue={
                    "" || (localStorage.getItem("userName") as string)
                  }
                />
              </FormControl>
              <FormControl required>
                <FormLabel>密码</FormLabel>
                <Input
                  placeholder="码课密码"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl required>
                <FormLabel>SN 码</FormLabel>
                <Input
                  placeholder="通常可以在平板的背面或设置>关于本机>序列号获取"
                  type="sn"
                  name="sn"
                  value={sn}
                  onChange={(e) => {
                    setSN(e.target.value);
                  }}
                  defaultValue={"" || (localStorage.getItem("sn") as string)}
                />
              </FormControl>
              <Button type="submit" fullWidth loading={isLoading}>
                登录
              </Button>
              <AlertMessage message={errorMessage} />
            </form>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${whiteBackgroundSrc})`,
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage: `url(${darkBackgroundSrc})`,
          },
        })}
      />
    </>
  );
}
