import React, { useState, useEffect } from "react";
import Packet from "../Common/Packet";
import "../../styles/FlowControl.css";

const StopAndWait = () => {
	const initialPackets = Array.from({ length: 8 }, (_, index) => ({
		id: index + 1,
		name: `pacote_${index + 1}`,
		status: "waiting", // Todos os pacotes começam no estado "Aguardando"
	}));

	const [packets, setPackets] = useState(initialPackets);
	const [currentPacket, setCurrentPacket] = useState(0);
	const [timer, setTimer] = useState(0); // Timer iniciado como número (0)

	// Efeito para iniciar o envio de pacotes e o timer
	useEffect(() => {
		let interval;
		if (currentPacket < packets.length) {
			interval = setInterval(() => {
				setTimer((prevTime) => prevTime + 0.1); // Incrementa o timer a cada 0.1s
			}, 100);

			const timeout = setTimeout(() => {
				sendPacket();
			}, 1000); // Envia um pacote a cada 1 segundo
			return () => {
				clearTimeout(timeout);
				clearInterval(interval);
			};
		}
	}, [currentPacket]);

	const sendPacket = () => {
		const updatedPackets = [...packets];

		// Simulando a probabilidade de falha (40% de falhar)
		const packetFailed = Math.random() <= 0.4;

		if (packetFailed) {
			// Se falhar, marcar o pacote como "error" (vermelho) e tentar novamente
			updatedPackets[currentPacket].status = "error";
			setPackets(updatedPackets);

			setTimeout(() => {
				sendPacket(); // Tentar novamente o envio após 1 segundo
			}, 1000);
		} else {
			// Se o pacote não falhar, seguir com o fluxo normal
			updatedPackets[currentPacket].status = "sent";
			setPackets(updatedPackets);

			// Após 1 segundo, o pacote muda para "Recebido" (verde)
			setTimeout(() => {
				updatedPackets[currentPacket].status = "received";
				setPackets(updatedPackets);

				// Muda para o próximo pacote
				setCurrentPacket((prev) => prev + 1);
			}, 1000); // Simula o tempo de recebimento do pacote
		}
	};

	const restartSimulation = () => {
		setPackets(initialPackets); // Reinicia os pacotes no estado "Aguardando"
		setCurrentPacket(0); // Reinicia a simulação
		setTimer(0); // Reinicia o timer
	};

	return (
		<div className="simulation-container">
			<div className="packets-container">
				<div className="computer computer-left">
					<h4>Computador A</h4>
				</div>

				<div className="packets-container">
					{packets.map((packet) => (
						<Packet key={packet.id} status={packet.status} />
					))}
				</div>

				<div className="computer computer-right">
					<h4>Computador B</h4>
				</div>
			</div>

			{/* Timer */}
			<div className="timer">Tempo: {timer.toFixed(1)} s</div>

			{/* Botão de reinício */}
			<button onClick={restartSimulation} className="restart-btn">
				Reiniciar Simulação
			</button>
		</div>
	);
};

export default StopAndWait;
