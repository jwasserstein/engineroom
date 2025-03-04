import {GET_POSTS, ADD_POST, REMOVE_POSTS, GET_FEED_POSTS} from '../actionTypes';

const DEFAULT_STATE = {
	posts: {},
	feedPostIds: {ids: [], lastUpdated: 0}
}

export function postReducer(state=DEFAULT_STATE, action){
	switch (action.type){
		case GET_POSTS:
			return {...state, posts: {...state.posts, ...action.posts}};
		case ADD_POST:
			return {...state, feedPostIds: {ids: [...action.newPostIds, ...state.feedPostIds.ids], lastUpdated: Date.now()}};
		case REMOVE_POSTS:
			return DEFAULT_STATE;
		case GET_FEED_POSTS:
			return {...state, feedPostIds: {ids: action.feedPostIds, lastUpdated: Date.now()}};
		default: 
			return state;
	}
}