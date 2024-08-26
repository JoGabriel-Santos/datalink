import React, { useState } from "react";
import StopAndWait from "./StopAndWait";
import GoBackN from "./GoBackN";
import SelectiveRepeat from "./SelectiveRepeat";
import "../../styles/FlowControlSimulator.css"; // Arquivo de estilo atualizado

const FlowControlSimulator = () => {
	const [protocol, setProtocol] = useState("StopAndWait");

	const renderProtocol = () => {
		switch (protocol) {
			case "StopAndWait":
				return <StopAndWait />;
			case "GoBackN":
				return <GoBackN />;
			case "SelectiveRepeat":
				return <SelectiveRepeat />;
			default:
				return <StopAndWait />;
		}
	};

	return (
		<div className="flow-control-simulator">
			<div className="sidebar">
				<div className="sidebar-header">
					<h3>Controle de Fluxo</h3>
				</div>
				<div className="sidebar-menu">
					<button
						onClick={() => setProtocol("StopAndWait")}
						className={`sidebar-item ${
							protocol === "StopAndWait" ? "selected" : ""
						}`}
					>
						Stop and Wait
					</button>
					<button
						onClick={() => setProtocol("GoBackN")}
						className={`sidebar-item ${
							protocol === "GoBackN" ? "selected" : ""
						}`}
					>
						Go-Back-N
					</button>
					<button
						onClick={() => setProtocol("SelectiveRepeat")}
						className={`sidebar-item ${
							protocol === "SelectiveRepeat" ? "selected" : ""
						}`}
					>
						Selective Repeat
					</button>
				</div>
			</div>
			<div className="simulation-area">{renderProtocol()}</div>
		</div>
	);
};

export default FlowControlSimulator;
