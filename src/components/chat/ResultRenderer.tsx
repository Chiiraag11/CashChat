'use client';

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Code2, ChevronDown } from 'lucide-react';
import type { ChatApiResponse } from '@/types/chat';

const COLORS = ['#00C896', '#8B5CF6', '#3B82F6', '#F59E0B', '#FF4D6D', '#06B6D4', '#10B981'];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--surface-3)',
        border: '1px solid var(--border-strong)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '12px',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {label && <div style={{ color: 'var(--text-3)', marginBottom: '4px', fontSize: '11px' }}>{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: 'var(--text-1)', fontWeight: '600' }}>
          {typeof p.value === 'number' && p.value > 1000
            ? `₹${p.value.toLocaleString('en-IN')}`
            : p.value}
        </div>
      ))}
    </div>
  );
}

function renderChart(result: ChatApiResponse) {
  const data = result.chartData ?? [];

  if (result.chartType === 'pie') {
    return (
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" innerRadius={40} outerRadius={75} paddingAngle={2} strokeWidth={0}>
          {data.map((entry, i) => (
            <Cell key={entry.label} fill={COLORS[i % COLORS.length]} opacity={0.9} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    );
  }

  if (result.chartType === 'line') {
    return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} width={50} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} />
        <Line type="monotone" dataKey="value" stroke="#00C896" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#00C896', strokeWidth: 0 }} />
      </LineChart>
    );
  }

  return (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
      <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} width={50} />
      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
      <Bar dataKey="value" fill="#00C896" radius={[4, 4, 0, 0]} opacity={0.85} />
    </BarChart>
  );
}

export function ResultRenderer({ result }: { result: ChatApiResponse }) {
  return (
    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Chart */}
      {result.chartType !== 'none' && result.chartData && result.chartData.length > 0 && (
        <div
          style={{
            height: '220px',
            borderRadius: '10px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            padding: '12px',
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {renderChart(result)}
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      {result.rows.length > 0 && (
        <div
          style={{
            borderRadius: '10px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {/* Column headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Object.keys(result.rows[0] ?? {}).length}, 1fr)`,
              background: 'var(--surface-2)',
              borderBottom: '1px solid var(--border)',
              padding: '8px 12px',
            }}
          >
            {Object.keys(result.rows[0] ?? {}).map((col) => (
              <span
                key={col}
                style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: 'var(--text-3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {col}
              </span>
            ))}
          </div>
          {result.rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Object.values(row).length}, 1fr)`,
                padding: '8px 12px',
                borderBottom: i < result.rows.length - 1 ? '1px solid var(--border)' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              }}
            >
              {Object.values(row).map((val, j) => (
                <span
                  key={j}
                  className="fig"
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-1)',
                  }}
                >
                  {val === null ? '—' : String(val)}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* SQL disclosure */}
      <details
        style={{ borderRadius: '8px', overflow: 'hidden' }}
      >
        <summary
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: 'var(--text-3)',
            cursor: 'pointer',
            padding: '6px 0',
            userSelect: 'none',
            listStyle: 'none',
          }}
        >
          <Code2 size={12} />
          View generated SQL
          <ChevronDown size={11} style={{ marginLeft: 'auto' }} />
        </summary>
        <pre
          style={{
            marginTop: '6px',
            padding: '12px',
            borderRadius: '8px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            fontSize: '11px',
            fontFamily: 'ui-monospace, monospace',
            color: 'var(--emerald)',
            overflowX: 'auto',
            lineHeight: 1.6,
          }}
        >
          {result.sql}
        </pre>
      </details>
    </div>
  );
}
