function PnLChart({ data }) {
  if (!data || data.length < 2) {
    return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Brak danych do wygenerowania wykresu.</div>;
  }

  const pnlValues = data.map((d) => d.pnl);
  let rawMin = Math.min(...pnlValues);
  let rawMax = Math.max(...pnlValues);

  const paddingMargin = (rawMax - rawMin) * 0.1 || 10;
  const minPnL = rawMin - paddingMargin;
  const maxPnL = rawMax + paddingMargin;
  const range = maxPnL - minPnL || 1;

  const width = 800;
  const height = 260;
  const paddingX = 10;
  const paddingY = 15;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((d.pnl - minPnL) / range) * (height - 2 * paddingY);
    return [x, y];
  });

  // Zamiana punktów na gładką krzywą (Catmull-Rom -> Bezier)
  const smoothPath = (pts) => {
    if (pts.length < 3) {
      return `M ${pts.map((p) => p.join(",")).join(" L ")}`;
    }
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

      d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
    }
    return d;
  };

  const pathD = smoothPath(points);
  const firstX = paddingX;
  const lastX = width - paddingX;
  const bottomY = height - paddingY;
  const areaD = `${pathD} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;

  const lastPnL = data[data.length - 1]?.pnl || 0;
  const lineColor = lastPnL >= 0 ? "#22c55e" : "#ef4444";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#chartGrad)" />
      <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
