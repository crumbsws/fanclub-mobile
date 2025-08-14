import { createSlice } from '@reduxjs/toolkit';

interface User {
                id: string,
                username: string,
                email: string,
                school: string,
                biography: string,
                created_at: string,
                level: number,
                image: string | null
}

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;