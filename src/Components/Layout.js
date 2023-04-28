import React from 'react'
import Navbar from '../Components/Navbar';

import Footer from '../Components/Footer';
import Home from './Home';






import {
  BrowserRouter,
  Routes,
  Route,
  Switch
} from "react-router-dom";




class Layout extends React.Component {

  state = {
    mode: false
  }

  handleHomePageMode = (event) => {
    this.setState({ mode: !this.state.mode })
  }


  render() {


    return (
      <div className={!this.state.mode ? "" : "staking-white-theme"}>
      
        <header className=" fixed-top staking-header " >
          <Navbar modeChange={this.handleHomePageMode} />
        </header>

        <section className="">
          <BrowserRouter>
            <Routes >
              <Route path="/" element={<Home />} />
              {/* <Route path="/SelectNFTs" element={<SelectNFTs />} />
              
                  <Route path="/stakingList" element={<StakingList />} /> */}
              </Routes>
          </BrowserRouter>

          {/* <Home/> */}

        
          
          
        </section>
        <Footer />
       

      </div>
    )
  }
}

export default Layout
