'use client';

import React, { useEffect, useRef, useState } from "react";
import CreateUserRole from "../../components/createUserRole";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { useRouter } from "next/navigation";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { getAllUserRolePermissionDetailsByRole } from "@/service/user-management/userRolePermission.service";
import { enqueueSnackbar } from "notistack";
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { useTheme } from "@mui/system";

const UserRolePermission = ({ params }: { params: { id: number } }) => {
    const theme = useTheme();
    const router = useRouter();
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await getAllUserRolePermissionDetailsByRole(params.id);
            } catch (error) {
                enqueueSnackbar(`Something went wrong`, { variant: "error" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFullScreenClick = () => {
        toggleFullScreen();
        setIsFullScreen((prev) => !prev);
    };

    const handleBreadcrumbNavigation = (path: string | undefined) => {
        if (path) {
            router.push(path);
        }
    };

    return (
        <FsBox ref={ref} isFullScreen={isFullScreen}>
            <BreadcrumbNavigation
                pageTitle="Assign User Role Permissions"
                pageNavigation={[
                    {
                        pageName: "User Role Permissions",
                        path: PATH_DASHBOARD.userRolePermission.list,
                    },
                    {
                        pageName: "Assign User Role Permissions",
                    },
                ]}
                onLinkClick={(path: any) => {
                    handleBreadcrumbNavigation(path);
                }}
                onFullScreenClick={handleFullScreenClick}
                icon={<KeyRoundedIcon sx={{ color: theme.palette.primary.main }} />}
            />
            <CreateUserRole userRoleId={params.id} />
        </FsBox>
    );
};

export default UserRolePermission;