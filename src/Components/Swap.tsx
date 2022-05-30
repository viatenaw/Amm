import * as Styles from "../styles/swap";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { Router_ } from "../logic/addLiq";
import { TokenA_add } from "../abis/TokenA";
import { TokenB_add } from "../abis/TokenB";
import {TokenA_,TokenB_} from "../logic/addLiq"
import Web3 from "web3";
import {Router_address} from "../abis/Router"
import { useState } from "react";
import CustomModal from "../shared/customModal";
import { useDispatch, useSelector } from "react-redux";
import { setConnectWallet } from "../logic/redux/actions";
import { injector } from "../wallet";

export const Swap = () => {
  const web3 = new Web3(Web3.givenProvider);
  const { activate, deactivate, active, library, chainId, account } = useWeb3React<any>();

  const [price1, setPrice1] = useState<string>("");
  const [price2, setPrice2] = useState<string>("");
  const [swapState,setSwap] = useState<string>("Swap");
  const globalSelector = useSelector((state: any) => state);
  const { connectwallet, disconnectWallet } = globalSelector.navbar;
  async function getBUST(BUSDprice: string) {
    try {
      setPrice1(BUSDprice);
      let BUSDprice_wei = web3.utils.toWei(BUSDprice, "ether");
      let BUST_Amount = await Router_.methods
        .getAmountsOut(BUSDprice_wei, [TokenA_add, TokenB_add])
        .call();
      let BUST_amount_eth = web3.utils.fromWei(
        BUST_Amount[1].toString(),
        "ether"
      );
      setPrice2(BUST_amount_eth);
    } catch (err) {
      // alert("Insufficient Liquidity");
    }
  }

  async function getBUSD(BUSTprice: string) {
    try {
      setPrice2(BUSTprice);
      let BUSTprice_wei = web3.utils.toWei(BUSTprice, "ether");
      let BUSD_Amount = await Router_.methods
        .getAmountsIn(BUSTprice_wei, [TokenA_add, TokenB_add])
        .call();
      setPrice1(web3.utils.fromWei(BUSD_Amount[0].toString(), "ether"));
    } catch (err) {
      // alert("Insufficient Liquidity");
    }
  }

  async function Swap() {
    if(!price1 || !price2) return
    const [admin, _] = await web3.eth.getAccounts();
    let amountIn = web3.utils.toWei(price1, "ether");
    let amountOutMin = web3.utils.toWei(price2, "ether");
    let DeadLine = (Math.round(new Date().getTime() / 1000) + 900).toString();
    try {
  
    setSwap("Approving..");
     await TokenA_.methods.approve(Router_address,amountIn).send({
      from:admin
     }).then(async()=>{
      setSwap("Swapping..");
        await Router_.methods
        .swapTokensForExactTokens(
          amountOutMin,
          amountIn,
          [TokenA_add, TokenB_add],
          admin,
          DeadLine
        )
        .send({ from: admin }).then(()=>{
          setSwap("Swap");
          alert("Swapped Successful");
          setPrice1("");
          setPrice2("");
        });
     })
     
    } catch (err) {
      console.error("swap", err);
    }
  }
  const dispatch = useDispatch();

  function handleconnectwallet(props: any) {
    dispatch(setConnectWallet(props));
  }
  const ConnectMetamask = async () => {
    try {
      console.log('oooooooooo>>>>>>>>>o');
      // await activate(injector);
      await activate(injector, (error) => {
        if (error instanceof UnsupportedChainIdError) {
          console.log('oooooooooo<<<<<<<<<<o');
          deactivate();
        } else {
          console.log('rrrrrrrrrrrrrrrrr<<<<<<<<<<o');

          if (error instanceof NoEthereumProviderError) {
            alert("Install Metamask ");
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
          } else {
            localStorage.clear();
          }
        }
      });
      console.log(' ', web3.eth);

      if (web3.eth) {
        console.log('ooooooooooo');

        const currentChainId = await web3.eth.getChainId();
        if (currentChainId == 97) {
          localStorage.setItem("connectorId_Metamask", JSON.stringify(true));
        }
      } 
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Styles.SwapBox>
        <Styles.SpanContainer>Swap</Styles.SpanContainer>
        <Styles.FirstInputBox>
          <Styles.InputContainer>
            <div className="Input">BUSD</div>
          </Styles.InputContainer>
          <Styles.InputPrice
            type='number'
            value={price1 != "" ? price1 : ""}
            onChange={(e: any) => {
              if (e.currentTarget.value == "") {
                setPrice1("");
                setPrice2("");
              } else {
                getBUST(e.currentTarget.value);
              }
            }}
          ></Styles.InputPrice>
        </Styles.FirstInputBox>
        <Styles.FirstInputBox>
          <Styles.InputContainer>
            <div className="Input">BUST</div>
          </Styles.InputContainer>
          <Styles.InputPrice
            type='number'
            value={price2 != "" ? price2 : ""}
            onChange={(e: any) => {
              if (e.currentTarget.value == "") {
                setPrice1("");
                setPrice2("");
              } else {
                getBUSD(e.currentTarget.value);
              }
            }}
          ></Styles.InputPrice>
        </Styles.FirstInputBox>

        <Styles.ButtonContainer>
          <Styles.Button onClick={Swap}> {swapState} </Styles.Button>
        </Styles.ButtonContainer>
      </Styles.SwapBox>
      <CustomModal
        show={connectwallet}
        toggleModal={(p: boolean) => {
          handleconnectwallet(p);
          document.body.style.overflow = "unset";
        }}
        heading={"Connect a Wallet"}
        styles={{ height: "15em" }}
      >
        <div className="walletconnectcontainer">
          <div
            className="metamask"
            onClick={() => {
              handleconnectwallet(false);
              ConnectMetamask();
              document.body.style.overflow = "unset";
            }}
          >
            {/* <img src={metamask} alt="metamask" /> */}
            <span>Metamask</span>
          </div>
        </div>
      </CustomModal>
    </>
  );
};
