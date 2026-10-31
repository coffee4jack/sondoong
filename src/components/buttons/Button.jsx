
import React from "react";

const Button = ({
    text = "Click aquí",
    color = "#438731",
    onClick,
    textColor = "#ffffff",
    disabled = false
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                backgroundColor: color,
                color: textColor,
                padding: "7px 28px",
                border: "none",
                borderRadius: "10px",
                cursor: disabled ? "not-allowed" : "pointer",
                fontSize: "16px",
                opacity: disabled ? 0.6 : 1,
                margin: "8px"

            }}
        >
            {text}
        </button>
    );
};

export default Button;
