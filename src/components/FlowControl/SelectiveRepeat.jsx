import React, { useState, useEffect } from "react";
import Packet from "../Common/Packet";
import "../../styles/FlowControl.css";

const SelectiveRepeat = () => {
	const initialPackets = Array.from({ length: 8 }, (_, index) => ({
		id: index + 1,
		name: `pacote_${index + 1}`,
		status: "waiting", // Todos os pacotes começam no estado "Aguardando"
	}));

	const [packets, setPackets] = useState(initialPackets);
	const [currentPacket, setCurrentPacket] = useState(0);
	const [timer, setTimer] = useState(0); // Timer iniciado como número (0)
	const [failedPackets, setFailedPackets] = useState([]); // Pacotes que falharam
	const [isSimulationRunning, setIsSimulationRunning] = useState(true); // Controle do timer

	const windowSize = 2; // Envia 2 pacotes por vez

	// Efeito para iniciar o envio de pacotes e o timer
	useEffect(() => {
		let interval;
		if (isSimulationRunning && currentPacket < packets.length) {
			interval = setInterval(() => {
				setTimer((prevTime) => prevTime + 0.1); // Incrementa o timer a cada 0.1s
			}, 100);

			const timeout = setTimeout(() => {
				if (failedPackets.length > 0) {
					retryFailedPackets();
				} else {
					sendPackets();
				}
			}, 1000); // Envia pacotes a cada 1 segundo
			return () => {
				clearTimeout(timeout);
				clearInterval(interval);
			};
		}
	}, [currentPacket, failedPackets, isSimulationRunning]);

	// Verificar se todos os pacotes foram recebidos para parar o timer
	useEffect(() => {
		// Verifica se todos os pacotes têm o status "received"
		const allPacketsReceived = packets.every(
			(packet) => packet.status === "received"
		);
		if (allPacketsReceived) {
			setIsSimulationRunning(false); // Para o timer
		}
	}, [packets]);

	const sendPackets = () => {
		const updatedPackets = [...packets];
		const newFailedPackets = [];

		// Loop para enviar pacotes dentro do tamanho da janela
		for (
			let i = 0;
			i < windowSize && currentPacket + i < packets.length;
			i++
		) {
			const packetIndex = currentPacket + i;

			// Simulando a probabilidade de falha (40% de falhar)
			const packetFailed = Math.random() <= 0.4;

			if (packetFailed) {
				// Se falhar, marcar o pacote como "error" (vermelho)
				updatedPackets[packetIndex].status = "error";
				newFailedPackets.push(packetIndex); // Adicionar ao array de pacotes que falharam
			} else {
				// Se o pacote não falhar, seguir com o fluxo normal
				updatedPackets[packetIndex].status = "sent";
				setTimeout(() => {
					updatedPackets[packetIndex].status = "received"; // Após 1 segundo, marcar como recebido
					setPackets([...updatedPackets]);
				}, 1000); // Espera 1 segundo para confirmar o recebimento
			}
		}

		setPackets(updatedPackets);
		setFailedPackets(newFailedPackets);

		// Se não houve pacotes com falha, avançar para a próxima janela
		if (newFailedPackets.length === 0) {
			setCurrentPacket((prev) => prev + windowSize); // Avança para os próximos pacotes
		}
	};

	const retryFailedPackets = () => {
		const updatedPackets = [...packets];
		const remainingFailedPackets = [];

		// Reenviar pacotes que falharam
		failedPackets.forEach((packetIndex) => {
			const packetFailedAgain = Math.random() <= 0.4; // Simulando nova chance de falha

			if (packetFailedAgain) {
				remainingFailedPackets.push(packetIndex); // Se falhar novamente, manter no array
			} else {
				updatedPackets[packetIndex].status = "sent"; // Marcar como enviado se bem-sucedido
				setTimeout(() => {
					updatedPackets[packetIndex].status = "received"; // Após 1 segundo, marcar como recebido
					setPackets([...updatedPackets]);
				}, 1000); // Espera 1 segundo para confirmar o recebimento
			}
		});

		setPackets(updatedPackets);
		setFailedPackets(remainingFailedPackets);

		// Se não houver mais pacotes falhados, avançar para a próxima janela
		if (remainingFailedPackets.length === 0) {
			setCurrentPacket((prev) => prev + windowSize);
		}
	};

	const restartSimulation = () => {
		setPackets(initialPackets); // Reinicia os pacotes no estado "Aguardando"
		setCurrentPacket(0); // Reinicia a simulação
		setTimer(0); // Reinicia o timer
		setFailedPackets([]); // Reiniciar o array de pacotes falhados
		setIsSimulationRunning(true); // Reiniciar o timer
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

export default SelectiveRepeat;
