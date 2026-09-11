export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: number
) => {
  ctx.beginPath();
  ctx.strokeStyle = '#334155'; // Dark mode grid
  ctx.lineWidth = 1;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Horizontal lines
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
  }

  // Vertical lines
  for (let i = 0; i <= 10; i++) {
    const x = padding + (chartWidth / 10) * i;
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
  }

  ctx.stroke();
};

export const drawAxes = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: number
) => {
  ctx.beginPath();
  ctx.strokeStyle = '#64748b'; // Dark mode axes
  ctx.lineWidth = 2;

  // Y axis
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);

  // X axis
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);

  ctx.stroke();
};

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  ctx.clearRect(0, 0, width, height);
};

export const setupCanvas = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => {
  // Handle high-DPI displays (retina)
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx.scale(dpr, dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  return { width: rect.width, height: rect.height };
};
