import { ethers } from "ethers";
import {infuraId} from "./config";
import {abi, contractAddress, privateKey} from "./contractDetails/FNDSTAKE";
export const provider = new ethers.providers.JsonRpcProvider(infuraId, 80001);
export const signer = new ethers.Wallet(privateKey, provider);
export const fndStakeAddress = new ethers.Contract(contractAddress, abi, signer)

