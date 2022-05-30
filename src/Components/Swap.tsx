import * as Styles from "../styles/swap";
import { Router_ } from "../logic/addLiq";
import { TokenA_add } from "../abis/TokenA";
import { TokenB_add } from "../abis/TokenB";
import {TokenA_,TokenB_} from "../logic/addLiq"
import Web3 from "web3";
import {Router_address} from "../abis/Router"
import { useState } from "react";

export const Swap = () => {
  const web3 = new Web3(Web3.givenProvider);
  const [price1, setPrice1] = useState<string>("");
  const [price2, setPrice2] = useState<string>("");
  const [swapState,setSwap] = useState<string>("Swap");
  
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

  return (
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
  );
};
