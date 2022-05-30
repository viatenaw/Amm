import styled from "styled-components";


export const SwapBox = styled.div`
  height: 25rem;
  width: 25rem;
  border-radius: 10px;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  box-shadow: 1px 1px 7px 2px;
  background-color: #4b7aab;
  font-weight: bolder;
  font-size: large;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
  color: #022744;
`


export const SpanContainer = styled.div`
  height: 60px;
  width: 100%;
  font-size: x-large;
  margin-top: 1rem;
`

export const FirstInputBox = styled.div`
  width: 100%;
  margin: 1em 0;
`

export const InputContainer = styled.div`
width: 100%;
display: flex;
justify-content: space-between;

.Input{
  font-size: small;
  margin-left: 30px;

}

.Balance{
  font-size:small;
  margin-right: 30px;
}
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
  ::-webkit-inner-spin-button{
        -webkit-appearance: none; 
        margin: 0; 
    }
  ::-webkit-outer-spin-button{
      -webkit-appearance: none; 
      margin: 0; 
  } 
  color: #4b7ea6;
`
export const ButtonContainer = styled.div`
 height: 50px;
 width: 100%;
 margin-top: 1.5rem;
 display: flex;
 justify-content: space-around;
 align-items: center;
`

export const  Button = styled.button`
  height: 50px;
  border-radius: 8px;
  background-color: #65a6f2;
  color: white;
  font-weight: bolder;
  font-size: large;
  border: none;
  color: #022744;
  cursor: pointer;
`