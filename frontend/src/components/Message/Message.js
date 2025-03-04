import React from 'react';
import PropTypes from 'prop-types';
import './Message.css';

const Message = ({color, onClearError, children}) => {
    const colorClass = 'Message-' + (color || 'red');
    return (
        <div className={'Message ' + colorClass}>
            <span onClick={onClearError}>X</span>
            <h3>{color === 'red' ? 'Error' : 'Success'}</h3>
            {children}
        </div>
    );
};

Message.propTypes = {
    color: PropTypes.string,
    children: PropTypes.any
};

export default Message;