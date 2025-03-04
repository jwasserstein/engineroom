import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import UserAside from '../../components/UserAside';
import User from '../../components/User';
import Message from '../../components/Message';
import {toggleFriend, getUsers} from '../../store/actions/users';
import './FriendPage.css';

class FriendPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            error: '',
            fetching: 0
        };
        
        this.onFriend = this.onFriend.bind(this);
        this.onClearError = this.onClearError.bind(this);
    }

    checkMissingData() {
        const {authReducer, userReducer, match, getUsers} = this.props;

        // Check for missing data: loggedInUser, wall user or wall user's friends
        let {fetching} = this.state;
        if(!(authReducer.userId in userReducer.users)){
            fetching++;
            getUsers([authReducer.userId])
                .catch(err => this.setState({...this.state, error: err}))
                .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
        }
        if(!(match.params.userId in userReducer.users)) {
            fetching++;
            getUsers([match.params.userId])
                .then(() => {
                    const user = this.props.userReducer.users[match.params.userId];
                    const missingUsers = user.friends.filter(f => !(f in userReducer.users));
                    if(missingUsers.length !== 0) {
                        fetching++;
                        getUsers(missingUsers)
                            .catch(err => this.setState({...this.state, error: err}))
                            .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
                    }
                })
                .catch(err => this.setState({...this.state, error: err}))
                .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
        } else {
            const user = this.props.userReducer.users[match.params.userId];
            const missingUsers = user.friends.filter(f => !(f in userReducer.users));
            if(missingUsers.length !== 0) {
                fetching++;
                getUsers(missingUsers)
                    .catch(err => this.setState({...this.state, error: err}))
                    .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
            }
        }
        if(fetching !== this.state.fetching){
            this.setState({...this.state, fetching: fetching});
        }
    }

    componentDidMount() {
        document.title = 'EngineRoom | Friends';
        this.checkMissingData();
    }

    componentDidUpdate() {
        if(this.state.fetching === 0 && this.state.error === ''){
            this.checkMissingData();
        }
    }

    onFriend(friendId){
        this.setState({...this.state, fetching: this.state.fetching+1});
        this.props.toggleFriend(friendId)
            .catch(err => this.setState({...this.state, error: err}))
            .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
    }

    onClearError() {
		this.setState({...this.state, error: ''});
	}

    render() {
        const {userReducer, authReducer, match} = this.props;
        const {error} = this.state;
        const user = userReducer.users[match.params.userId] || {_id: '', friends: [], firstName: '', lastName: '', imageUrl: ''};
        const loggedInUser = userReducer.users[authReducer.userId] || {_id: '', friends: [], firstName: '', lastName: '', imageUrl: ''};

        const userElements = user.friends.map(id => {
            const u = userReducer.users[id] || {_id: id, firstName: '', lastName: '', imageUrl: ''};
            return (
                <User firstName={u.firstName} lastName={u.lastName} imageUrl={u.imageUrl} id={u._id} key={u._id} width='150'/>
            )
        });

        return (
            <div className='FriendPage-container'>
                <UserAside 
                    firstName={user.firstName}
                    lastName={user.lastName}
                    username={user.username}
                    bio={user.bio}
                    userId={user._id}
                    userImageUrl={user.imageUrl}
                    onFriend={this.onFriend}
                    alreadyFriend={loggedInUser.friends.includes(match.params.userId)}
                    loggedInUserId={authReducer.userId}
                />
                <div className='FriendPage-inner-container'>
                    {error && (<Message color='red' onClearError={this.onClearError}>{error}</Message>)}
                    <div className='FriendPage-title FriendPage-blob'>
                        <h2>Friends</h2>
                        <p>View {user.firstName}'s friends</p>
                    </div>
                    <div className='FriendPage-people-container'>
                        {userElements}
                    </div>
                </div>
                <div className='FriendPage-spacer'></div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        userReducer: state.userReducer,
        authReducer: state.authReducer
    };
}

FriendPage.propTypes = {
    userReducer: PropTypes.object.isRequired,
    authReducer: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    toggleFriend: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {toggleFriend, getUsers})(FriendPage);