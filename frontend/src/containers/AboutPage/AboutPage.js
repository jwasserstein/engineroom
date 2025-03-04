import React, {Component} from 'react';
import './AboutPage.css';

class AboutPage extends Component {
    componentDidMount() {
        document.title = 'EngineRoom | About';
    }

    render() {
        return (
            <div className='AboutPage-container'>
                <div className='AboutPage-title AboutPage-blob'>
                    <h2>About</h2>
                    <p>Learn the story of EngineRoom</p>
                </div>

                <div className='AboutPage-about AboutPage-blob'>
                    <p>
                        EngineRoom is a social media application for car enthusiasts.  
                        It allows users to make posts, make comments, upload pictures 
                        of their cars, set a profile picture, and find friends who share 
                        car interests.  It’s a single page, fullstack application 
                        that uses React and Redux on the frontend and Node.js, Express, and 
                        MongoDB on the backend. The frontend is served by GitHub Pages and 
                        the backend runs on Heroku with a managed database provided by MongoDB 
                        Atlas. It was designed using Figma.
                    </p>
                    <p className='AboutPage-handcrafted'>Handcrafted with <span className='AboutPage-heart'>❤</span> in Glastonbury, Connecticut.</p>
                    <div className='AboutPage-icon-container'>
                        <a href='https://github.com/jwasserstein/engineroom-frontend' target='_blank' rel='noreferrer'>
                            <span className="iconify" data-icon="ant-design:github-filled" data-inline="false"></span>
                            <p>GitHub</p>
                            <p>frontend</p>
                        </a>
                        <a href='https://github.com/jwasserstein/engineroom-backend' target='_blank' rel='noreferrer'>
                            <span className="iconify" data-icon="ant-design:github-filled" data-inline="false"></span>
                            <p>GitHub</p>
                            <p>backend</p>
                        </a>
                        <a href='https://www.wasserstein.dev/' target='_blank' rel='noreferrer'>
                            <span className="iconify" data-icon="ant-design:folder-outlined" data-inline="false"></span>
                            <p>Portfolio</p>
                        </a>
                        <a href='https://www.linkedin.com/in/justin-wasserstein' target='_blank' rel='noreferrer'>
                            <span className="iconify" data-icon="ant-design:linkedin-filled" data-inline="false"></span>
                            <p>LinkedIn</p>
                        </a>
                        <a href='https://jwasserstein.s3.amazonaws.com/Resume-Wasserstein.pdf' target='_blank' rel='noreferrer'>
                            <span className="iconify" data-icon="fa-regular:clipboard" data-inline="false"></span>
                            <p>Resume</p>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default AboutPage;