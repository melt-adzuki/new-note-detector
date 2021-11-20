import * as dotenv from "dotenv"
import NewNoteDetector, { ICountState } from "./new-note-detector"
import axios from "axios"

dotenv.config()

const onUpdate = (state: ICountState) =>
{
	if (state.hasValueChanged)
	{
		axios.post(
			`https://maker.ifttt.com/trigger/new_note_detected/with/key/${process.env.WEBHOOK_KEY}`,
			{ value1: process.env.TARGET_USERNAME },
		)
			.catch(error => console.log(`\u001b[35m[WARNING] \u001b[0m${error}`))
	}
}

const newNoteDetector = new NewNoteDetector({ log: true }, onUpdate)
newNoteDetector.start()
