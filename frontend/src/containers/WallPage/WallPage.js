import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getUsers, toggleFriend} from '../../store/actions/users';
import {getPosts} from '../../store/actions/posts';
import {getCars} from '../../store/actions/cars';
import {togglePostLike, createComment, deleteComment} from '../../store/actions/posts';
import Car from '../../components/Car';
import Post from '../../components/Post';
import UserAside from '../../components/UserAside';
import Message from '../../components/Message';
import './WallPage.css';

class WallPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            error: '',
            fetching: 0
        };

        this.onLike = this.onLike.bind(this);
        this.onCommentSubmit = this.onCommentSubmit.bind(this);
        this.onCommentDelete = this.onCommentDelete.bind(this);
        this.onFriend = this.onFriend.bind(this);
        this.onClearError = this.onClearError.bind(this);
    }

    checkMissingData(){
        const {authReducer, userReducer, carReducer, postReducer, getUsers, getPosts, getCars, match} = this.props;
        
        // Check for missing data: loggedInUser, wall user, wall user's posts, or wall user's cars
        let {fetching} = this.state;
        if(!(match.params.userId in userReducer.users)) {
            fetching++;
            getUsers([match.params.userId], true, true)
                .catch(err => this.setState({...this.state, error: err}))
                .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
        } else {
            const user = userReducer.users[match.params.userId];
            const missingPosts = user.posts.filter(p => !(p in postReducer.posts));
            if(missingPosts.length > 0){
                fetching++;
                getPosts(missingPosts)
                    .catch(err => this.setState({...this.state, error: err}))
                    .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
            }

            const missingCars = user.cars.filter(c => !(c in carReducer.cars));
            if(missingCars.length > 0){
                fetching++;
                getCars(missingCars)
                    .catch(err => this.setState({...this.state, error: err}))
                    .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
            }
        }
        if(!(authReducer.userId in userReducer.users)) {
            fetching++;
            getUsers([authReducer.userId])
                .catch(err => this.setState({...this.state, error: err}))
                .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
        }
        if(fetching !== this.state.fetching){
            this.setState({...this.state, fetching: fetching});
        }
    }

    componentDidMount(){
        document.title = 'EngineRoom | Wall';
        this.checkMissingData();
    }

    componentDidUpdate(){
        if(this.state.fetching === 0 && this.state.error === ''){
            this.checkMissingData();
        }
    }

    onLike(postId){
        this.setState({...this.state, fetching: this.state.fetching+1});
        this.props.togglePostLike(postId)
            .catch(err => this.setState({...this.state, error: err}))
            .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
    }

    onCommentSubmit(e, text, postId){
        e.preventDefault();
        this.setState({...this.state, fetching: this.state.fetching+1});
        this.props.createComment(text, postId)
            .catch(err => this.setState({...this.state, error: err}))
            .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
    }

    onCommentDelete(commentId, postId){
        this.setState({...this.state, fetching: this.state.fetching+1});
        this.props.deleteComment(commentId, postId)
            .catch(err => this.setState({...this.state, error: err}))
            .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
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
        const {userReducer, carReducer, postReducer, authReducer, match} = this.props;
        const {error} = this.state;
        const user = userReducer.users[match.params.userId] || {_id: '', cars: [], posts: [], friends: [], firstName: '', lastName: '', imageUrl: ''};
        const loggedInUser = userReducer.users[authReducer.userId] || {_id: '', cars: [], posts: [], friends: [], firstName: '', lastName: '', imageUrl: ''};

        const carElements = user.cars.map(id => {
            const c = carReducer.cars[id] || {_id: id, name: '', imageUrl: '', user: ''};
            return (
                <Car name={c.name} imageUrl={c.imageUrl} userId={c.user} key={c._id} width='200'/>
            )
        });
        const postElements = user.posts.map(id => {
            const p = postReducer.posts[id] || {_id: id, date: '', text: '', user: '', likers: [], comments: []};
            const pUser = userReducer.users[p.user] || {_id: '', cars: [], posts: [],  firstName: '', lastName: '', imageUrl: ''};
            return (
                <Post 
                    postId={p._id}
                    postUser={pUser}
                    postDate={p.date}
                    postText={p.text}
                    postLikes={p.likers}
                    postComments={p.comments}
                    loggedInUserId={authReducer.userId}
                    users={userReducer.users}
                    onLike={this.onLike}
                    onCommentSubmit={this.onCommentSubmit}
                    onCommentDelete={this.onCommentDelete}
                    key={p._id}
                />
            )
        });

        return (
            <div className='WallPage-container'>
                {error && (<Message color='red' onClearError={this.onClearError}>{error}</Message>)}
                <div className='WallPage-user-container'>
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
                </div>

                <div className='WallPage-feed-container'>
                    <div className='WallPage-title WallPage-blob'>
                        <h2>{user.firstName}'s Wall</h2>
                        <p>See what's on {user.firstName}'s mind</p>
                    </div>
                    {postElements.length > 0 ? postElements : (
                        <div className='WallPage-no-elements WallPage-blob'>
                            <p>There aren't any posts to show</p>
                        </div>
                    )}
                </div>

                <div className='WallPage-cars-container'>
                    <div className='WallPage-title WallPage-blob'>
                        <h2>{user.firstName}'s Cars</h2>
                    </div>
                    {carElements.length > 0 ? carElements : (
                        <div className='WallPage-no-elements WallPage-blob'>
                        <p>There aren't any cars to show</p>
                    </div>
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        userReducer: state.userReducer,
        carReducer: state.carReducer,
        postReducer: state.postReducer,
        authReducer: state.authReducer
    };
}

WallPage.propTypes = {
    userReducer: PropTypes.object,
    carReducer: PropTypes.object,
    postReducer: PropTypes.object,
    authReducer: PropTypes.object,
    getUsers: PropTypes.func.isRequired,
    togglePostLike: PropTypes.func.isRequired,
    createComment: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
    getPosts: PropTypes.func.isRequired,
    getCars: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {getUsers, togglePostLike, createComment, 
                                        deleteComment, getPosts, getCars, toggleFriend})(WallPage);