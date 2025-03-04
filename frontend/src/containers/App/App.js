import React, {Component} from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import {logOut} from '../../store/actions/auth';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import withAuth from '../../hocs/withAuth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LandingPage from '../LandingPage';
import AboutPage from '../AboutPage';
import SignupPage from '../SignupPage';
import LoginPage from '../LoginPage';
import ExplorePage from '../ExplorePage';
import FeedPage from '../FeedPage';
import WallPage from '../WallPage';
import FriendPage from '../FriendPage';
import ProfilePage from '../ProfilePage';
import PasswordPage from '../PasswordPage';
import CarPage from '../CarPage';
import NewCarPage from '../NewCarPage';
import EditProfilePage from '../EditProfilePage';
import './App.css';

class App extends Component {
    componentDidMount(){
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions(){
        const html = document.querySelector('html');
        html.style.minHeight = `${window.innerHeight}px`;
    }
    
    render() {
        const {username, userId, logOut} = this.props;

        return (
            <div className="App">
                <Router>
                    <Navbar username={username} userId={userId} logOut={logOut} />
                    <Switch>
                        <Route path='/editProfile' component={withAuth(EditProfilePage)} />
                        <Route path='/password' component={withAuth(PasswordPage)} />
                        <Route path='/profile' component={withAuth(ProfilePage)} />
                        <Route path='/users/:userId?/cars/new' component={withAuth(NewCarPage)} />
                        <Route path='/users/:userId?/cars' component={withAuth(CarPage)} />
                        <Route path='/users/:userId?/friends' component={withAuth(FriendPage)} />
                        <Route path='/users/:userId?' component={withAuth(WallPage)} />
                        <Route path='/feed' component={withAuth(FeedPage)} />
                        <Route path='/explore' component={withAuth(ExplorePage)} />
                        <Route path='/login' component={LoginPage} />
                        <Route path='/signup' component={SignupPage} />
                        <Route path='/about' component={AboutPage} />
                        <Route path='/' component={LandingPage} />
                    </Switch>
                    <Footer />
                </Router>
            </div>
        );
    }
}

function mapStateToProps(state){
	return {
        username: state?.authReducer?.username,
        userId: state?.authReducer?.userId,
	};
}

App.propTypes = {
    username: PropTypes.string,
    userId: PropTypes.string,
	logOut: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {logOut})(App);
