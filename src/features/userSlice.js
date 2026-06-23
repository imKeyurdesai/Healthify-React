import { createSlice } from "@reduxjs/toolkit";

function loadPersistedUser() {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
}

const persistedUser = loadPersistedUser();

const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedin: Boolean(persistedUser),
        userdata: persistedUser || {},
        isAuthChecked: Boolean(persistedUser),
    },
    reducers: {
        setUser: (state, action) => {
            state.isLoggedin = true;
            state.userdata = action.payload;
            state.isAuthChecked = true;

            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(action.payload));
            }
        },
        clearUser: (state) => {
            state.isLoggedin = false;
            state.userdata = {};
            state.isAuthChecked = true;

            if (typeof window !== "undefined") {
                localStorage.removeItem("user");
            }
        },
        setAuthChecked: (state) => {
            state.isAuthChecked = true;
        }
    }
})

export const { setUser, clearUser, setAuthChecked } = userSlice.actions
export default userSlice.reducer