import React from 'react'
import Icons8Sun from '../Assets/images/icons8-sun.svg';
import stacking from '../Assets/images/logo.svg';
import stackingW from '../Assets/images/foundation-logo-white.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';


class Navbar extends React.Component {

        handleModeTrigger = (event) => {
            this.props.modeChange(event);
            event.preventDefault();
        }

        render () {
            return(
                <div className='container'>
                    <nav className="navbar navbar-expand-sm">
                        <a href={"/"} className="navbar-brand header-logo">
                            <img src={stacking} alt="stakingLogo" className="large-icon dark-theme" />
                            <img src={stackingW} alt="stakingLogo" className="white-theme" />
                        </a>
                        {/* <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navb">
                            Menu
                        </button> */}
                    
                        
                            <ul className="navbar-nav ml-auto navbar-nav navbar-navRight" id="navb">
                                <li className="nav-item">
                                    <ConnectButton type="button" className="btn-green" ></ConnectButton>
                                </li>
                                <li className="nav-item">
                                    <button type="button" className="btn btnIc" onClick={this.handleModeTrigger}>
                                        <img src={Icons8Sun} alt="Icons8Sun" />
                                    </button>
                                </li>
                            </ul>
                        
                        
                    </nav>
                </div>
            )
        }
}

export default Navbar
