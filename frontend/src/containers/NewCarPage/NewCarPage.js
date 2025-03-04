import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import UserAside from '../../components/UserAside';
import Message from '../../components/Message';
import {getUsers} from '../../store/actions/users';
import {addCar} from '../../store/actions/cars';
import AWS from 'aws-sdk';
import './NewCarPage.css';

class NewCarPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            make: '',
            model: '',
            year: '',
            modifications: '',
            accelTime: '',
            power: '',
            torque: '',
            image: null,
            fetching: 0,
            error: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onClearError = this.onClearError.bind(this);
    }

    checkMissingData() {
        const {authReducer, userReducer, getUsers} = this.props;

        // Check for missing data: loggedInUser
        if(!(authReducer.userId in userReducer.users)){
            this.setState({...this.state, fetching: this.state.fetching+1});
            getUsers([authReducer.userId])
                .catch(err => this.setState({...this.state, error: err}))
                .finally(() => this.setState({...this.state, fetching: this.state.fetching-1}));
        }
    }

    componentDidMount() {
        document.title = 'EngineRoom | New Car';
        this.checkMissingData();
    }

    componentDidUpdate() {
        if(this.state.fetching === 0 && this.state.error === ''){
            this.checkMissingData();
        }
    }

    onChange(e){
        this.setState({...this.state, [e.target.name]: e.target.value});
    }

    async onSubmit(){
        const {make, model, year, modifications, accelTime, power, torque, image} = this.state;
        const {addCar, history, match, authReducer} = this.props;

        this.setState({...this.state, fetching: this.state.fetching+1});
        try {
            let imageUrl = 'https://engineroom.s3.amazonaws.com/default-car.png';
            if(image){
                const fileExt = image.name.match(/\..+$/)[0]?.toLowerCase();
                if(!fileExt) return this.setState({...this.state, error: "Couldn't determine the file extension"});
                const objectName = `${authReducer.awsIdentityId}/car-${String(Date.now())}${fileExt}`;
    
                const bucketName = 'engineroom';
                const bucketRegion = 'us-east-1';
    
                AWS.config.update({
                    region: bucketRegion,
                    credentials: new AWS.WebIdentityCredentials({
                        RoleArn: 'arn:aws:iam::424331035336:role/Cognito_engineroomAuth_Role',
                        WebIdentityToken: localStorage.awsToken
                    })
                });
    
                const resp = await (new AWS.S3.ManagedUpload({
                    params: {
                        Bucket: bucketName,
                        Key: objectName,
                        Body: image
                    }
                })).promise();
                imageUrl = resp.Location;
            }

            await addCar(make, model, year, modifications, accelTime, power, torque, imageUrl);
            this.setState({...this.state, 
                make: '',
                model: '',
                year: '',
                modifications: '',
                accelTime: '',
                power: '',
                torque: '',
                image: null,
                fetching: 0,
                error: ''
            }, () => history.push(`/users/${match.params.userId}/cars`));
        } catch(err) {
            this.setState({...this.state, fetching: 0, error: err.message});
        }
    }

    onFileChange(e){
        this.setState({...this.state, image: e.target.files[0]});
    }

    onClearError() {
		this.setState({...this.state, error: ''});
	}

    render() {
        const {userReducer, authReducer, match} = this.props;
        const {make, model, year, modifications, accelTime, power, torque, fetching, image, error} = this.state;
        const loggedInUser = userReducer.users[authReducer.userId] || {_id: '', friends: [], firstName: '', lastName: '', imageUrl: ''};

        return (
            <div className='NewCarPage-container'>
                <UserAside 
                    firstName={loggedInUser.firstName}
                    lastName={loggedInUser.lastName}
                    username={loggedInUser.username}
                    bio={loggedInUser.bio}
                    userId={loggedInUser._id}
                    userImageUrl={loggedInUser.imageUrl}
                    onFriend={this.onFriend}
                    alreadyFriend={loggedInUser.friends.includes(match.params.userId)}
                    loggedInUserId={authReducer.userId}
                />

                <div className='NewCarPage-inner-container'>
                    {error && (<Message color='red' onClearError={this.onClearError}>{error}</Message>)}
                    <div className='NewCarPage-title NewCarPage-blob'>
                        <h2>Add a Car</h2>
                        <p>Add a car to your EngineRoom profile</p>
                    </div>

                    <div className='NewCarPage-form NewCarPage-blob'>
                        <div className='NewCarPage-form-row'>
                            <div>
                                <label htmlFor='year'>Year:</label>
                                <input type='text' id='year' name='year' value={year} onChange={this.onChange} placeholder='2021' />
                            </div>
                            <div>
                                <label htmlFor='make'>Make:</label>
                                <input type='text' id='make' name='make' value={make} onChange={this.onChange} placeholder='Ford' />
                            </div>
                            <div>
                                <label htmlFor='model'>Model:</label>
                                <input type='text' id='model' name='model' value={model} onChange={this.onChange} placeholder='F150' />
                            </div>
                        </div>
                        <div className='NewCarPage-form-row'>
                            <div>
                                <label htmlFor='power'>Power (hp):</label>
                                <input type='text' id='power' name='power' value={power} onChange={this.onChange} placeholder='155' />
                            </div>
                            <div>
                                <label htmlFor='torque'>Torque (ft-lb):</label>
                                <input type='text' id='torque' name='torque' value={torque} onChange={this.onChange} placeholder='150' />    
                            </div>
                            <div>
                                <label htmlFor='accelTime'>0-60 Time (s):</label>
                                <input type='text' id='accelTime' name='accelTime' value={accelTime} onChange={this.onChange} placeholder='8.7' />
                            </div>
                        </div>
                        <div className='NewCarPage-form-row'>
                            <div>
                                <label htmlFor='image'>Image:</label>
                                <img src={image ? URL.createObjectURL(image) : 'https://engineroom.s3.amazonaws.com/default-car.png'} alt='preview'/>
                                <label htmlFor='image'>Browse...</label>
                                <input type='file' id='image' name='image' accept='image/*' onChange={this.onFileChange}/>
                            </div>
                            <div>
                                <label htmlFor='modifications'>Modifications:</label>
                                <textarea id='modifications' name='modifications' value={modifications} onChange={this.onChange} placeholder='K&N cold air intake, Bridgestone Ecopia tires'></textarea>
                                <button className='NewCarPage-submit-button' onClick={this.onSubmit}>{fetching !== 0 ? 'Loading...' : 'Submit'}</button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='NewCarPage-spacer'></div>
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

NewCarPage.propTypes = {
    userReducer: PropTypes.object.isRequired,
    authReducer: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    getUsers: PropTypes.func.isRequired,
    addCar: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {getUsers, addCar})(NewCarPage);