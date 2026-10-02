import React from "react";
import { memo } from "react";

function linkGray() {
    return (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.25219 7.74927C10.8459 9.34302 10.8459 11.9214 9.25219 13.508C7.65844 15.0947 5.08011 15.1018 3.49344 13.508C1.90677 11.9143 1.89969 9.33593 3.49344 7.74927" stroke="#BBBBBB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.50094 9.49879C5.84344 7.84129 5.84344 5.14962 7.50094 3.48504C9.15844 1.82046 11.8501 1.82754 13.5147 3.48504C15.1793 5.14254 15.1722 7.83421 13.5147 9.49879" stroke="#BBBBBB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const LinkGrayIcon = memo(linkGray);