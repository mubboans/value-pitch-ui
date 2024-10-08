import { createReducer } from '@reduxjs/toolkit';
import { isUserLogined } from '../helper/helperFn';

const initialState = {
    toastConf: {
        showtoast: false,
        message: "",
        type: ''
    },
    session: isUserLogined(),
    tokenstatus: 'valid', // Adjust as needed
};

export const customReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('showToast', (state, action) => {
            state.toastConf = action.payload;
        })
        .addCase('hideToast', (state, action) => {
            state.toastConf = action.payload;
        })
        .addCase('userState', (state, action) => {
            state.isUserLogin = action.payload;
        })
        .addCase('userSession', (state, action) => {
            state.session = action.payload;
        })
        .addCase('userTokenStatus', (state, action) => {
            state.tokenstatus = action.payload;
        });
});
