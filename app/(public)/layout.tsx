import React from "react";

export default function publicLayout ({children}: {children: React.ReactNode}) {
    return (
    <div>
        {children}
    </div>
    )
}