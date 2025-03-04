import {GET_USERS, REMOVE_USERS, GET_RANDOM_USERS} from '../actionTypes';

const DEFAULT_STATE = {
	users: {},
	randomUserIds: {ids: [], lastUpdated: 0}
}

export function userReducer(state=DEFAULT_STATE, action){
	switch (action.type){
		case GET_USERS:
			return {...state, users: {...state.users, ...action.users}};
		case REMOVE_USERS:
			return DEFAULT_STATE;
		case GET_RANDOM_USERS:
			return {...state, randomUserIds: {ids: action.randomUserIds, lastUpdated: Date.now()}};
		default: 
			return state;
	}
}