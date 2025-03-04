import {LOG_OUT, LOG_IN} from '../actionTypes';

const DEFAULT_STATE = {
	userId: '',
	username: '',
	awsIdentityId: ''
}

export function authReducer(state=DEFAULT_STATE, action){
	switch (action.type){
		case LOG_IN:
			return {...state, userId: action.id, username: action.username, awsIdentityId: action.awsIdentityId};
		case LOG_OUT:
			return DEFAULT_STATE;
		default: 
			return state;
	}
}