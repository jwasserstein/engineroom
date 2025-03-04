import React, {Component} from 'react';
import {apiCall} from '../../services/api';
import Message from '../../components/Message';
import Form from '../../components/Form';
import './PasswordPage.css';

class PasswordPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            repeatNewPassword: '',
            fetching: 0,
            message: '',
            messageColor: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClearError = this.onClearError.bind(this);
    }

    componentDidMount() {
        document.title = 'EngineRoom | Password';
    }

    onChange(e){
        this.setState({...this.state, [e.target.name]: e.target.value});
    }

    onSubmit(e){
        e.preventDefault();

        const {currentPassword, newPassword, repeatNewPassword} = this.state;

        if(newPassword !== repeatNewPassword){
            return this.setState({...this.state, currentPassword: '', newPassword: '', repeatNewPassword: '', 
                                message: 'New passwords must match', messageColor: 'red'});
        }

        this.setState({...this.state, fetching: this.state.fetching+1});
        apiCall('POST', `/auth/changePassword`, {currentPassword: currentPassword, newPassword: newPassword, repeatNewPassword: repeatNewPassword})
            .then(response => {
                    const message = 'error' in response ? response.error : response.message;
                    const color = 'error' in response ? 'red' : 'green';
                    this.setState({message: message, messageColor: color});
            })
            .catch(err => this.setState({message: err.message, messageColor: 'red'}))
            .finally(() => this.setState({...this.state, currentPassword: '', newPassword: '', 
                                        repeatNewPassword: '', fetching: this.state.fetching-1}));
    }

    onClearError() {
		this.setState({...this.state, message: ''});
	}

    render() {
        const {currentPassword, newPassword, repeatNewPassword, 
            message, messageColor, fetching} = this.state;

        const fields = [
            {label: 'Current Password', name: 'currentPassword', type: 'password', value: currentPassword, placeholder: '********'},
            {label: 'New Password', name: 'newPassword', type: 'password', value: newPassword, placeholder: '********'},
            {label: 'Repeat New Password', name: 'repeatNewPassword', type: 'password', value: repeatNewPassword, placeholder: '********'}
        ];

        return (
            <div className='PasswordPage-container'>
                <div className='PasswordPage-title PasswordPage-blob'>
                    <h2>Change Password</h2>
                    <p>Change your EngineRoom password</p>
                </div>
                {message && (<Message color={messageColor} onClearError={this.onClearError}>{message}</Message>)}
                <Form 
                    onSubmit={this.onSubmit} 
                    onChange={this.onChange}
                    fields={fields}
                    loading={fetching !== 0}
                    buttonText='Change Password'
                />
            </div>
        );
    }
}

export default PasswordPage;