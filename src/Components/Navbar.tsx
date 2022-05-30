import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";

import * as Styled from "../styles/navbar";
import { injector } from "../wallet";
import Web3 from "web3";
import { Lqpool } from "./Lqpool";
import { useCallback, useState } from "react";
import { Swap } from "./Swap";
import { setConnectWallet, setDisConnectWallet } from "../logic/redux/actions";
export const Navbar: React.FC = () => {
  const { active, account, library, activate, deactivate } = useWeb3React<any>();

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
  const handleDisConnectwallet = (props: any) => {
    dispatch(setDisConnectWallet(props));
  };
  const Disconnect_ = useCallback(() => {
    deactivate();
    handleDisConnectwallet(false);
    localStorage.clear();
    document.body.style.overflow = "unset";
  }, [deactivate]);
  // useEffect(() => {
  //   (async () => {
  //     if (library != undefined) {
  //       const networkNumber = await library.eth.net.getId();
  //       if (networkNumber != 97) {
  //         alert("Connect to BSC testnet please :)");
  //       }
  //     }
  //   })();

  //   web3.eth.getAccounts().then((res: any) => {
  //     if (res.length != 0) {
  //       connect();
  //     }
  //   });
  // }, [library]);

  const dispatch = useDispatch();

  const handleconnectwallet = () => {
    dispatch(setConnectWallet(true))
  }

  return (
    <>
      <Styled.Navbr>
        {" "}
        <Styled.LogoHome>
          Liquidity Pool
        </Styled.LogoHome>
        {active ? (
          <Styled.WalletConnected onClick={Disconnect_}>Connected</Styled.WalletConnected>
        ) : (
          <Styled.WalletConnect onClick={handleconnectwallet}>
            Connect to metamask
          </Styled.WalletConnect>
        )}
        <Styled.SwapButton onClick={trigger}>{flag ? "Pool" : "Swap"}</Styled.SwapButton>
      </Styled.Navbr>
      {flag ? (
        <Swap></Swap>
      ) : (
        <Lqpool
        ></Lqpool>
      )}
    </>
  );
};


