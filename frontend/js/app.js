document.addEventListener('DOMContentLoaded', () => {
	initializeCharts();
	initializeNotifications();
});

function initializeCharts() {
	const canvases = document.querySelectorAll('.chart-canvas');

	canvases.forEach((canvas) => {
		const points = (canvas.dataset.points || '')
			.split(',')
			.map((value) => Number(value.trim()))
			.filter((value) => Number.isFinite(value));

		if (!points.length) {
			return;
		}

		animateChart(canvas, points);
	});
}

function animateChart(canvas, points) {
	const context = canvas.getContext('2d');
	if (!context) {
		return;
	}

	const width = canvas.clientWidth || 700;
	const height = canvas.clientHeight || 220;
	canvas.width = width;
	canvas.height = height;

	const maxPoint = Math.max(...points);
	const minPoint = Math.min(...points);
	const padding = 24;
	const xStep = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

	let progress = 0;

	function drawFrame() {
		context.clearRect(0, 0, width, height);
		context.strokeStyle = '#5b7cff';
		context.lineWidth = 3;
		context.beginPath();

		for (let index = 0; index < points.length; index += 1) {
			const x = padding + index * xStep;
			const normalized = maxPoint === minPoint ? 0.5 : (points[index] - minPoint) / (maxPoint - minPoint);
			const y = height - padding - normalized * (height - padding * 2) * progress;

			if (index === 0) {
				context.moveTo(x, y);
			} else {
				context.lineTo(x, y);
			}
		}

		context.stroke();

		progress += 0.03;
		if (progress <= 1) {
			requestAnimationFrame(drawFrame);
		}
	}

	drawFrame();
}

function initializeNotifications() {
	const panel = document.querySelector('.notification-panel');
	const list = document.querySelector('.notification-list');
	const toggleButton = document.querySelector('.notify-toggle');
	const count = document.querySelector('.notify-count');

	if (!panel || !list || !toggleButton || !count) {
		return;
	}

	const templates = [
		'New order received.',
		'Daily analytics report is ready.',
		'New signup joined your platform.',
		'Inventory alert: low stock detected.',
		'Subscription payment completed.'
	];

	let unreadCount = 0;

	function addNotification(message) {
		const item = document.createElement('li');
		item.textContent = message;
		list.prepend(item);

		while (list.children.length > 6) {
			list.removeChild(list.lastChild);
		}

		unreadCount += 1;
		count.textContent = String(unreadCount);
	}

	toggleButton.addEventListener('click', () => {
		panel.classList.toggle('open');
		unreadCount = 0;
		count.textContent = '0';
	});

	addNotification('Welcome back. Live notifications are active.');

	setInterval(() => {
		const randomIndex = Math.floor(Math.random() * templates.length);
		addNotification(templates[randomIndex]);
	}, 9000);
}
