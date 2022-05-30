import * as Styled from "../styles/navbar";
import { useWeb3React } from "@web3-react/core";
import { injector } from "../wallet";
import { useEffect } from "react";
import Web3 from "web3";
import { Lqpool } from "./Lqpool";
import { useState } from "react";
import { Swap } from "./Swap";
export const Navbar: React.FC = () => {
  const { active, account, library, activate } = useWeb3React<any>();

  const web3 = new Web3(Web3.givenProvider);

  const [flag, setFlag] = useState<boolean>(false);

  function trigger() {
    setFlag((prev) => !prev);
  }

  async function connect() {
    try {
      await activate(injector);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    (async () => {
      if (library != undefined) {
        const networkNumber = await library.eth.net.getId();
        if (networkNumber != 97) {
          alert("Connect to BSC testnet please :)");
        }
      }
    })();

    web3.eth.getAccounts().then((res: any) => {
      if (res.length != 0) {
        connect();
      }
    });
  }, [library]);

  return (
    <>
      <Styled.Navbr>
        {" "}
        <Styled.LogoHome>
          Liquidity Pool
        </Styled.LogoHome>
        {active ? (
          <Styled.WalletConnected>Connected</Styled.WalletConnected>
        ) : (
          <Styled.WalletConnect onClick={connect}>
            Connect to metamask
          </Styled.WalletConnect>
        )}
        <Styled.SwapButton onClick={trigger}>{flag ? "Pool" : "Swap"}</Styled.SwapButton>
      </Styled.Navbr>
      {flag ? (
        <Swap></Swap>
      ) : (
        <Lqpool
          account={account ? account : ""}
          library={library ? library : ""}
          active={active ? active : false}
        ></Lqpool>
      )}
    </>
  );
};
