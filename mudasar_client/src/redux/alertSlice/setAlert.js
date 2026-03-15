import {store} from "../store"
import { addAlert } from "./alertSlice"
const setAlert = (msg, type) => {
    store.dispatch(addAlert({msg: msg, type: type}))
}

export default setAlert