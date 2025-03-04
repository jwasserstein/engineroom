import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import {Provider} from 'react-redux';
import {configureStore} from './store';
import jwtdecode from 'jwt-decode';
import {LOG_IN} from './store/actionTypes';
import reportWebVitals from './reportWebVitals';

const store = configureStore();

// If token already exists and isn't expired, log in
if(localStorage.getItem('token')){
	const decoded = jwtdecode(localStorage.getItem('token'));
	if(Date.now()/1000 - decoded.iat < 3600){
        store.dispatch({type: LOG_IN, id: decoded.id, username: decoded.username, awsIdentityId: decoded.awsIdentityId});
	} else {
		localStorage.removeItem('token');
	}
}

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
