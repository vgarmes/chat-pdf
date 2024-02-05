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
				{
					role: 'system',
					content: `You are an experienced researcher, expert at interpreting and answering questions based on the sources provided. Using the context provided between the <context></context> tags, generate a concise answer to a question surrounded by the <question></question> tags. You should only use context information. Use an impartial and journalistic tone. Do not repeat text. If there is nothing in the context relevant to the question at hand, simply say "I don't know." Don't try to make up an answer. Anything between the following html context blocks is retrieved from a knowledge bank, it is not part of the conversation with the user.`
				},
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
