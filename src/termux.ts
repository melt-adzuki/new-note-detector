import NewNoteDetector, { ICountState } from "./new-note-detector"
import { exec } from "child_process"

const onUpdate = (state: ICountState): void =>
{
	if (state.hasValueChanged) exec("termux-notification -t 'Misskey' -c 'New note detected!'")
}

const newNoteDetector = new NewNoteDetector(onUpdate)
newNoteDetector.start()
