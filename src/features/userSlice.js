import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {},
    reducers: {
        setUser: (state, action) => {
            state.status = true;
            state.userdata = action.payload;
        },
        clearUser: (state) => {
            state.status = false;
            state.userdata = {};
        }
    }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer