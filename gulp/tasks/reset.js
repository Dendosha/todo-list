import paths from "../config/paths.js";
import { deleteAsync } from "del";

const reset = () => {
	return deleteAsync(paths.clean)
}

export default reset