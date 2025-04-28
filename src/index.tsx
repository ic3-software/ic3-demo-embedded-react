import "./index.css";
import * as React from "react";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import HostApplicationMain from "./HostApplicationMain";
import {createRoot} from 'react-dom/client'
// ---------------------------------------------------------------------------------------------------------------------
// The host application requires some custom HTTP headers to be added to all non-public
// HTTP requests. This demo shows how to add these headers.
// ---------------------------------------------------------------------------------------------------------------------
export const withCustomHeaders = false;

withCustomHeaders && window.addEventListener("message", event => {

    const data = event.data;

    if (data.type === "ic3-custom-headers-request") {

        const embeddedDiv = (data.ic3callerType === "div");
        const ic3customheaders = data.ic3customheaders /* as specified in the URL */;

        const target = !embeddedDiv
            ? (document.getElementById("ic3-iframe") as any)?.["contentWindow"]
            : window
        ;

        console.info('[CustomHeaders] demo <<< ic3-custom-headers-reply(' + ic3customheaders + ')');

        target && target.postMessage({

            type: "ic3-custom-headers-reply",

            data: {
                headers: {
                    "IC3_USER_NAME": "ic3-demo",
                    "IC3_ROLE_NAME": "administrator",
                }
            }

        }, document.location.origin);
        // https://cwe.mitre.org/data/definitions/942.html

    }
})

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

const reactRoot = createRoot(document.getElementById("root")!);
reactRoot.render(
    <>
        <CssBaseline/>
        <ThemeProvider theme={theme}>
            <HostApplicationMain/>
        </ThemeProvider>
    </>
);


