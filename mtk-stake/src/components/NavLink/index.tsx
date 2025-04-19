import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Typography } from "@mui/material";

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
  const pathName = usePathname();
  return (
    <div>
      <Link href={href}>
        <Typography
          sx={{
            fontSize: "20px",
            mx: "12px",
            fontWeight: pathName == href ? "700" : "400",
          }}
        >
          {children}
        </Typography>
      </Link>
    </div>
  );
};

export default NavLink;
