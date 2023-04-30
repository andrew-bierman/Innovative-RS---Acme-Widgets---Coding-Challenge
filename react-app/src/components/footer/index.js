import React from 'react';
import './footer.css';

export const Footer = () => {

    const handleLinkedInClick = () => {
        window.open('https://www.linkedin.com/in/andrew-bierman', '_blank');
    };

    const handleGitHubClick = () => {
        window.open('https://github.com/andrew-bierman', '_blank');
    };

    return (
        <footer className="footer is-fixed-bottom footer-pin">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-half">
                        <p>&copy; Andrew Bierman</p>
                    </div>
                    <div className="buttons">
                        <div className="field is-grouped">
                            <button class="button is-large"
                                onClick={handleGitHubClick}
                            >
                                <span class="icon is-medium">
                                    <i class="fab fa-github"></i>
                                </span>
                                <span>GitHub</span>
                            </button>
                            <button class="button is-large"
                                onClick={handleLinkedInClick}
                            >
                                <span class="icon is-medium">
                                    <i class="fab fa-linkedin"></i>
                                </span>
                                <span>LinkedIn</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
