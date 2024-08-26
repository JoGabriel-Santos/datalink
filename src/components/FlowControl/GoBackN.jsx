import React, { useState, useEffect } from "react";
import Packet from "../Common/Packet";
import "../../styles/FlowControl.css";

const GoBackN = () => {
	const initialPackets = Array.from({ length: 8 }, (_, index) => ({
		id: index + 1,
		name: `pacote_${index + 1}`,
		status: "waiting", // Todos os pacotes começam no estado "Aguardando"
	}));

	const [packets, setPackets] = useState(initialPackets);
	const [currentPacket, setCurrentPacket] = useState(0);
	const [windowSize] = useState(2); // Envia 2 pacotes por vez
	const [timer, setTimer] = useState(0); // Timer iniciado como número (0)

	// Efeito para iniciar o envio de pacotes e o timer
	useEffect(() => {
		let interval;
		if (currentPacket < packets.length) {
			interval = setInterval(() => {
				setTimer((prevTime) => prevTime + 0.1); // Incrementa o timer a cada 0.1s
			}, 100);

			const timeout = setTimeout(() => {
				sendPackets();
			}, 1000); // Envia pacotes a cada 1 segundo
			return () => {
				clearTimeout(timeout);
				clearInterval(interval);
			};
		}
	}, [currentPacket]);

	const sendPackets = () => {
		const updatedPackets = [...packets];
		let failureDetected = false;

		// Loop para enviar pacotes dentro do tamanho da janela
		for (
			let i = 0;
			i < windowSize && currentPacket + i < packets.length;
			i++
		) {
			const packetIndex = currentPacket + i;

			// Simulando a probabilidade de falha (40% de falhar)
			const packetFailed = Math.random() <= 0.4;

			if (packetFailed && !failureDetected) {
				// Se falhar, marcar o pacote como "error" (vermelho)
				updatedPackets[packetIndex].status = "error";
				setPackets(updatedPackets);
				failureDetected = true; // Se detectou falha, parar o envio da janela
				break;
			} else {
				// Se o pacote não falhar, seguir com o fluxo normal
				updatedPackets[packetIndex].status = "sent";
				setPackets(updatedPackets);
			}
		}

		// Se houve falha, recomeça a partir do ponto de falha
		if (failureDetected) {
			setTimeout(() => {
				sendPackets(); // Tentar novamente a partir do ponto de falha
			}, 1000);
		} else {
			// Se todos os pacotes forem enviados corretamente
			setTimeout(() => {
				for (
					let i = 0;
					i < windowSize && currentPacket + i < packets.length;
					i++
				) {
					const packetIndex = currentPacket + i;
					updatedPackets[packetIndex].status = "received";
				}
				setPackets(updatedPackets);

				// Muda para os próximos pacotes
				setCurrentPacket((prev) => prev + windowSize);
			}, 1000); // Simula o tempo de recebimento dos pacotes
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

export default GoBackN;
