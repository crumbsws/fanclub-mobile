import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {User, Project} from "@/types/types";

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
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        },
        updateUser(state, action: PayloadAction<Partial<User>>) {
            if (state.user) {
                Object.assign(state.user, action.payload);
            }
        },
        addProject(state, action: PayloadAction<Project>) {
            if (state.user) {
                state.user.projects.push(action.payload);
            }
        },
        addOwnProject(state, action: PayloadAction<Project>) {
            if (state.user) {
                state.user.self_projects.push(action.payload);
            }
        },
    }
});

export const { setUser, clearUser, updateUser, addProject, addOwnProject } = userSlice.actions;
export default userSlice.reducer;