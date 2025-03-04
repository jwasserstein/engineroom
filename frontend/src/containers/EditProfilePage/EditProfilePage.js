import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getUsers, editProfile} from '../../store/actions/users';
import AWS from 'aws-sdk';
import Message from '../../components/Message';
import './EditProfilePage.css';

class EditProfilePage extends Component {
    constructor(props){
        super(props);

        const {authReducer, userReducer} = this.props;
        const loggedInUser = userReducer.users[authReducer.userId];

        this.state = {
            firstName: loggedInUser?.firstName || '',
            lastName: loggedInUser?.lastName || '',
            bio: loggedInUser?.bio || '',
            image: null,
            error: '',
            fetching: 0
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
            this.setState({...this.state, fetching: 1});
            getUsers([authReducer.userId])
                .then(() => {
                    const loggedInUser = this.props.userReducer.users[authReducer.userId];
                    this.setState({
                        firstName: loggedInUser.firstName,
                        lastName: loggedInUser.lastName,
                        bio: loggedInUser.bio,
                        fetching: this.state.fetching-1
                    });
                })
                .catch(err => this.setState({...this.state, fetching: this.state.fetching-1, error: err}));
        }
    }

    componentDidMount() {
        document.title = 'EngineRoom | Edit Profile';
        this.checkMissingData();
    }

    componentDidUpdate() {
        if(this.state.fetching === 0 && this.state.error === '') {
            this.checkMissingData();
        }
    }

    onChange(e){
        this.setState({...this.state, [e.target.name]: e.target.value});
    }

    onClearError() {
		this.setState({...this.state, error: ''});
	}

    async onSubmit(){
        const {firstName, lastName, bio, image} = this.state;
        const {history, authReducer, editProfile, userReducer} = this.props;
        const loggedInUser = userReducer.users[authReducer.userId];

        this.setState({...this.state, fetching: this.state.fetching+1});

        try {
            let imageUrl = userReducer.users[authReducer.userId].imageUrl;
            if(image) {
                const fileExt = image.name.match(/\..+$/)[0]?.toLowerCase();
                if(!fileExt) return this.setState({...this.state, fetching: this.state.fetching-1, error: "Couldn't determine the file extension of your image"});
                const objectName = `${authReducer.awsIdentityId}/user-${String(Date.now())}${fileExt}`;

                const bucketName = 'engineroom';
                const bucketRegion = 'us-east-1';

                AWS.config.update({
                    region: bucketRegion,
                    credentials: new AWS.WebIdentityCredentials({
                        RoleArn: 'arn:aws:iam::424331035336:role/Cognito_engineroomAuth_Role',
                        WebIdentityToken: localStorage.awsToken,
                        DurationSeconds: 3600
                    })
                });

                const existingImage = loggedInUser.imageUrl.match(/(user|car)-\d+.\w+$/);
                if(existingImage){
                    const s3 = new AWS.S3();
                    await s3.deleteObject({
                        Bucket: bucketName,
                        Key: `${authReducer.awsIdentityId}/${existingImage[0]}`
                    }).promise();
                }
                
                const resp = await (new AWS.S3.ManagedUpload({
                    params: {
                        Bucket: bucketName,
                        Key: objectName,
                        Body: image
                    }
                })).promise();
                imageUrl = resp.Location;
            }

            this.setState({...this.state, fetching: this.state.fetching+1});
            await editProfile(firstName, lastName, bio, imageUrl);
            this.setState({...this.state, 
                firstName: '',
                lastName: '',
                bio: '',
                image: null,
                fetching: this.state.fetching-1
            }, () => history.push(`/users/${authReducer.userId}`));
        } catch(err) {
            this.setState({...this.state, fetching: this.state.fetching-1, error: err.message});
        }
    }

    onFileChange(e){
        this.setState({...this.state, image: e.target.files[0]});
    }

    render() {
        const {userReducer, authReducer} = this.props;
        const {firstName, lastName, bio, fetching, image, error} = this.state;
        const loggedInUser = userReducer.users[authReducer.userId] || {};

        return (
            <div className='EditProfilePage-container'>
                {error && (<Message color='red' onClearError={this.onClearError}>{error}</Message>)}
                <div className='EditProfilePage-title EditProfilePage-blob'>
                    <h2>Edit your Profile</h2>
                    <p>Edit your EngineRoom profile</p>
                </div>

                <div className='EditProfilePage-form EditProfilePage-blob'>
                    <div className='EditProfilePage-image-container'>
                        <label htmlFor='image'>Profile Image</label>
                        <img src={image ? URL.createObjectURL(image) : loggedInUser.imageUrl} alt='preview'/>
                        <label htmlFor='image'>Browse...</label>
                        <input type='file' id='image' name='image' accept='image/*' onChange={this.onFileChange}/>
                    </div>
                    <div className='EditProfilePage-field-container'>
                        <label htmlFor='firstName'>First Name:</label>
                        <input type='text' id='firstName' name='firstName' value={firstName} onChange={this.onChange} placeholder='John' />
                        
                        <label htmlFor='lastName'>Last Name:</label>
                        <input type='text' id='lastName' name='lastName' value={lastName} onChange={this.onChange} placeholder='Doe' />
                        
                        <label htmlFor='bio'>Bio:</label>
                        <textarea id='bio' name='bio' value={bio} onChange={this.onChange} placeholder='Tell us about yourself...'></textarea>
                        <button className='EditProfilePage-submit-button' onClick={this.onSubmit}>{fetching ? 'Loading...' : 'Submit'}</button>
                    </div>
                </div>
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

EditProfilePage.propTypes = {
    userReducer: PropTypes.object.isRequired,
    authReducer: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    getUsers: PropTypes.func.isRequired,
    editProfile: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {getUsers, editProfile})(EditProfilePage);