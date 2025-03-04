import React from 'react';
import './Options.css';
import {Link} from 'react-router-dom';

const Container = ({children}) => (
    <div className='Options-container'>
        {children}
    </div>
);

const Item = ({children, to, red}) => (
    <Link className='Options-item' to={to}>
        {children}
    </Link>
);

const Options = {Container, Item};

export default Options;