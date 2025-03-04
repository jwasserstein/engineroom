import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getPosts, createPost, togglePostLike, createComment, deleteComment} from '../../store/actions/posts';
import {getRandomUsers, getUsers} from '../../store/actions/users';
import {getRandomCars} from '../../store/actions/cars';
import Car from '../../components/Car';
import User from '../../components/User';
import Post from '../../components/Post';
import Message from '../../components/Message';
import './FeedPage.css';

class FeedPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            postText: '',
            fetching: 0,
            error: ''
        };

        this.checkMissingData = this.checkMissingData.bind(this);
        this.onLike = this.onLike.bind(this);
        this.onPostSubmit = this.onPostSubmit.bind(this);
        this.onCommentSubmit = this.onCommentSubmit.bind(this);
        this.onCommentDelete = this.onCommentDelete.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClearError = this.onClearError.bind(this);
    }

    checkMissingData(){
        const {authReducer, userReducer, postReducer, carReducer, 
            getUsers, getPosts, getRandomUsers, getRandomCars} = this.props;
        let {fetching} = this.state;

        if(!(authReducer.userId in userReducer.users)){
            fetching++;
            getUsers([authReducer.userId])
                .catch(err => this.setState({...this.state, error: err}))
                .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
        }
        if(postReducer.feedPostIds.lastUpdated === 0) {
            fetching++;
            getPosts()
                .catch(err => this.setState({...this.state, error: err}))
                .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
        }
        if(userReducer.randomUserIds.lastUpdated === 0){
            fetching++;
            getRandomUsers(6)
                .catch(err => this.setState({...this.state, error: err}))
                .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
        }
        if(carReducer.randomCarIds.lastUpdated === 0){
            fetching++;
            getRandomCars(4)
                .catch(err => this.setState({...this.state, error: err}))
                .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
        }
        if(fetching !== this.state.fetching){
            this.setState({...this.state, fetching: fetching});
        }
    }

    componentDidMount(){
        document.title = 'EngineRoom | Feed';
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

    onPostSubmit(e){
        e.preventDefault();
        this.setState({...this.state, fetching: this.state.fetching+1});
        this.props.createPost(this.state.postText)
            .catch(err => this.setState({...this.state, error: err}))
            .finally(() => this.setState({...this.state, fetching: this.state.fetching-1, postText: ''}));
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

    onChange(e){
        this.setState({...this.state, [e.target.name]: e.target.value});
    }

    onClearError() {
		this.setState({...this.state, error: ''});
	}

    render() {
        const {authReducer, postReducer, userReducer, carReducer} = this.props;
        const {postText, error} = this.state;
        const user = userReducer.users[authReducer.userId] || {};
        const randomCarIds = carReducer.randomCarIds.ids || [];
        const randomUserIds = userReducer.randomUserIds.ids || [];
        const feedPostIds = postReducer.feedPostIds.ids || [];

        const carElements = randomCarIds.map(id => {
            const c = carReducer.cars[id] || {_id: id, name: '', imageUrl: '', userId: ''};
            return (
                <Car name={c.name} imageUrl={c.imageUrl} userId={c.user} key={c._id} width='200'/>
            )
        });
        const userElements = randomUserIds.map(id => {
            const u = userReducer.users[id] || {_id: id, firstName: '', lastName: '', imageUrl: ''};
            return (
                <User firstName={u.firstName} lastName={u.lastName} imageUrl={u.imageUrl} id={u._id} key={u._id} width='125'/>
            )
        });

        const postElements = feedPostIds.map(id => {
            const p = postReducer.posts[id] || {_id: id, user: '', date: '', text: '', likers: [], comments: []};
            return (
                <Post 
                    postId={p._id}
                    postUser={userReducer.users[p.user]}
                    postDate={p.date}
                    postText={p.text}
                    postLikes={p.likers}
                    postComments={p.comments}
                    loggedInUserId={user._id}
                    users={userReducer.users}
                    onLike={this.onLike}
                    onCommentSubmit={this.onCommentSubmit}
                    onCommentDelete={this.onCommentDelete}
                    key={p._id}
                />
            )
        });

        return (
            <div className='FeedPage-container'>
                <div className='FeedPage-friends-container'>
                    {error && (<Message color='red' onClearError={this.onClearError}>{error}</Message>)}
                    <div className='FeedPage-title FeedPage-blob'>
                        <h2>Explore Friends</h2>
                        <p>Find new friends</p>
                    </div>
                    <div className='FeedPage-people-container'>
                        {userElements.length > 0 ? userElements : (
                            <div className='FeedPage-no-elements FeedPage-blob'>
                                <p>There aren't any users to show</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className='FeedPage-feed-container'>
                    <div className='FeedPage-title FeedPage-blob'>
                        <h2>Your Feed</h2>
                        <p>See what your friends are talking about</p>
                    </div>
                    <form className='FeedPage-post-form FeedPage-blob' onSubmit={this.onPostSubmit}>
                        <img src={user.imageUrl} alt='User Profile' />
                        <textarea placeholder='Add a post...' name='postText' value={postText} onChange={this.onChange}></textarea>
                        <button><i className="fa fa-arrow-right" aria-hidden="true"></i></button>
                    </form>
                    {postElements.length > 0 ? postElements : (
                        <div className='FeedPage-no-elements FeedPage-blob'>
                            <p>There aren't any posts to show</p>
                        </div>
                    )}
                </div>
                <div className='FeedPage-cars-container'>
                    <div className='FeedPage-title FeedPage-blob'>
                        <h2>Explore Cars</h2>
                        <p>View other user's cars</p>
                    </div>
                    <div className='FeedPage-car-container'>
                        {carElements.length > 0 ? carElements : (
                            <div className='FeedPage-no-elements FeedPage-blob'>
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
        authReducer: state.authReducer,
        postReducer: state.postReducer,
        userReducer: state.userReducer,
        carReducer: state.carReducer
    };
}

FeedPage.propTypes = {
    postReducer: PropTypes.object,
    userReducer: PropTypes.object,
    carReducer: PropTypes.object,
    getPosts: PropTypes.func.isRequired,
    getRandomUsers: PropTypes.func.isRequired,
    getRandomCars: PropTypes.func.isRequired,
    togglePostLike: PropTypes.func.isRequired,
    createComment: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {getPosts, getRandomUsers, getRandomCars, togglePostLike, 
                                        createPost, createComment, deleteComment, getUsers})(FeedPage);