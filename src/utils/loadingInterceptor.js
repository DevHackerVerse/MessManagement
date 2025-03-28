// utils/loadingInterceptor.js
import axios from 'axios';
import { store } from '../redux/store'; // If using Redux
import { setLoading } from '../redux/loadingSlice';

export const setupLoadingInterceptors = () => {
    axios.interceptors.request.use(
        config => {
            store.dispatch(setLoading(true));
            return config;
        },
        error => {
            store.dispatch(setLoading(false));
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        response => {
            store.dispatch(setLoading(false));
            return response;
        },
        error => {
            store.dispatch(setLoading(false));
            return Promise.reject(error);
        }
    );
};