import React from 'react';

interface Threshold {
  availability: number;
  latency: number; // in milliseconds
}

interface Metrics extends Threshold {}

interface Props {
  metrics: Record<string, Metrics>;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sloConfig: Record<string, Threshold> = require('../../config/slo.json');

// Renders a simple table showing the current metrics compared to the
// configured SLO thresholds. Routes that violate either the availability
// or latency target are highlighted.
const SloDashboard: React.FC<Props> = ({ metrics }) => {
  const rows = Object.entries(sloConfig).map(([route, threshold]) => {
    const current = metrics[route] || { availability: 1, latency: 0 };
    const atRisk =
      current.availability < threshold.availability ||
      current.latency > threshold.latency;

    return (
      <tr key={route} style={atRisk ? { backgroundColor: '#ffcccc' } : undefined}>
        <td>{route}</td>
        <td>{(current.availability * 100).toFixed(2)}%</td>
        <td>{(threshold.availability * 100).toFixed(2)}%</td>
        <td>{current.latency}</td>
        <td>{threshold.latency}</td>
      </tr>
    );
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Availability</th>
          <th>Availability SLO</th>
          <th>Latency (ms)</th>
          <th>Latency SLO (ms)</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default SloDashboard;
