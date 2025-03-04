import {GET_USERS, GET_RANDOM_USERS, GET_CARS, GET_POSTS} from '../actionTypes';
import {apiCall} from '../../services/api';

export function getRandomUsers(n){
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				const resp = await apiCall('get', `/users/random/${n}`);
				if(resp.error){
					return reject(resp.error);
				}

				const userObj = {};
				for(let i = 0; i < resp.users.length; i++){
					userObj[resp.users[i]._id] = resp.users[i];
				}
				
				dispatch({type: GET_USERS, users: userObj});
				dispatch({type: GET_RANDOM_USERS, randomUserIds: resp.randomUserIds});
				return resolve();
			} catch(err) {
				return reject(err.message);
			}
		});
	}
}

export function getUsers(userIds, cars, posts){
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				let path = `/users?ids=${JSON.stringify(userIds)}`;
				if(cars) path += '&cars=true';
				if(posts) path += '&posts=true';
				const resp = await apiCall('get', path);
				if(resp.error){
					return reject(resp.error);
				}
				
				const userObj = {};
				for(let i = 0; i < resp.users.length; i++){
					userObj[resp.users[i]._id] = resp.users[i];
				}
				dispatch({type: GET_USERS, users: userObj});

				if('cars' in resp){
					const carObj = {};
					for(let i = 0; i < resp.cars.length; i++){
						carObj[resp.cars[i]._id] = resp.cars[i];
					}
					dispatch({type: GET_CARS, cars: carObj});
				}

				if('posts' in resp){
					const postObj = {};
					for(let i = 0; i < resp.posts.length; i++){
						postObj[resp.posts[i]._id] = resp.posts[i];
					}
					dispatch({type: GET_POSTS, posts: postObj});
				}
				return resolve();
			} catch(err) {
				return reject(err.message);
			}
		});
	}
}

export function toggleFriend(friendId){
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				const resp = await apiCall('post', `/users/${friendId}/friend`);
				if(resp.error){
					return reject(resp.error);
				}

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

export function editProfile(firstName, lastName, bio, imageUrl){
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				const resp = await apiCall('put', '/users', {firstName, lastName, bio, imageUrl});
				if(resp.error){
					return reject(resp.error);
				}

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