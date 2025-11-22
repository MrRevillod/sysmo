import type { APIRoute } from "astro"
import nodemailer from "nodemailer"

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData()

	const name = formData.get("name") as string
	const email = formData.get("email") as string
	const message = formData.get("message") as string

	const transporter = nodemailer.createTransport({
		host: import.meta.env.SMTP_HOST,
		port: Number(import.meta.env.SMTP_PORT),
		secure: false, // true si usas 465
		auth: {
			user: import.meta.env.SMTP_USER,
			pass: import.meta.env.SMTP_PASS,
		},
	})

	try {
		await transporter.sendMail({
			from: `"Web Contact" <${import.meta.env.SMTP_USER}>`,
			to: "tu_correo@dominio.com",
			subject: "Nuevo mensaje del formulario",
			text: `
        Nombre: ${name}
        Email: ${email}
        Mensaje:
        ${message}
      `,
		})

		return new Response(JSON.stringify({ ok: true }), { status: 200 })
	} catch (err) {
		console.error("Error enviando correo", err)
		return new Response(JSON.stringify({ ok: false }), { status: 500 })
	}
}
