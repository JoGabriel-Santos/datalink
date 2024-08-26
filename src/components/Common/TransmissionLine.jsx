import React from "react";
import "../../styles/TransmissionLine.css";

const TransmissionLine = ({ children }) => {
	return (
		<div className="transmission-line">
			<div className="line"></div>
			{children}
		</div>
	);
};

export default TransmissionLine;
