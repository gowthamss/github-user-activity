import {returnError} from './errors.js';

export const makeFetchCall = async (url, headers={}) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('The username provided is invalid. Please provide a valid username');
        }
        return response.json();
    } catch (err) {
        returnError(err.message);
    }
};