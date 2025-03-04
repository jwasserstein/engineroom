import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export function configureStore(){
	let middleware;
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	if(process.env.NODE_ENV === 'development'){
		middleware = composeEnhancers(applyMiddleware(thunk));
	} else {
		middleware = applyMiddleware(thunk);
	}

	return createStore(
		rootReducer, 
		middleware
	);
}