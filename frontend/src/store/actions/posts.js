import {apiCall} from '../../services/api';
import {GET_POSTS, ADD_POST, GET_FEED_POSTS, GET_USERS} from '../actionTypes';

export function getPosts(ids) {
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				let path = '/posts';
				if(ids && ids.length > 0){
					path += '?ids=' + JSON.stringify(ids);
				}
				const resp = await apiCall('get', path);
				if(resp.error){
					return reject(resp.error);
				}

				const postObj = {};
				for(let i = 0; i < resp.posts.length; i++){
					postObj[resp.posts[i]._id] = resp.posts[i];
				}

				const userObj = {};
				for(let i = 0 ; i < resp.users.length; i++){
					userObj[resp.users[i]._id] = resp.users[i];
				}

				dispatch({type: GET_POSTS, posts: postObj});
				dispatch({type: GET_USERS, users: userObj});
				if('feedPostIds' in resp) dispatch({type: GET_FEED_POSTS, feedPostIds: resp.feedPostIds});
				return resolve();
			} catch(err) {
				return reject(err.message);
			}
		});
	}
}

export function togglePostLike(postId) {
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				const resp = await apiCall('post', `/posts/${postId}/like`);
				if(resp.error){
					return reject(resp.error);
				}

				const postObj = {};
				for(let i = 0; i < resp.posts.length; i++){
					postObj[resp.posts[i]._id] = resp.posts[i];
				}

				dispatch({type: GET_POSTS, posts: postObj});
				return resolve();
			} catch(err) {
				return reject(err.message);
			}
		});
	}
}

export function createPost(text) {
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				const resp = await apiCall('post', `/posts`, {text});
				if(resp.error){
					return reject(resp.error);
				}

				const postObj = {};
				const newPostIds = [];
				for(let i = 0; i < resp.posts.length; i++){
					postObj[resp.posts[i]._id] = resp.posts[i];
					newPostIds.push(resp.posts[i]._id);
				}
				dispatch({type: GET_POSTS, posts: postObj});
				dispatch({type: ADD_POST, newPostIds: newPostIds});

				const userObj = {};
				for(let i = 0; i < resp.users.length; i++){
					userObj[resp.users[i]._id] = resp.users[i];
				}
				dispatch({type: GET_USERS, users: userObj});
				return resolve();
			} catch(err) {
				return reject(err.message);
			}
		});
	}
}

export function createComment(text, postId) {
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				const resp = await apiCall('post', `/posts/${postId}/comments`, {text});
				if(resp.error){
					return reject(resp.error);
				}

				const postObj = {};
				for(let i = 0; i < resp.posts.length; i++){
					postObj[resp.posts[i]._id] = resp.posts[i];
				}

				dispatch({type: GET_POSTS, posts: postObj});
				return resolve();
			} catch(err) {
				return reject(err.message);
			}
		});
	}
}

export function deleteComment(commentId, postId) {
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				const resp = await apiCall('delete', `/posts/${postId}/comments/${commentId}`);
				if(resp.error){
					return reject(resp.error);
				}
				
				const postObj = {};
				for(let i = 0; i < resp.posts.length; i++){
					postObj[resp.posts[i]._id] = resp.posts[i];
				}

				dispatch({type: GET_POSTS, posts: postObj});

				return resolve();
			} catch(err) {
				return reject(err.message);
			}
		});
	}
}