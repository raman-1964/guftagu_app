import { combineReducers } from "redux";
import { noteReducer } from "./noteReducer";
import { userReducer } from "./userReducer";
import { loginReducer } from "./loginReducer";
import { chatReducer } from "./chatReducer";
import { messageReducer } from "./messageReducer";

const rootReducer = combineReducers({
  noteReducer,
  userReducer,
  loginReducer,
  messageReducer,
  chatReducer,
});

export default rootReducer;
