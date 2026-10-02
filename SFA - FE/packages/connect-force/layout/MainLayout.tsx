'use client';

import { PropsWithChildren, useEffect, useState } from "react";
import { navItems } from "@/data/navigation-items";
import { useSelector } from "@/redux/store";
import { getAllUserRolePermissionDetailsByRoleForAuth } from "@/service/user-management/userRolePermission.service";
import { filterNavItemsByPermission, getAllowedMenuPaths } from "@/utils/permisisonFilter";
import { IslandLayout } from "@icp/react-fusion";
import { Box, CssBaseline } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { ConnectforceLogo } from "@/assets/icons/connectforce";

const MainLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
  });
  const rolePermission = useSelector((state) => state.userRolePermissionSlice.userRolePermissionModulesForAuth);

  const [loading, setLoading] = useState(true);
  const [filteredNavItems, setFilteredNavItems] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (session && session.user && session.user.roleId !== undefined) {
        try {
          await getAllUserRolePermissionDetailsByRoleForAuth(session.user.roleId);
        } catch (error) {
          enqueueSnackbar(`Something went wrong loading permissions`, { variant: "error" });
        }
      }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (
      rolePermission !== undefined &&
      rolePermission !== null &&
      Array.isArray(rolePermission)
    ) {
      const allowedPaths = getAllowedMenuPaths(rolePermission);
      const filtered = filterNavItemsByPermission(navItems, allowedPaths);
      // If filtered items exist use them, otherwise fallback to navItems to ensure navigation is accessible
      setFilteredNavItems(filtered.length > 0 ? filtered : navItems);
      setLoading(false);
    } else if (session) {
      // Fallback if role permissions have not loaded yet
      setFilteredNavItems(navItems);
      setLoading(false);
    }
  }, [rolePermission, session]);

  if (loading || filteredNavItems === undefined) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#070E4D",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            animation: "zoomInOut 1.2s ease-in-out infinite",
            "@keyframes zoomInOut": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.2)" },
            },
          }}
        >
          <ConnectforceLogo />
        </Box>
      </Box>
    );
  }

  return (
    <>
      <IslandLayout
        sideBarProps={{
          items: filteredNavItems,
          onItemClick: (index: number, path?: string) => { if (path) router.push(path); },
          onSubItemClick: (index: number, parentIdx: number, path: string, subPathpath: string) => { if (subPathpath) router.push(subPathpath); },
        }}
        crystalAppbarProps={{
          onProfileClick: () => { alert('Profile button clicked') },
          onSettingsClick: () => { alert('Settings button clicked') },
          onLogoutClick: () => { signOut(); },
          userImage: "https://www.w3schools.com/howto/img_avatar.png",
          username: session?.user?.name,
          userRole: "Admin",
        }}
      >
        {children}
      </IslandLayout>
    </>
  );
};

export default MainLayout;