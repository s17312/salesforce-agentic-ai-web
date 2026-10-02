"use client";

import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Link from "next/link";
import { public_sanse } from "@/app/dashboard/font";
import { PATH_DASHBOARD } from "@/routes/paths";

export default function ErrorPage() {
  return (
    <DeniedContainer className={`${public_sanse.className}`}>
      <IconContainer>
        <ErrorOutlineIcon style={{ fontSize: "80px", color: "red" }} />
      </IconContainer>
      <Title>Error</Title>
      <Message>
        Error occoured!
      </Message>
      <Link href="/auth/login">
        <Button variant="contained">Go Back</Button>
      </Link>
    </DeniedContainer>
  );
}

const DeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
`;

const IconContainer = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
`;

const Message = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
`;
