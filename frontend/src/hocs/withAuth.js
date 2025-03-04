import React, {Component} from 'react';
import {connect} from 'react-redux';

function withAuth(ComponentToRender){
	class Authenticate extends Component {
		componentDidMount(){
			if(!this.props.userId){
				this.props.history.push('/login');
			}
		}
		
		componentDidUpdate(){
			if(!this.props.userId){
				this.props.history.push('/login');
			}
		}
		
		render(){
			if(!this.props.userId){
				return <div>Loading...</div>;
			} else {
				return <ComponentToRender {...this.props} />;
			}
		}
	}
	
	function mapStateToProps(state){
		return {
			userId: state.authReducer.userId
		};
	}
	
	return connect(mapStateToProps)(Authenticate);
}

export default withAuth;