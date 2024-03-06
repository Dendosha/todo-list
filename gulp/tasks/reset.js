import paths from "../config/paths.js";
import { deleteAsync } from "del";

const reset = () => {
	if (app.isProduction) {
		return deleteAsync(paths.buildFolder)
	} else {
		return deleteAsync(paths.devFolder)
	}
}

export default reset