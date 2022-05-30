import styled from "styled-components";

interface Process{
  process?:Boolean
}

interface Active{
  selected?:Boolean
}

export const LiquidityPool = styled.div`
  padding: 1em;
  min-width: 27rem;
  max-width: 35rem;
  border-radius: 10px;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  box-shadow: 1px 1px 7px 2px;
  background-color: #4b7aab;
  font-weight: bolder;
  font-size: large;
  font-family: Arial, Helvetica, sans-serif;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #022744;
  .yourLiq{
    margin-top: 1.8rem;
    color: #022744;
  }

  .rmLq{
    font-size: 15px;
    cursor: pointer;
    background: #44497b;
    border: 1px solid #44497b;
    border-radius: 6px;
    padding: 5px;
  }
  .plusIcon {
    color: #022744;
  }
  .text {
    color: #022744;
  }
`

export const InputContainer = styled.div`
width: 100%;
display: flex;
justify-content: space-between;

.Input{
  font-size: small;
  margin-left: 30px;
  color: #022744;
}

.Balance{
  font-size:small;
  margin-right: 30px;
  color: #022744;
}
`

export const FirstInputBox = styled.div`
  width: 100%;
`

export const SpanContainer = styled.span`
  height: 60px;
  width: 100%;
  font-size: x-large;
  margin-top: 1rem;
  color: #022744;
`
export const InputPrice = styled.input`
  font-size: 18px;
  padding: 10px;
  margin: 10px;
  width: 80%;
  background: #022744;
  border: none;
  border-radius: 3px;
  outline-color: #0984e3;
  color: #4b7ea6;
  ::-webkit-inner-spin-button{
    -webkit-appearance: none; 
    margin: 0; 
  }
  ::-webkit-outer-spin-button{
    -webkit-appearance: none; 
    margin: 0; 
  } 
`


export const ButtonContainer = styled.div`
 height: 50px;
 width: 100%;
 margin-top: 1.5rem;
 display: flex;
 justify-content: space-around;
 align-items: center;
`

export const  Button = styled.button<Process>`
  height: 50px;
  width: 80%;
  border-radius: 8px;
  background-color: #44497b;
  color: #022744;
  font-weight: bolder;
  font-size: large;
  font-family: Arial, Helvetica, sans-serif;
  border: none;
  opacity: ${(props:any)=>props.process?0.5:1};
  cursor: pointer;
`

export const IFButton = styled(Button)`
  background-color:#eb2f06;
  color: white;
  opacity: 0.5;
`

export const ButtonBack = styled.button`
  height: 35px;
  width: 50px;
  border-radius: 8px;
  background-color: #44497b;
  color: #022744;
  font-size: 10px;
  border: none;
  margin-left: calc(calc( 25rem - 50px) / 2);
  cursor: pointer
`


export const PercBlock = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

export const Per = styled.div<Active>`
  height: 100%;
  width: 20%;
  font-weight:bold;
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props:any) => props.selected ? "#a4c9f3" : "#4971a0"};
  color: ${(props:any) => props.selected ? "#022744" : "black"};
  cursor: pointer;
  border-radius: 2px;
`

export const ButtonContainerRem = styled(ButtonContainer)`
  justify-content: space-between;
  div{
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

export const P = styled.p`
  font-size: 15px;
`

export const ButtonRem = styled(Button)<Process>`
  width: 50%;
  opacity: ${(props:any)=>props.process?0.5:1};
`