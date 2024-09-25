import { configureStore } from '@reduxjs/toolkit';
import { customReducer } from './reducer'; // Adjust the path if necessary

const store = configureStore({
    reducer: {
        custom: customReducer,
    },
});

export default store;
