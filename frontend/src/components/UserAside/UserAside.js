import React from 'react';
import {Link} from 'react-router-dom';
import './UserAside.css';

const UserAside = ({firstName, lastName, username, bio, userId, userImageUrl, alreadyFriend, loggedInUserId, onFriend}) => (
    <div>
        <div className='UserAside-user'>
            <Link to={`/users/${userId}`} className='UserAside-user-link'>
                <img src={userImageUrl} alt='User profile' />
                <h2>{firstName} {lastName}</h2>
                <p className='UserAside-username'>@{username}</p>
                <p className='UserAside-bio'>{bio}</p>
            </Link>
            <div>
                <Link to={`/users/${userId}/friends`}>Friends</Link>
                <Link to={`/users/${userId}/cars`}>Cars</Link>
            </div>
        </div>
        {loggedInUserId !== userId && (
            alreadyFriend ? (
                <button className='UserAside-friend-btn UserAside-remove-btn' onClick={() => onFriend(userId)}>Remove Friend</button>
            ) : (
                <button className='UserAside-friend-btn' onClick={() => onFriend(userId)}>Add Friend</button>
            )
        )}
    </div>
);

export default UserAside;