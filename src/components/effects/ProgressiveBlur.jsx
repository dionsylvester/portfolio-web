import React from "react";

const ProgressiveBlur = ({ position = "top", height = "120px", blurAmount = "10px" }) => {
    const isTop = position === "top";

    return (
        <div
        style={{
            position: "fixed",
            left: 0,
            width: "100%",
            zIndex: 40,
            pointerEvents: "none",
            selectNone: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
            [isTop ? "top" : "bottom"]: 0,
            height,
            background: isTop ? `linear-gradient(to top, transparent, var(--bg-blur-color))` : `linear-gradient(to bottom, transparent, var(--bg-blur-color))`,
            maskImage: isTop ? `linear-gradient(to bottom, black 20%, transparent)` : `linear-gradient(to top, black 20%, transparent)`,
            WebkitMaskImage: isTop ? `linear-gradient(to bottom, black 20%, transparent)` : `linear-gradient(to top, black 20%, transparent)`,
            WebkitBackdropFilter: `blur(${blurAmount})`,
            backdropFilter: `blur(${blurAmount})`,
        }}
        />
    );
};

export default ProgressiveBlur;