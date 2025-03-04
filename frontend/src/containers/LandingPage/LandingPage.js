import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import img from '../../images/whitebmw.jpg';
import './LandingPage.css';

class LandingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            width: 0,
            height: 0
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount(){
        document.title = 'EngineRoom | Welcome';
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions(){
        this.setState({...this.state, width: window.innerWidth, height: window.innerHeight});
    }

    render() {
        const {width, height} = this.state;
        const divHeight = width > 900 ? height - 100 : height - 82; // subtract height of <Navbar> and <Footer>

        return (
            <div className='LandingPage-main-container' style={{height: divHeight}}>
                <div className='LandingPage-Hero-image' style={{backgroundImage: `url(${img})`}}>
                    <div className="LandingPage-Hero-text">
                        <h1>Welcome to EngineRoom</h1>
                        <p>The premier social media application for car enthusiasts</p>
                        <Link to='/signup'>Join Now</Link>
                    </div>
                </div>
            </div>
        );
    }
};

export default LandingPage;