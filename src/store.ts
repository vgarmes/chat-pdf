import { writable } from 'svelte/store'

export const APP_STATUS = {
	INIT: 'INIT',
	LOADING: 'LOADING',
	CHAT_MODE: 'CHAT_MODE',
	ERROR: 'ERROR'
}

const initialPdf = {
	id: '498fc4bd6249b8721d3fc9a132e50de5',
	pages: 2,
	url: 'https://res.cloudinary.com/dwhjuqfar/image/upload/v1707052849/pdf/ato5ryt8joasjfyxnfec.pdf'
}

const defaultPdf = { id: '', url: '', pages: 0 }

export const appStatus = writable(APP_STATUS.CHAT_MODE)
export const appStatusInfo = writable(initialPdf)

export const setAppStatusLoading = () => appStatus.set(APP_STATUS.LOADING)

export const setAppStatusError = () => appStatus.set(APP_STATUS.ERROR)

export const setAppStatusChatMode = ({
	id,
	url,
	pages
}: {
	id: string
	url: string
	pages: number
}) => {
	appStatus.set(APP_STATUS.CHAT_MODE)
	appStatusInfo.set({ id, url, pages })
}
