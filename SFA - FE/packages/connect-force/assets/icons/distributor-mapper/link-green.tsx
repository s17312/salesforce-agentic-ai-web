import React, { memo } from "react";
import GoogleIcon from "@/components/icons/GoogleIcon";

function linkGreen() {
  return <GoogleIcon name="link" size={20} color="#10b981" />;
}

export const LinkGreenIcon = memo(linkGreen);