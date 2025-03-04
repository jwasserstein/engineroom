import {GET_CARS, REMOVE_CARS, GET_RANDOM_CARS} from '../actionTypes';

const DEFAULT_STATE = {
	cars: {},
	randomCarIds: {ids: [], lastUpdated: 0}
}

export function carReducer(state=DEFAULT_STATE, action){
	switch (action.type){
		case GET_CARS:
			return {...state, cars: {...state.cars, ...action.cars}};
		case REMOVE_CARS:
			return DEFAULT_STATE;
		case GET_RANDOM_CARS:
			return {...state, randomCarIds: {ids: action.randomCarIds, lastUpdated: Date.now()}};
		default: 
			return state;
	}
}