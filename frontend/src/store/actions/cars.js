import {apiCall} from '../../services/api';
import {GET_CARS, GET_RANDOM_CARS, GET_USERS} from '../actionTypes';

export function getRandomCars(n) {
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				const resp = await apiCall('get', `/cars/random/${n}`);
				if(resp.error){
					return reject(resp.error);
				}

				const carsObj = {};
				for(let i = 0; i < resp.cars.length; i++){
					carsObj[resp.cars[i]._id] = resp.cars[i];
				}

				dispatch({type: GET_CARS, cars: carsObj});
				dispatch({type: GET_RANDOM_CARS, randomCarIds: resp.randomCarIds});
				return resolve();
			} catch(err) {
				return reject(err.message);
			}
		});
	}
}

export function getCars(ids) {
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				const resp = await apiCall('get', `/cars?ids=${JSON.stringify(ids)}`);
				if(resp.error){
					return reject(resp.error);
				}

				const carsObj = {};
				for(let i = 0; i < resp.cars.length; i++){
					carsObj[resp.cars[i]._id] = resp.cars[i];
				}

				dispatch({type: GET_CARS, cars: carsObj});
				return resolve();
			} catch(err) {
				return reject(err.message);
			}
		});
	}
}

export function addCar(make, model, year, mods, accelTime, power, torque, imageUrl) {
	return dispatch => {
		return new Promise(async (resolve, reject) => {
			try {
				const resp = await apiCall('post', '/cars', {name: `${year} ${make} ${model}`, mods, accelTime, power, torque, imageUrl});
				if(resp.error){
					return reject(resp.error);
				}

				const carsObj = {};
				for(let i = 0; i < resp.cars.length; i++){
					carsObj[resp.cars[i]._id] = resp.cars[i];
				}
				dispatch({type: GET_CARS, cars: carsObj});

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