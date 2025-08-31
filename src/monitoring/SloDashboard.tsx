import React from 'react';

export interface SloThreshold {
  availability: number;
  latency: number;
}

export interface SloStats {
  availability: number;
  latency: number;
}

export interface SloDashboardProps {
  sloConfig: Record<string, SloThreshold>;
  stats: Record<string, SloStats>;
}

const SloDashboard: React.FC<SloDashboardProps> = ({ sloConfig, stats }) => (
  <table>
    <thead>
      <tr>
        <th>Route</th>
        <th>Availability</th>
        <th>Latency (ms)</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(sloConfig).map(([route, threshold]) => {
        const current = stats[route] || { availability: 0, latency: Infinity };
        const atRisk = current.availability < threshold.availability || current.latency > threshold.latency;
        return (
          <tr key={route} style={{ color: atRisk ? 'red' : undefined }}>
            <td>{route}</td>
            <td>{(current.availability * 100).toFixed(2)}% / {(threshold.availability * 100).toFixed(2)}%</td>
            <td>{current.latency} / {threshold.latency}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default SloDashboard;
