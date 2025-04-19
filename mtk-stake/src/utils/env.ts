import { Address, zeroAddress } from "viem";

export const StakeContractAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS as Address || zeroAddress 
export const mtkStakeContractAddress = process.env.NEXT_PUBLIC_MTK_STAKE_ADDRESS as Address