import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {},
    reducers: {
        setUser: (state, action) => {
            state.isLoggedin = true;
            state.userdata = action.payload;
        },
        clearUser: (state) => {
            state.isLoggedin = false;
            state.userdata = {};
        }
    }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer