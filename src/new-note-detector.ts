import * as dotenv from "dotenv"
import fetch from "node-fetch"

dotenv.config()

namespace MisskeyApi {
	export interface User {
		notesCount: number,
	}
}

const getNotesCount = async (): Promise<number | undefined> =>
{
	const response = await fetch(
		"https://misskey.io/api/users/show",
		{
			body: JSON.stringify({ username: process.env.TARGET_USERNAME }),
			method: "POST",
		},
	)

	const jsonData = await response.json() as MisskeyApi.User
	return jsonData.notesCount
}

export interface ICountState {
	hasValueChanged: boolean,
	previous?: number,
	current?: number,
}

export default class NewNoteDetector implements ICountState
{
	public hasValueChanged = false
	public previous?: number
	public current?: number

	constructor(
		private config: { log: boolean },
		private hook?: (state: ICountState) => void,
	)
	{ }

	private async update()
	{
		this.previous = this.current
		this.current = await getNotesCount()

		this.hasValueChanged = typeof this.previous === "undefined" || typeof this.current === "undefined"
			? false
			: this.previous < this.current

		if (this.hook) this.hook(this)
	}

	private log()
	{
		const dateString = new Date().toLocaleString("ja-JP")

		switch (this.hasValueChanged)
		{
		case false:
			console.log(`\u001b[32m[LOG]    \u001b[0m${dateString} \u001b[33m${this.current}`)
			break

		case true:
			console.log(`\u001b[31m[DETECT] \u001b[34m${dateString} \u001b[33m${this.current}`)
			break

		default:
			throw new Error("Unexpected case executed.")
		}
	}

	public start()
	{
		setInterval(
			async () =>
			{
				await this.update()
				if (this.config.log) this.log()
			},
			Number(process.env.INTERVAL_SECONDS) * 1000,
		)
	}
}
