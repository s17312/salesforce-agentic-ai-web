"use client";

import { PATH_DASHBOARD } from '@/routes/paths';
import { FsBox } from '@/styles/fullscreen/fullscreenStyles';
import { Container } from '@/styles/pageLayoutStyles/pageLayoutStyles';
import { toggleFullScreen } from '@/utils/fullscreenUtils';
import { BreadcrumbNavigation } from '@icp/react-fusion';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import UserRoleAssignmentAddEditPage from '../components/userRoleAssignmentAddEditPage';

const UserRoleAssignmentRegisterPage = () => {
    const router = useRouter();
    const ref = React.useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const handleBreadcrumbNavigation = (path: string | undefined) => {
        if (path) {
          router.push(path);
        }
      };
    const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
      };
  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
        <BreadcrumbNavigation
            pageTitle="User Role Assignment Register"
            pageNavigation={[
                {
                    pageName: "User Role Assignment",
                    path: PATH_DASHBOARD.userRoleAssignment.list,
                },
                { pageName: "Register" },
            ]}
            onLinkClick={(path) => {
                handleBreadcrumbNavigation(path);
            }}
            onFullScreenClick={handleFullScreenClick}
        />
        <Container>
            <UserRoleAssignmentAddEditPage />
        </Container>
    </FsBox>
  )
}

export default UserRoleAssignmentRegisterPage
