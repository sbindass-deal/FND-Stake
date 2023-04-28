import axios from "axios";
import React, { useEffect } from "react";

import ProgressBar from "react-bootstrap/ProgressBar";
import stacking from "../Assets/images/leftSideImg.jpg";


export const Home = () => {
  const now = 60;
  return (
    <>
      <section className="mainSection">
        <div className="container">
          <div className="row ">
            <div className="col-md-12 col-sm-12  ">
           
              <div className="row groupSect">
                <div className="col-lg-6 lftImg">
                  <img src={stacking} alt="stacking"/>
					      </div>
                
                <div className="col-lg-6 rightSide">
                  <h3 className="sub">FOUNDATION TOKEN</h3>
                  <h2>Stake pool</h2>
                  <p> Staked Foundation Tokens Will Unlock in 6 Months  On Apr 24,2023 @20:00 UTC</p>

                  <div className="card_">
                   
                    <div className="card_body">
                      <div className="time">
                        <span>Staking Time:</span>
                        <span>30 Days</span>
                      </div>
                      <div className="time percentage">
                        <span>Percentage</span>
                        <span>
                          <ProgressBar
                            now={now}
                            label={`${now}%`}
                            visuallyHidden
                          />
                        </span>
                      </div>
                    </div>
                    <div className="card_head">
                     
                      <div className="time max">
                      <input type="text" placeholder="FND to stake"/>
                        <button className="stkBtn">Max</button>
                      </div>
                      <div className="time">
                        <span>Amount to Stake:</span>
                        <span>Balance: 15 FND</span>
                      </div>
                    </div>
                    <div className="card_body">
                      <div className="time timer">
                        <p>00 </p>
                        <p>00 </p>
                        <p>00 </p>
                        <p>00 </p>
                      </div>
                      <div className="time ">
                        <button className="btn">Stake</button>
                        <button className="btn border">Unstake</button>
                      </div>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
