import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({className, form, children, to, onClick}) => {
    const classes = className ? `Button ${className}` : 'Button';
    if(form){
        return <button type='submit' className={classes} onClick={onClick}>{children}</button>;
    } else {
        return <Link className={classes} to={to} onClick={onClick}>{children}</Link>;
    }
};

Button.propTypes = {
    className: PropTypes.string,
    form: PropTypes.bool,
    to: PropTypes.string,
    children: PropTypes.any,
    onClick: PropTypes.func
};

export default Button;