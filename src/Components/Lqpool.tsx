import * as Styles from "../styles/pool";
import { useState, useEffect } from "react";
import { Pair_ } from "../logic/addLiq";
import { Router_ } from "../logic/addLiq";
import { Router_address } from "../abis/Router";
import { TokenA_add } from "../abis/TokenA";
import { TokenB_add } from "../abis/TokenB";
import { TokenA_ } from "../logic/addLiq";
import { TokenB_ } from "../logic/addLiq";
import Web3 from "web3";

interface walletProp {
  account?: any;
  library?: any;
  active?: boolean;
}

export const Lqpool: React.FC<walletProp> = ({ account, active, library }) => {
  const web3 = new Web3(Web3.givenProvider);

  const [price1, setPrice1] = useState<any>(0);
  const [price2, setprice2] = useState<any>(0);

  const [balance1, setbalance1] = useState(0);
  const [balance2, setbalance2] = useState(0);
  const [LQToken, setTokenBalance] = useState(""); //Initial Total LP token
  const [LPRemoved, setLpRemoved] = useState<string>(""); //LP token to be removed

  const [BUSDreserve, setBUSDreserve] = useState<string>(""); //Total reserve BUSD token in Pair contract
  const [BUSTreserve, setBUSTreserve] = useState<string>("");

  const [btntrigger, setTrigger] = useState(true);

  const [balanceToken1_LP, setbalancebyLP1] = useState(""); //initial TOken to be get
  const [balanceToken2_LP, setbalancebyLP2] = useState("");

  const [BUSDremoved, setBUSDRemove] = useState<number>(); //BUST and BUST tokens to be remved
  const [BUSTremoved, setBUSTRemove] = useState<number>();

  const [totalSupply, setSupply] = useState<number>(); //Total supply in pair Contract

  const [percentage, setPercentage] = useState<number>(100);

  const [buttonText, setText] = useState<string>("Supply");
  const [processing, setProcessing] = useState<boolean>(false);
  const [buttonTextRem, setRemText] = useState<string>("Approve");
  const [fundsBtn, setFundBtn] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    
      (async () => {
        if (mounted && library) {
          const networkNumber = await library.eth.net.getId();
          if (account && networkNumber == 97) getInitialBalance();
        }
      })();
    
    return () => {
      mounted = false;
    };
  }, [
    LQToken,
    totalSupply,
    BUSDreserve,
    BUSTreserve,
    active,
    account,
    library,
  ]);

  function reset() {}

  function intitalTokens(
    Lp: string,
    supply: number,
    Busd: string,
    Bust: string
  ) {
    let token1balance = (Number(Busd) / supply) * Number(Lp);
    let token2balance = (Number(Bust) / supply) * Number(Lp);
    
    setbalancebyLP1(token1balance.toString());
    setbalancebyLP2(token2balance.toString());
  }

  function trigger() {
    setTrigger((prev) => !prev);
  }

  // fetches account details
  async function getInitialBalance() {
    try {
      const [admin, _] = await web3.eth.getAccounts();

      let longval = Number(
        web3.utils.fromWei(
          await TokenA_.methods.balanceOf(admin).call(),
          "ether"
        )
      );
      let bal1 = Math.round(longval * 1000) / 1000;

      let longval2 = Number(
        web3.utils.fromWei(
          await TokenB_.methods.balanceOf(admin).call(),
          "ether"
        )
      );
      let bal2 = Math.round(longval2 * 1000) / 1000;

      if (bal1 == 0 || bal2 == 0) {
        setFundBtn(true);
      }

      const LpToken_amount = await Pair_.methods.balanceOf(admin).call();

      if (LpToken_amount != 0) {
        const supply = await Pair_.methods.totalSupply().call();

        let inEth = Number(web3.utils.fromWei(LpToken_amount, "ether"));
        let LP: string = inEth.toString();

        let c = await Pair_.methods.getReserves().call();
        let resA = c._reserve0;
        let resB = c._reserve1;

        setBUSDreserve(resA);
        setBUSTreserve(resB);

        setTokenBalance(LP);
        setLpRemoved(LP);
        setSupply(Number(supply));
        intitalTokens(LP, Number(supply), resA, resB);
        getBalanceby_LP(100);
        setFundBtn(false);
      } else {
        let c = await Pair_.methods.getReserves().call();
        let resA = c._reserve0;
        let resB = c._reserve1;

        setBUSDreserve(resA);
        setBUSTreserve(resB);
        setTokenBalance("");
       
      }
      setbalance1(bal1);
      setbalance2(bal2);
    } catch (err) {
      if (err) {
        setFundBtn(true);
      }
    }
  }

  // Start ADDING LIQUIDITY PART 1

  // Step 1 get price of both tokens by calculating  reserve tokens
  async function getBUSTAmount(e: React.ChangeEvent<HTMLInputElement>) {
    setPrice1(e.currentTarget.value);
    if (e.currentTarget.value != "") {
      try {
        
        let price1_wei = web3.utils.toWei(
          e.currentTarget.value.toString(),
          "ether"
          );
        let amountB = await Router_.methods
        .quote(price1_wei.toString(), BUSDreserve, BUSTreserve)
        .call();
  
        let amountB_Eth = web3.utils.fromWei(amountB.toString(), "ether");
        setprice2(Number(amountB_Eth));
      } catch (error) {
        console.error('errorrrrr', error)
      }
    } else {
      setprice2(0);
    }
  }

  async function getBUSDAmount(e: React.ChangeEvent<HTMLInputElement>) {
    setprice2(e.currentTarget.value);
    if (e.currentTarget.value != "") {
      let price2_wei = web3.utils.toWei(
        e.currentTarget.value.toString(),
        "ether"
      );
      let amountA = await Router_.methods
        .quote(price2_wei, BUSTreserve, BUSDreserve)
        .call();
      let amountA_Eth = web3.utils.fromWei(amountA.toString(), "ether");
      setPrice1(Number(amountA_Eth));
    } else {
      setPrice1(0);
    }
  }

  // Step 2 Approve both the tokens

  async function Approve() {
    if(!price1 || !price2) return
    try {
      const [admin] = await web3.eth.getAccounts();
      let price1_wei = web3.utils.toWei(price1.toString(), "ether");
      let price2_wei = web3.utils.toWei(price2.toString(), "ether");
      setProcessing(true);
      setText("Approving BUSD..");
      await TokenA_.methods
        .approve(Router_address, price1_wei)
        .send({ from: admin })
        .then(async () => {
          setText("Approving BUST..");
          await TokenB_.methods
            .approve(Router_address, price2_wei)
            .send({ from: admin })
            .then(() => {
              setText("Supplying..");
              AddLiquidity();
            });
        });
    } catch (err) {
      if (err) {
        setText("Supply");
        setProcessing(false);
      }
    }
  }

  // Step 3 call AddLiquidity Method
  async function AddLiquidity() {
    try {
      let priceB = web3.utils.toWei(price2.toString(), "ether");
      let priceA = web3.utils.toWei(price1.toString(), "ether");
      let DeadLine = (Math.round(new Date().getTime() / 1000) + 900).toString();
      const [admin, _] = await web3.eth.getAccounts();

      const MinBUSD = price1 - (price1 * 1) / 200;
      const MinBUST = price2 - (price2 * 1) / 200;

      let MinBUSD_wei: string = web3.utils.toWei(MinBUSD.toString(), "ether");
      let MinBUST_wei: string = web3.utils.toWei(MinBUST.toString(), "ether");

   

      await Router_.methods
        .addLiquidity(
          TokenA_add,
          TokenB_add,
          priceA,
          priceB,
          MinBUSD_wei,
          MinBUST_wei,
          admin,
          DeadLine
        )
        .send({ from: admin })
        .then((res: any) => {
          setText("Supply");
          setProcessing(false);
          getInitialBalance();
          alert("Liquidity added successfully");
          setPrice1(0);
          setprice2(0);
        });
    } catch (err) {
      if (err) {
        setText("Supply");
        setProcessing(false);
      }
    }
  }

  // End  ADDING LIQUIDITY PART 1

  //  REMOVING LIQUIDITY PART 2

  // Step 1 Approve LP Token ie,. Liquidity pool Token which was received after adding Liquidity

  // Before approving calculate how much amount you want to remove

  async function getBalanceby_LP(percent: number) {
    setPercentage(percent);
    try {
      if (percent == 100) {
        let BUSD = Number(balanceToken1_LP);
        let BUST = Number(balanceToken2_LP);
        let TokenTobeRemove = Number(LQToken);
        setBUSDRemove(Number(BUSD));
        setBUSTRemove(Number(BUST));
        setLpRemoved(Number(TokenTobeRemove).toString());
      } else {
        let BUSD = (Number(balanceToken1_LP) * percent) / 100;
        let BUST = (Number(balanceToken2_LP) * percent) / 100;
        let TokenTobeRemove = (Number(LQToken) * percent) / 100;
        setBUSDRemove(Number(BUSD.toFixed(3)));
        setBUSTRemove(Number(BUST.toFixed(3)));
        setLpRemoved(Number(TokenTobeRemove).toFixed(3).toString());
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Step 2 Approve desired Lp token
  async function approveLP() {
    try {
      const [admin, _] = await web3.eth.getAccounts();
      setRemText("Approving..");
      setProcessing(true);
      const LPtoBeRemoved = web3.utils.toWei(LPRemoved, "ether");

      await Pair_.methods
        .approve(Router_address, LPtoBeRemoved)
        .send({ from: admin })
        .then(() => {
          setRemText("Removing..");
          removeLiquidity();
        });
    } catch (err) {
      if (err) {
        setProcessing(false);
        setRemText("Approve");
        getInitialBalance();
      }
    }
  }

  // Remove Liquidity and get back your tokens
  async function removeLiquidity() {
    try {
      const [admin] = await web3.eth.getAccounts();
      let DeadLine = (Math.round(new Date().getTime() / 1000) + 900).toString();
      const LPtoBeRemoved = web3.utils.toWei(LPRemoved, "ether");

      const MinBUSD =
        (BUSDremoved ? BUSDremoved : 0) -
        ((BUSDremoved ? BUSDremoved : 0) * 1) / 100;
      const MinBUST =
        (BUSTremoved ? BUSTremoved : 0) -
        ((BUSTremoved ? BUSTremoved : 0) * 1) / 100;
      let MinBUSD_wei: string = web3.utils.toWei(MinBUSD.toString(), "ether");
      let MinBUST_wei: string = web3.utils.toWei(MinBUST.toString(), "ether");

      await Router_.methods
        .removeLiquidity(
          TokenA_add,
          TokenB_add,
          LPtoBeRemoved,
          MinBUSD_wei,
          MinBUST_wei,
          admin,
          DeadLine
        )
        .send({ from: admin })
        .then(() => {
          setProcessing(false);
          setRemText("Approve");

          alert("Liquidity Removed Successfully!");
          getInitialBalance();
        });
    } catch (error) {
      if (error) {
        setProcessing(false);
        setRemText("Approve");
      }
    }
  }

  return (
    <>
      {btntrigger ? (
        <Styles.LiquidityPool>
          <Styles.SpanContainer>Add Liquidity</Styles.SpanContainer>
          <Styles.FirstInputBox>
            <Styles.InputContainer>
              <div className="Input">BUSD</div>
              <div className="Balance">Balance: {balance1}</div>
            </Styles.InputContainer>
            <Styles.InputPrice
              placeholder="BUSD"
              type="number"
              value={price1 != 0 ? price1 : ""}
              onChange={(e: any) => {
                getBUSTAmount(e);
              }}
            />
          </Styles.FirstInputBox>
          <div className="plusIcon">+</div>

          <Styles.FirstInputBox>
            <Styles.InputContainer>
              <div className="Input">BUST</div>
              <div className="Balance">Balance: {balance2} </div>
            </Styles.InputContainer>
            <Styles.InputPrice
              placeholder="BUST"
              value={price2 != 0 ? price2 : ""}
              onChange={(e: any) => {
                getBUSDAmount(e);
              }}
            />
          </Styles.FirstInputBox>

          <Styles.ButtonContainer>
            {fundsBtn ? (
              <Styles.IFButton disabled={true}>
                Insufficiant Funds
              </Styles.IFButton>
            ) : (
              <Styles.Button
                process={processing}
                onClick={Approve}
                disabled={processing}
              >
                {buttonText}
              </Styles.Button>
            )}
            {/* <Styles.Button onClick={AddLiquidity}>Add Liquidity</Styles.Button> */}
          </Styles.ButtonContainer>

          <div className="yourLiq">
            
            {LQToken ? "Your Liquidity:" + LQToken.toString() : "You don't have any LP token"}
          </div>
          {LQToken ? (
            <button
              className="rmLq"
              onClick={() => {
                getBalanceby_LP(100);
                trigger();
              }}
            >
             Remove Liquidity
            </button>
          ) : (
            ""
          )}
        </Styles.LiquidityPool>
      ) : (
        <Styles.LiquidityPool>
          <Styles.SpanContainer>Remove Liquidity</Styles.SpanContainer>
          <Styles.PercBlock>
            <Styles.Per
              selected={percentage === 25}
              onClick={() => {
                getBalanceby_LP(25);
              }}
            >
              25%
            </Styles.Per>
            <Styles.Per
              selected={percentage === 50}
              onClick={() => {
                getBalanceby_LP(50);
              }}
            >
              50%
            </Styles.Per>
            <Styles.Per
              selected={percentage === 75}
              onClick={() => {
                getBalanceby_LP(75);
              }}
            >
              75%
            </Styles.Per>
            <Styles.Per
              selected={percentage === 100}
              onClick={() => {
                getBalanceby_LP(100);
              }}
            >
              100%
            </Styles.Per>
          </Styles.PercBlock>
          <br></br>
          <span className="text">Max LP to be removed : {Number(LPRemoved).toFixed(3)}</span>
          <br></br>
          <Styles.ButtonContainer>
            <div>
              <Styles.P className="text">BUSD : {Number(BUSDremoved).toFixed(3)}</Styles.P>
              <Styles.P className="text">BUST : {Number(BUSTremoved).toFixed(3)}</Styles.P>
            </div>
            <Styles.ButtonRem
              process={processing}
              onClick={approveLP}
              disbled={processing}
            >
              {buttonTextRem}
            </Styles.ButtonRem>
            {/* <Styles.Button onClick={removeLiquidity} >Remove Liquidity</Styles.Button> */}
          </Styles.ButtonContainer>

          <br></br>
          <span className="text">Or</span>
          <br></br>
          <Styles.Button onClick={trigger}>Supply</Styles.Button>
        </Styles.LiquidityPool>
      )}
    </>
  );
};
