import "./index.css";
import * as React from "react";
import ReactDOM from 'react-dom';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import HostApplicationMain from "./HostApplicationMain";

const theme = createTheme({

    palette: {
        mode: 'dark',

        background: {
            "paper": "#424242",
            "default": "#121212",
        },

        primary: {
            "main": "#90caf9",
            "light": "rgb(166, 212, 250)",
            "dark": "rgb(100, 141, 174)",
            "contrastText": "rgba(0, 0, 0, 0.87)"
        },

        secondary: {
            "main": "#f48fb1",
            "light": "rgb(246, 165, 192)",
            "dark": "rgb(170, 100, 123)",
            "contrastText": "rgba(0, 0, 0, 0.87)"
        },
    },

    typography: {

        fontFamily: "Quicksand",
        fontSize: 16,

    },


} as any);

ReactDOM.render(
    (
        <>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <HostApplicationMain/>
            </ThemeProvider>
        </>
    ),
    document.getElementById("root")
);


