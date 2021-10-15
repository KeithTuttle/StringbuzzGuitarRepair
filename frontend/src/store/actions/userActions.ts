import { User } from "../../viewModels/UserWithErrorMessage";
import dispatcher from "../dispatcher";

export function setUser(user: User) {
    dispatcher.dispatch({
        type: "SET_USER",
        user,
    });
}