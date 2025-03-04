import {combineReducers} from 'redux';
import {authReducer} from './auth';
import {postReducer} from './posts';
import {carReducer} from './cars';
import {userReducer} from './users';

const rootReducer = combineReducers({
    authReducer,
    postReducer,
    carReducer,
    userReducer
});

export default rootReducer;