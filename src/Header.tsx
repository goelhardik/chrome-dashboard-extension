import * as React from 'react';
import "./Header.css";


export class Header extends React.Component<any, any> {
    public render() {
        return (
            <nav className="navbar is-transparent">
                <div className="navbar-brand">
                    <a className="navbar-item" href="https://bulma.io" >
                        <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
                    </a>
                </div>

                <div id="navbarExampleTransparentExample" className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    <a className="button is-primary" href="https://github.com/jgthms/bulma/releases/download/0.7.1/bulma-0.7.1.zip">
                                        <span className="icon">
                                            <i className="fas fa-download"></i>
                                        </span>
                                        <span>Configure</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}



