import { SET_CONNECT_WALLET } from './actionTypes'
import { SET_DISCONNECT_WALLET } from './actionTypes'

export const setConnectWallet = (status: boolean) => {
  return {
    type: SET_CONNECT_WALLET,
    payload: status,
  }
}

export const setDisConnectWallet = (status: boolean) => {
  return {
    type: SET_DISCONNECT_WALLET,
    payload: status,
  }
}