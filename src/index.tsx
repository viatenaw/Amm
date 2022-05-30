import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { GlobalStyle } from "./styles/global";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

function getlibrary(provider: any) {
  return new Web3(provider);
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getlibrary}>
    <React.StrictMode>
      <GlobalStyle />
      <App />
    </React.StrictMode>
  </Web3ReactProvider>, 
  document.getElementById("root")
);
