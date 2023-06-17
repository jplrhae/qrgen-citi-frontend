import * as React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Navbar from "./components/Navbar";
import BasicTabs from "./components/Tabs";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <BasicTabs />
      <Copyright />
    </>
  );
}
