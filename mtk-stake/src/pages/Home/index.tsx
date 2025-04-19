import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import { useStakeContract } from "../../hooks/useStakeContract";
import { useMtkStakeContract } from "../../hooks/useMtkStakeContract";
import { formatEther, parseEther } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { Pid } from "../../utils";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("0");
  const [stakeAmount, setStakeAmount] = useState("0");
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const stakeContract = useStakeContract();
  const mtkStakeContract = useMtkStakeContract();

  const { data: walletClient } = useWalletClient();

  // console.log("stakeContract", stakeContract);
  console.log("mtkStakeContract", mtkStakeContract);

  console.log("地址1", address);
  const handleStake = async () => {
    if (!address) return null;
    console.log("stakeContract", stakeContract, balance);
    if (
      parseFloat(amount) > parseFloat(formatEther(BigInt(balance?.value || 0)))
    ) {
      console.log("Amount cannot be greater than current balance");
    }
    try {
      setLoading(true);
      const tx = await stakeContract?.write.depositETH([], {
        value: parseEther(amount),
      });
      // const res = await useWaitForTransactionReceipt({ hash: tx });
      const res = await waitForTransactionReceipt(walletClient, { hash: tx });
      console.log("发起质押", tx, res);
      getStakeAmount();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("stake error", error);
    }
  };

  // const res = useReadContract({
  //   abi: stakeAbi,
  //   address: StakeContractAddress,
  //   functionName: "stakingBalance",
  //   args: [Pid, address],
  // });
  // console.log(888888,res)

  const getStakeAmount = async () => {
    const res = await stakeContract?.read.stakingBalance([Pid, address]);
    // console.log(666666, res);
    setStakeAmount(formatEther(res as bigint));
  };

  useEffect(() => {
    // 获取原生币质押数量
    if (stakeContract && address) {
      getStakeAmount();
    }
  }, [stakeContract, address]);

  useEffect(() => {
    if (mtkStakeContract && address) {
      addPool();
    }
  }, [mtkStakeContract, address]);

  // 创建质押池
  const addPool = async () => {
    console.log(
      "mtkStakeContract?.write?.addPool",
      mtkStakeContract?.write?.addPool
    );
    const tx = await mtkStakeContract?.write?.addPool([
      process.env.NEXT_PUBLIC_MTK_TOKEN_ADDRESS,
      100,
      1000,
      10,
      true,
    ]);
    console.log(99999999999, tx);
    const res = await waitForTransactionReceipt(walletClient, { hash: tx });
    console.log("创建质押池", res);
  };

  return (
    <div>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        mb={"10px"}
      >
        <Typography variant="h3">Rcc Stake</Typography>
        <Typography variant="subtitle1">Stake ETH to earn tokens.</Typography>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          sx={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            p: "20px",
            width: "800px",
          }}
        >
          <Box>Staked Amount:{stakeAmount} ETH</Box>
          <Box my={"10px"}>
            <TextField
              id="outlined-basic"
              label="Amount"
              variant="outlined"
              onChange={(e) => setAmount(e.target.value)}
            />
          </Box>
          {isConnected ? (
            <Button
              variant="contained"
              size="medium"
              loading={loading}
              onClick={handleStake}
            >
              Stake
            </Button>
          ) : (
            <Box>Please connect the wallet</Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Home;
