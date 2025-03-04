import React, {Component} from 'react';
import {connect} from 'react-redux';
import {signUp} from '../../store/actions/auth';
import PropTypes from 'prop-types';
import Form from '../../components/Form';
import Message from '../../components/Message';
import './SignupPage.css';

class SignupPage extends Component {
    constructor(props){
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			username: '',
			password: '',
			repeatPassword: '',
			fetching: 0,
			error: ''
		};

		this.onClearError = this.onClearError.bind(this);
	}

	componentDidMount() {
		document.title = 'EngineRoom | Signup';
	}
	
	onChange = e => {
		this.setState({...this.state, [e.target.name]: e.target.value});
	}
	
	onSubmit = e => {
		e.preventDefault();
		const {password, repeatPassword, username, firstName, lastName} = this.state;

		if(password !== repeatPassword){
			return this.setState({...this.state, error: "Your passwords don't match"});
		}
		this.setState({...this.state, fetching: this.state.fetching+1});
		this.props.signUp(username, password, firstName, lastName)
			.then(() => this.props.history.push('/feed'))
			.catch(err => this.setState({...this.state, fetching: this.state.fetching-1, error: err}));
	}

	onClearError() {
		this.setState({...this.state, error: ''});
	}

    render() {
        const {firstName, lastName, username, password, repeatPassword, error, fetching} = this.state;

		const fields = [
			{label: 'First Name', name: 'firstName', type: 'text', value: firstName, placeholder: 'John'},
			{label: 'Last Name', name: 'lastName', type: 'text', value: lastName, placeholder: 'Doe'},
			{label: 'Username', name: 'username', type: 'text', value: username, placeholder: 'mikeybob123'},
			{label: 'Password', name: 'password', type: 'password', value: password, placeholder: '********'},
			{label: 'Repeat Password', name: 'repeatPassword', type: 'password', value: repeatPassword, placeholder: '********'}
		];

        return (
            <div className='SignupPage-container'>
                <div className='SignupPage-title SignupPage-blob'>
                    <h2>Sign Up</h2>
                    <p>Create an EngineRoom account</p>
                </div>

                {error && (<Message color='red' onClearError={this.onClearError}>{error}</Message>)}
				<Form onSubmit={this.onSubmit} 
						onChange={this.onChange}
						fields={fields}
                        loading={fetching !== 0}
                        buttonText='Sign Up' />
            </div>
        );
    }
}

SignupPage.propTypes = {
	signUp: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired
};

export default connect(null, {signUp})(SignupPage);