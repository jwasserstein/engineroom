import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getRandomUsers} from '../../store/actions/users';
import {getRandomCars} from '../../store/actions/cars';
import User from '../../components/User';
import Car from '../../components/Car';
import Message from '../../components/Message';
import './ExplorePage.css';

class ExplorePage extends Component {
    constructor(props){
        super(props);

        this.state = {
            fetching: 0,
            error: ''
        };

        this.checkMissingData = this.checkMissingData.bind(this);
        this.onClearError = this.onClearError.bind(this);
    }

    checkMissingData() {
        let {fetching} = this.state;
        if(this.props.userReducer.randomUserIds.lastUpdated === 0){
            fetching++;
            this.props.getRandomUsers(6)
                .catch(err => this.setState({...this.state, error: err}))
                .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
        }
        if(this.props.carReducer.randomCarIds.lastUpdated === 0){
            fetching++;
            this.props.getRandomCars(4)
                .catch(err => this.setState({...this.state, error: err}))
                .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
        }
        if(fetching !== this.state.fetching){
            this.setState({...this.state, fetching: fetching});
        }
    }

    componentDidMount(){
        document.title = 'EngineRoom | Explore';
        this.checkMissingData();
    }

    componentDidUpdate(){
        if(this.state.fetching === 0 && this.state.error === ''){
            this.checkMissingData();
        }
    }

    onClearError() {
		this.setState({...this.state, error: ''});
	}

    render() {
        const {carReducer, userReducer} = this.props;
        const {error} = this.state;
        const randomCarIds = carReducer.randomCarIds.ids || [];
        const randomUserIds = userReducer.randomUserIds.ids || [];
        
        const carElements = randomCarIds.map(id => {
            const c = carReducer.cars[id] || {_id: id, name: '', imageUrl: '', userId: ''};
            return (
                <Car name={c.name} imageUrl={c.imageUrl} userId={c.user} key={c._id} style={{marginLeft: '7.5px', marginRight: '7.5px'}}/>
            )
        });
        const userElements = randomUserIds.map(id => {
            const u = userReducer.users[id] || {_id: id, firstName: '', lastName: '', imageUrl: ''};
            return (
                <User firstName={u.firstName} lastName={u.lastName} imageUrl={u.imageUrl} id={u._id} key={u._id} />
            )
        });

        return (
            <div className='ExplorePage-container'>
                <div className='ExplorePage-inner-container'>
                    {error && (<Message color='red' onClearError={this.onClearError}>{error}</Message>)}
                    <div className='ExplorePage-title ExplorePage-blob'>
                        <h2>People</h2>
                        <p>View a random selection of EngineRoom users</p>
                    </div>
                    <div className='ExplorePage-people-container'>
                        {userElements.length > 0 ? userElements : (
                            <div className='ExplorePage-no-elements ExplorePage-blob'>
                                <p>There aren't any users to show</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className='ExplorePage-inner-container'>
                    <div className='ExplorePage-title ExplorePage-blob'>
                        <h2>Cars</h2>
                        <p>View a random selection of EngineRoom users' cars</p>
                    </div>
                    <div className='ExplorePage-car-container'>
                        {carElements.length > 0 ? carElements : (
                            <div className='ExplorePage-no-elements ExplorePage-blob'>
                                <p>There aren't any cars to show</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        userReducer: state.userReducer,
        carReducer: state.carReducer
    };
}

ExplorePage.propTypes = {
    getRandomCars: PropTypes.func.isRequired,
    getRandomUsers: PropTypes.func.isRequired,
    userReducer: PropTypes.object,
    carReducer: PropTypes.object
};

export default connect(mapStateToProps, {getRandomCars, getRandomUsers})(ExplorePage);