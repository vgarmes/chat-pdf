import type { APIRoute } from 'astro'
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'

cloudinary.config({
	cloud_name: import.meta.env.CLOUD_NAME,
	api_key: import.meta.env.API_KEY,
	api_secret: import.meta.env.API_SECRET
})

const uploadStream = async (
	buffer: Uint8Array,
	options: {
		folder: string
		ocr?: string
	}
): Promise<UploadApiResponse> => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(options, (error, result) => {
				if (result) return resolve(result)
				reject(error)
			})
			//@ts-ignore
			.end(buffer)
	})
}

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData()
	const file = formData.get('file') as File

	if (file == null) {
		return new Response('No file found', { status: 400 })
	}

	const arrayBuffer = await file.arrayBuffer()
	const uint8Array = new Uint8Array(arrayBuffer)

	const result = await uploadStream(uint8Array, {
		folder: 'pdf'
	})

	const { asset_id: id, secure_url: url, pages } = result

	return new Response(
		JSON.stringify({
			id,
			url,
			pages
		})
	)
}
