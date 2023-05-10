import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

import { abi, contractAddress, contractOwner } from "../contractDetails/FNDSTAKE";
import ProgressBar from "react-bootstrap/ProgressBar";
import { BigNumber, ethers } from "ethers";
import { fndStakeAddress } from "../contractIntegration";
import stacking from "../Assets/images/leftSideImg.jpg";
import {
  useAccount,
  useBalance,
  useNetwork,
  useSigner,
  useConnect,
  useContractWrite,
  useContractRead,
  useContractEvent
} from "wagmi";
dayjs.extend(utc);
dayjs.extend(tz);
export const Home = () => {
  const { address, connector, isConnected } = useAccount();
  console.log("address, connector, isConnected", address, connector, isConnected)
  const { chain } = useNetwork();
  const defaultRemainingTime = {
    seconds: "00",
    minutes: "00",
    hours: "00",
    days: "00",
  };
  const [contract] = useState(fndStakeAddress);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [userBalance, setUserBalance] = useState("")
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);
  const [stakingTime, setStakingTime] = useState(0);
  console.log("staking remaining Time ", remainingTime)
  const now = 60;
  const ethereum = window.ethereum;
  const accounts = ethereum.request({
    method: "eth_requestAccounts"
  });
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner(address);
  const FNDStakeContract = new ethers.Contract(contractAddress, abi, signer);


  const callDATA = async () => {

    const name = await FNDStakeContract.name();
    const symbol = await FNDStakeContract.symbol();
    const decimals = await FNDStakeContract.decimals();
    const totalSupply = await FNDStakeContract.totalSupply();
    const tSupply = ethers.utils.formatUnits(totalSupply, 18);
    const balance = await FNDStakeContract.balanceOf(address);

    const numUserBalance = await numDifferentiation(Number(balance.toString()) / 1000000000000000000)
    console.log("user Balance ", numUserBalance);
    setUserBalance(numUserBalance)
    // console.log("name symbol decimals totalsupply ", conspiracyData);
  };


  function updateRemainingTime(countdown) {

    const currentDate = Math.floor(new Date().getTime() / 1000)

    const difference = countdown - currentDate
    console.log("count down ", difference)
    let timeLeft = {};

    if (difference > 0) {

      timeLeft = {
        days: Math.floor(difference / (60 * 60 * 24)),
        hours: Math.floor(difference / (60 * 60)),
        minutes: Math.floor((difference / 60) % 60),
        seconds: Math.floor(difference % 60),
      };
    }

    console.log("time left ", timeLeft);

    return timeLeft;
  }

  const getRemainingSeconds = (nowDayjs, timestampDayjs) => {
    const seconds = timestampDayjs.diff(nowDayjs, "seconds") % 60;
    return seconds;
  };

  const getRemainingMinutes = (nowDayjs, timestampDayjs) => {
    const minutes = timestampDayjs.diff(nowDayjs, "minutes") % 60;
    return minutes;
  };

  const getRemainingHours = (nowDayjs, timestampDayjs) => {
    const hours = timestampDayjs.diff(nowDayjs, "hours") % 24;
    return hours;
  };

  const getRemainingDays = (nowDayjs, timestampDayjs) => {
    const days = timestampDayjs.diff(nowDayjs, "days");
    return days;
  };

  const getEventLog = async () => { const lockPeriod = await FNDStakeContract.lockingPeriod(address); setStakingTime(Number(lockPeriod.toString())) };
  async function numDifferentiation(val) {
    if (val >= 10000000) {
      val = Math.abs(val);
      val = (val).toFixed(2);
      // val = (Math.round(val * 100) / 100).toFixed(2);
      console.log("round figure value in js ", val)
      val = toPlainString(val);
      val = val + "";
    } else if (val >= 100000) {
      val = (val).toFixed(2);
      val = toPlainString(val);
      val = val + " Lacs";
    }
    /*else if(val >= 1000) val = (val/1000).toFixed(2) + ' K';*/
    return val;
  }

  function toPlainString(num) {
    return ('' + +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
      function (a, b, c, d, e) {
        return e < 0
          ? b + '0.' + Array(1 - e - c.length).join(0) + c + d
          : b + c + d + Array(e - d.length + 1).join(0);
      });
  }


  const { data, isLoading, isSuccess, write } = useContractWrite({ //{ data, isLoading, isSuccess, write }
    mode: "recklesslyUnprepared",
    address: contractAddress,
    abi: abi,
    chainId: 80001,
    functionName: "stake",
    args: [stakeAmount],
    // overrides: {
    //   from: address,
    //   // value: ethers.utils.parseEther("0.01")
    // },
    onError(error) {
      console.log('Error', error)
    },
    onSuccess(data) {
      console.log('Success', data)
    },
  });

  const [APY, setAPY] = useState(10);
  const [totalStaked, setTotalStaked] = useState(0)
  const [rewardRate, setRewardRate] = useState(10)
  console.log("rewardsRate", APY, totalStaked, rewardRate);
  const calculateAPY = () => {
    let apy = ((1 + (rewardRate / totalStaked)) - 1);
    console.log("current apy", apy)
    setAPY(apy);
  }

  const updateRewardRate = (rate) => {
    if (rate > 0 && rate <= 100) {
      
    }
  }
  // useContractWrite({ //{ data, isLoading, isSuccess, write }
  //   mode: "recklesslyUnprepared",
  //   address: contractAddress,
  //   abi: abi,
  //   chainId: 80001,
  //   functionName: "updateRewardRate",
  //   args: [APY],
  //   // overrides: {
  //   //   from: address,
  //   //   // value: ethers.utils.parseEther("0.01")
  //   // },
  //   onError(error) {
  //     console.log('Error', error)
  //   },
  //   onSuccess(data) {
  //     console.log('Success', data)
  //   },
  // });

  const getTotalTokensStaked = async () => {
    const totalStakedTokens = await FNDStakeContract.getTotalStakedandRewards();
    const bN = await BigNumber.from(totalStakedTokens);
    const etherValue = await ethers.utils.formatEther(bN)
    if(totalStaked <= Number(etherValue)){
      let reward = totalStaked * (rewardRate / 100);
      setRewardRate(reward)
      setTotalStaked(Number(etherValue));
    }    
  }

  const getRewardRate = () => {
    const r = setTimeout(() => {
      // updateRewardRate.write();
      getTotalTokensStaked()
    }, 10000);
    return () => clearTimeout(r);
  }

  useEffect(() => {
    callDATA();
    getEventLog();
    calculateAPY();
    getRewardRate();
    const timer = setTimeout(() => {
      setRemainingTime(updateRemainingTime(stakingTime));
      getTotalTokensStaked()
    }, 1000);
    return () => clearTimeout(timer);
  }, [stakingTime, userBalance, data, getEventLog])

  const unStakeFunc = useContractWrite({ //{ data, isLoading, isSuccess, write }
    mode: "recklesslyUnprepared",
    address: contractAddress,
    abi: abi,
    chainId: 80001,
    functionName: "unstake",
    onError(error) {
      console.log('Error', error)
    },
  });

  const handleStaking = () => {
    write({ overrides: { value: ethers.utils.parseEther("0.01") } });
  }
  return (
    <>
      <section className="mainSection">
        <div className="container">
          <div className="row ">
            <div className="col-md-12 col-sm-12  ">

              <div className="row groupSect">
                <div className="col-lg-6 lftImg">
                  <img src={stacking} alt="stacking" />
                </div>

                <div className="col-lg-6 rightSide">
                  <h3 className="sub">FOUNDATION TOKEN</h3>
                  <h2>Stake pool</h2>
                  <p> Staked Foundation Tokens Will Unlock in 6 Months  On Apr 24,2023 @20:00 UTC</p>

                  <div className="card_">

                    <div className="card_body">
                      <div className="time">
                        <span>Staking Time:</span>
                        <span>24 Hrs</span>
                      </div>
                      <div className="time percentage">
                        <span>Percentage</span>
                        <span>
                          <ProgressBar
                            now={now}
                            label={`${50}%`}
                            visuallyHidden
                          />
                        </span>
                      </div>
                    </div>
                    <div className="card_head">

                      <div className="time max">
                        <input type="number" placeholder="FND to stake" onChange={(e) => {
                          const c = ethers.utils.parseEther(e.target.value);
                          const ethAmount = ethers.utils.formatUnits(c, 18);
                          const weiValue = ethers.utils.parseUnits(ethAmount, "ether");
                          setStakeAmount(weiValue)
                        }} />
                        <button className="stkBtn">Max</button>
                      </div>
                      <div className="time">
                        <span>Amount to Stake:</span>
                        <span>Balance: {userBalance} FND</span>
                      </div>
                    </div>
                    <div className="card_body">
                      <div className="time timer">
                        <p>{remainingTime.days ? remainingTime.days : "00"}</p>
                        <p>{remainingTime.hours ? remainingTime.hours : "00"} </p>
                        <p>{remainingTime.minutes ? remainingTime.minutes : "00"} </p>
                        <p>{remainingTime.seconds ? remainingTime.seconds : "00"} </p>
                      </div>
                      <div className="time ">
                        <button className="btn" onClick={() => handleStaking()}>Stake</button>
                        <button className="btn border" onClick={() => unStakeFunc.write()}>Unstake</button>
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
