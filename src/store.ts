import { writable } from 'svelte/store'

export const APP_STATUS = {
	INIT: 'INIT',
	LOADING: 'LOADING',
	CHAT_MODE: 'CHAT_MODE',
	ERROR: 'ERROR'
}

export const appStatus = writable(APP_STATUS.INIT)

export const setAppStatusLoading = () => appStatus.set(APP_STATUS.LOADING)

export const setAppStatusError = () => appStatus.set(APP_STATUS.ERROR)

export const setAppStatusChatMode = () => appStatus.set(APP_STATUS.CHAT_MODE)
