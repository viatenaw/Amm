import { SET_CONNECT_WALLET } from '../actions/actionTypes'
import { SET_DISCONNECT_WALLET } from '../actions/actionTypes'

const initialState = {
    connected: false,
    connectwallet: false,
    disconnectWallet: false
}

export const navbarReducer = (state = initialState, action: any) => {
    const { type, payload } = action
    switch (type) {
        case SET_CONNECT_WALLET:
            return {
                ...state,
                connectwallet: payload
            }
        case SET_DISCONNECT_WALLET:
            return {
                ...state,
                disconnectWallet: payload
            }
        default:
            return state
    }
}