import React, { memo } from "react";
import GoogleIcon from "@/components/icons/GoogleIcon";

function linkGray() {
  return <GoogleIcon name="link_off" size={20} color="#94a3b8" />;
}

export const LinkGrayIcon = memo(linkGray);