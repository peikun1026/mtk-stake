import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box, Typography } from "@mui/material";
import NavLink from "../NavLink";

const routes = [
  {
    href: "/",
    name: "Stake",
  },
  {
    href: "/withdraw",
    name: "Withdraw",
  },
];

const Header = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: "12px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Box>RCC STAKE</Box>
      <Box display={"flex"} alignItems={"center"} gap={"20px"}>
        {routes.map((route, index) => {
          return (
            <NavLink href={route.href} key={index}>
              {route.name}
            </NavLink>
          );
        })}
        <ConnectButton />
      </Box>
    </Box>
  );
};

export default Header;
