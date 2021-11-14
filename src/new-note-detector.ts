import * as dotenv from "dotenv"
import fetch from "node-fetch"

dotenv.config()

namespace MisskeyApi {
	export interface User {
		notesCount: number,
	}
}

const getNotesCount = async (): Promise<number> =>
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
	current: number,
}

export default class NewNoteDetector implements ICountState
{
	public hasValueChanged = false
	public previous?: number
	public current!: number

	constructor(private trigger: (state: ICountState) => void)
	{ }

	private async update()
	{
		this.previous = this.current
		this.current = await getNotesCount()

		this.hasValueChanged = this.previous < this.current

		this.trigger(this)
	}

	public start()
	{
		setInterval(
			async () => { await this.update() },
			Number(process.env.INTERVAL_SECONDS) * 1000,
		)
	}
}
