import React, {Component} from 'react';
import Options from '../../components/Options';
import './ProfilePage.css';

class ProfilePage extends Component {
    componentDidMount(){
        document.title = 'EngineRoom | Profile';
    }

    render() {
        return (
            <div className='ProfilePage-main-container'>
                <div className='ProfilePage-title ProfilePage-blob'>
                    <h2>Your Profile</h2>
                    <p>Select an option to edit your EngineRoom profile</p>
                </div>
                <Options.Container>
                    <Options.Item to='/editProfile'>
                        Edit Profile
                    </Options.Item>
                    <Options.Item to='/password'>
                        Change Password
                    </Options.Item>
                </Options.Container>
            </div>
        )
    }  
}

export default ProfilePage;