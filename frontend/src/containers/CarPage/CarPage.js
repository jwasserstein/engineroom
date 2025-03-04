import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import UserAside from '../../components/UserAside';
import Button from '../../components/Button';
import DetailedCar from '../../components/DetailedCar';
import Message from '../../components/Message';
import {toggleFriend, getUsers} from '../../store/actions/users';
import {getCars} from '../../store/actions/cars';
import './CarPage.css';

class CarPage extends Component {
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
        const {authReducer, userReducer, carReducer, match, getUsers, getCars} = this.props;

        // Check for missing data: loggedInUser, wall user or wall user's cars
        const missingUsers = [];
        if(!(authReducer.userId in userReducer.users)) missingUsers.push(authReducer.userId);
        if(!(match.params.userId in userReducer.users)) missingUsers.push(match.params.userId);
        if(missingUsers.length !== 0) {
            this.setState({...this.state, fetching: this.state.fetching+1});
            getUsers(missingUsers)
                .then(() => {
                    this.setState({...this.state, fetching: this.state.fetching-1});
                    const user = this.props.userReducer.users[match.params.userId];
                    const missingCars = user.cars.filter(f => !(f in carReducer.cars));
                    if(missingCars.length !== 0) {
                        this.setState({...this.state, fetching: this.state.fetching+1});
                        getCars(missingCars)
                            .then(() => this.setState({...this.state, fetching: this.state.fetching-1}))
                            .catch(err => this.setState({...this.state, error: err, fetching: this.state.fetching-1}));
                    }
                })
                .catch(err => this.setState({...this.state, error: err, fetching: this.state.fetching-1}));
        } else {
            const user = this.props.userReducer.users[match.params.userId];
            const missingCars = user.cars.filter(f => !(f in carReducer.cars));
            if(missingCars.length !== 0) {
                this.setState({...this.state, fetching: this.state.fetching+1});
                getCars(missingCars)
                    .then(() => this.setState({...this.state, fetching: this.state.fetching-1}))
                    .catch(err => this.setState({...this.state, error: err, fetching: this.state.fetching-1}));
            }
        }
    }

    componentDidMount() {
        document.title = 'EngineRoom | Cars';
        this.checkMissingData();
    }

    componentDidUpdate() {
        if(this.state.fetching === 0 && this.state.error === '') {
            this.checkMissingData();
        }
    }

    onFriend(friendId){
        this.props.toggleFriend(friendId);
    }

    onClearError() {
		this.setState({...this.state, error: ''});
	}

    render() {
        const {userReducer, authReducer, carReducer, match} = this.props;
        const {error} = this.state;
        const user = userReducer.users[match.params.userId] || {cars: [], post: [], friends: []};
        const loggedInUser = userReducer.users[authReducer.userId] || {cars: [], posts: [], friends: []};

        // Create car elements here
        const carElements = user.cars.map(id => {
            const c = carReducer.cars[id] || {_id: id, name: '', imageUrl: '', mods: '', accelTime: '', power: '', torque: ''};
            return (<DetailedCar 
                name={c.name}
                imageUrl={c.imageUrl}
                mods={c.mods}
                accelTime={c.accelTime}
                power={c.power}
                torque={c.torque}
                key={c._id}
            />);
        });

        return (
            <div className='CarPage-container'>
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
                <div className='CarPage-inner-container'>
                    {error && (<Message color='red' onClearError={this.onClearError}>{error}</Message>)}
                    <div className='CarPage-title-container'>
                        <div className='CarPage-title CarPage-blob'>
                            <h2>Cars</h2>
                            <p>View {user.firstName}'s cars</p>
                        </div>
                        {match.params.userId === authReducer.userId && (
                            <Button className='CarPage-add-btn' to={`/users/${authReducer.userId}/cars/new`}>Add Car</Button>
                        )}
                    </div>
                    
                    <div className='CarPage-people-container'>
                        {carElements}
                    </div>
                </div>
                <div className='CarPage-spacer'></div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        userReducer: state.userReducer,
        authReducer: state.authReducer,
        carReducer: state.carReducer,
    };
}

CarPage.propTypes = {
    userReducer: PropTypes.object.isRequired,
    authReducer: PropTypes.object.isRequired,
    carReducer: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    toggleFriend: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {toggleFriend, getUsers, getCars})(CarPage);