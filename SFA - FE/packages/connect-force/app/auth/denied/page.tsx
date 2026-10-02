"use client";

import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import Link from "next/link";
import { public_sanse } from "@/app/dashboard/font";

export default function DeniedPage() {
  return (
    <DeniedContainer className={`${public_sanse.className}`}>
      <IconContainer>
        <LockOutlined style={{ fontSize: "80px", color: "red" }} />
      </IconContainer>
      <Title>Access Denied</Title>
      <Message>
        You are logged in but don&apos;t have the required access level.
      </Message>
      <Link href="/dashboard">
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
