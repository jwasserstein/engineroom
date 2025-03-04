import React from 'react';
import PropTypes from 'prop-types';
import './DetailedCar.css';

const DetailedCar = ({name, imageUrl, mods, accelTime, power, torque}) => (
    <div className='DetailedCar-car DetailedCar-blob'>
        <img src={imageUrl} alt={name} />
        <div className='DetailedCar-car-container'>
            <h3>{name}</h3>
            <div>
                <h4>Modifications</h4>
                <p>{mods}</p>
            </div>
            <div className='DetailedCar-spec-container'>
                <div>
                    <h4>0-60 Time</h4>
                    <p>{accelTime} seconds</p>
                </div>
                <div>
                    <h4>Power</h4>
                    <p>{power} hp</p>
                </div>
                <div>
                    <h4>Torque</h4>
                    <p>{torque} ft-lb</p>
                </div>
            </div>
        </div>
    </div>
);

DetailedCar.propTypes = {
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    mods: PropTypes.string.isRequired,
    accelTime: PropTypes.string.isRequired,
    power: PropTypes.string.isRequired,
    torque: PropTypes.string.isRequired
};

export default DetailedCar;