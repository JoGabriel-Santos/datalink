import React from "react";
import "../../styles/FlowControl.css";

const Packet = ({ status, id }) => {
	const getStatusColor = (status) => {
		switch (status) {
			case "sent":
				return "#FFA500"; // Laranja claro
			case "waiting":
				return "blue";
			case "received":
				return "green";
			case "error":
				return "red";
			default:
				return "grey";
		}
	};

	const getStatusLabel = (status) => {
		switch (status) {
			case "sent":
				return "Enviado";
			case "waiting":
				return "Aguardando";
			case "received":
				return "Recebido";
			case "error":
				return "Erro";
			default:
				return "Indefinido";
		}
	};

	return (
		<div
			className="packet"
			style={{ backgroundColor: getStatusColor(status) }}
		>
			<span className="packet-label">{getStatusLabel(status)}</span>
		</div>
	);
};

export default Packet;
