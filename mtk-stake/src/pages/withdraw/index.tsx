import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useStakeContract } from "../../hooks/useStakeContract";
import { useEffect, useMemo, useState } from "react";
import { Pid } from "../../utils";
import { useAccount, useWalletClient } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { waitForTransactionReceipt } from "viem/actions";

export type UserStakeData = {
  staked: string;
  withdrawPending: string;
  withdrawable: string;
};

const InitData = {
  staked: "0",
  withdrawable: "0",
  withdrawPending: "0",
};

const Withdraw = () => {
  const stakeContract = useStakeContract();
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("0");
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [userData, setUserData] = useState<UserStakeData>(InitData);

  const isWithdrawable = useMemo(() => {
    return Number(userData.withdrawable) > 0 && isConnected;
  }, [userData, isConnected]);

  const getUserData = async () => {
    if (!stakeContract || !address) return;
    const staked = await stakeContract?.read.stakingBalance([Pid, address]);
    //@ts-ignore
    const [requestAmount, pendingWithdrawAmount] =
      await stakeContract.read.withdrawAmount([Pid, address]);
    const ava = Number(formatUnits(pendingWithdrawAmount, 18));
    const p = Number(formatUnits(requestAmount, 18));
    console.log({ p, ava });
    setUserData({
      staked: formatUnits(staked as bigint, 18),
      withdrawPending: (p - ava).toFixed(4),
      withdrawable: ava.toString(),
    });
  };

  useEffect(() => {
    if (stakeContract && address) {
      getUserData();
    }
  }, [address, stakeContract]);

  const handleUnStake = async () => {
    if (!stakeContract || !walletClient) return;
    try {
      setUnstakeLoading(true);
      const tx = await stakeContract.write.unstake([
        Pid,
        parseUnits(amount, 18),
      ]);
      const res = await waitForTransactionReceipt(walletClient, { hash: tx });
      setUnstakeLoading(false);
      getUserData();
    } catch (error) {
      setUnstakeLoading(false);
      console.log(error, "stake-error");
    }
  };
  const handleWithdraw = async () => {
    if (!stakeContract || !walletClient) return;
    try {
      setWithdrawLoading(true);
      const tx = await stakeContract.write.withdraw([Pid]);
      const res = await waitForTransactionReceipt(walletClient, { hash: tx });
      console.log(res, "withdraw-res");
      setWithdrawLoading(false);
      getUserData();
    } catch (error) {
      setWithdrawLoading(false);
      console.log(error, "stake-error");
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        width={"100%"}
      >
        <Box
          sx={{
            border: "1px solid #eee",
            borderRadius: "12px",
            p: "20px",
            width: "600px",
            mt: "30px",
          }}
        >
          <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
            <Box className="title">Staked Amount: </Box>
            <Box className="val">{userData.staked} ETH</Box>
          </Box>
          <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
            <Box className="title">Available to withdraw </Box>
            <Box className="val">{userData.withdrawable} ETH</Box>
          </Box>
          <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
            <Box className="title">Pending Withdraw: </Box>
            <Box className="val">{userData.withdrawPending} ETH</Box>
          </Box>
          <Box sx={{ fontSize: "20px", mb: "10px" }}>Unstake</Box>
          <TextField
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            sx={{ minWidth: "300px" }}
            label="Amount"
            variant="outlined"
          />
          <Box mt="20px">
            {!isConnected ? (
              <ConnectButton />
            ) : (
              <Button
                variant="contained"
                loading={unstakeLoading}
                onClick={handleUnStake}
              >
                UnStake
              </Button>
            )}
          </Box>
          <Box sx={{ fontSize: "20px", mb: "10px", mt: "40px" }}>Withdraw</Box>
          <Box> Ready Amount: {userData.withdrawable} </Box>
          <Typography fontSize={"14px"} color={"#888"}>
            After unstaking, you need to wait 20 minutes to withdraw.
          </Typography>
          <Button
            sx={{ mt: "20px" }}
            disabled={!isWithdrawable}
            variant="contained"
            loading={withdrawLoading}
            onClick={handleWithdraw}
          >
            Withdraw
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Withdraw;
