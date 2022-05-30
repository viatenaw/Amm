import styled from 'styled-components'

export const Navbr = styled.nav`
  height: 10vh;
  width: 100vw;
  font-weight:bold;
  font-size: xx-large;
  display: flex;
  background-color: #4971a0;
  color: white;
  justify-content: space-around;
  align-items:center;
  box-shadow: 0px 0px 1px 0px;
`

export const WalletConnect = styled.button`
  height: 50px;
  background-color: #65a6f2;
  font-weight: bold;
  color: #022744;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 6em;
`

export const WalletConnected = styled(WalletConnect)`
  background-color: #003900c4;
  color: #04ff04;
  padding: 0 15px;
`

export const LogoHome = styled.button`
  background: #4971a0;
  border: none;
  color: #022744;
  font-size: 16px;
  font-weight: bolder;
`


export const SwapButton = styled.button`
  padding: 15px;
  background-color: #65a6f2;
  font-weight: bold;
  color: #022744;
  border: none;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`