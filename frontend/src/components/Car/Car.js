import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import './Car.css';

const Car = ({name, imageUrl, userId, width=270, style}) => (
    <Link className='Car-car' to={`/users/${userId}/cars`} style={{width: `${width}px`, ...style}}>
        <img src={imageUrl} alt={name} />
        <h3>{name}</h3>
    </Link>
);

Car.propTypes = {
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired
};

export default Car;