import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import './User.css';

const User = ({firstName, lastName, imageUrl, id, width=150}) => (
    <Link className='User-person' to={`/users/${id}`} style={{width: `${width}px`}}>
        <img src={imageUrl} alt={firstName + ' ' + lastName} />
        <h3>{firstName} {lastName}</h3>
    </Link>
);

User.propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default User;