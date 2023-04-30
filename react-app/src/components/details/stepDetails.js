import { useState } from 'react';

export const StepDetails = ({ step, index }) => {
  const hazards = step.hazards || [];
  const controls = step.controls || [];

  const rows = [];
  const numRows = Math.max(hazards.length, controls.length);
  for (let i = 0; i < numRows; i++) {
    const hazard = hazards[i] || {};
    const control = controls[i] || {};
    rows.push(
      <tr key={i} className="is-vcentered">
        <td>{hazard.description || ''}</td>
        <td>{control.description || ''}</td>
      </tr>
    );
  }

  return (
    <div className="mb-5 nmt-5" key={step.id}>
      <h3 className="title is-5 mt-5" style={{ marginTop: '2.5rem' }}>
        Step {index}: {step.description}
      </h3>
      <table className="table is-fullwidth" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Hazard</th>
            <th style={{ width: '50%' }}>Controls</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
