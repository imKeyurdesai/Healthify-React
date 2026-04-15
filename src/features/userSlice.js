import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedin: false,
        userdata: {},
        isAuthChecked: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.isLoggedin = true;
            state.userdata = action.payload;
            state.isAuthChecked = true;
        },
        clearUser: (state) => {
            state.isLoggedin = false;
            state.userdata = {};
            state.isAuthChecked = true;
        },
        setAuthChecked: (state) => {
            state.isAuthChecked = true;
        }
    }
})

export const { setUser, clearUser, setAuthChecked } = userSlice.actions
export default userSlice.reducer