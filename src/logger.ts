import NewNoteDetector, { ICountState } from "./new-note-detector"

const onUpdate = (state: ICountState): void =>
{
	const dateString = new Date().toLocaleString("ja-JP")

	switch (state.hasValueChanged)
	{
	case false:
		console.log(`\u001b[32m[LOG]    \u001b[0m${dateString} \u001b[33m${state.current}`)
		break

	case true:
		console.log(`\u001b[31m[DETECT] \u001b[34m${dateString} \u001b[33m${state.current}`)
		break

	default:
		throw new Error("Unexpected case executed.")
	}
}

const newNoteDetector = new NewNoteDetector(onUpdate)
newNoteDetector.start()
