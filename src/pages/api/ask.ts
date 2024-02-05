import { type APIRoute } from 'astro'
import OpenAI from 'openai'
import { readFile } from 'node:fs/promises'
import { responseSSE } from '../../utils/sse'

const openai = new OpenAI({
	apiKey: import.meta.env.OPENAI_KEY
})
export const GET: APIRoute = async ({ request }) => {
	const url = new URL(request.url)
	const id = url.searchParams.get('id')
	const question = url.searchParams.get('question')

	if (!id) {
		return new Response('Missing id', { status: 400 })
	}

	if (!question) {
		return new Response('Missing question', { status: 400 })
	}

	const txt = await readFile(`public/text/${id}.txt`, 'utf-8')

	return responseSSE({ request }, async sendEvent => {
		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo-16k',
			stream: true,
			messages: [
				{ role: 'system', content: '' },
				{
					role: 'user',
					content: `<context>${txt}</context><question>${question}</question>`
				}
			]
		})

		for await (const part of response) {
			sendEvent(part.choices[0].delta.content)
		}

		sendEvent('__END__')
	})
}
