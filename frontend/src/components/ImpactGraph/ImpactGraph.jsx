import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './ImpactGraph.module.css';

const data = [
  { name: 'Jan', donations: 4000 },
  { name: 'Feb', donations: 5500 },
  { name: 'Mar', donations: 4800 },
  { name: 'Apr', donations: 7200 },
  { name: 'May', donations: 8900 },
  { name: 'Jun', donations: 11000 },
  { name: 'Jul', donations: 9500 },
  { name: 'Aug', donations: 13500 },
  { name: 'Sep', donations: 15800 },
  { name: 'Oct', donations: 18000 },
  { name: 'Nov', donations: 21000 },
  { name: 'Dec', donations: 25000 },
];

const ImpactGraph = () => {
  return (
    <div className={`glass-card ${styles.graphCard}`}>
      <h3 className={styles.title}>Yearly Impact Growth</h3>
      <div className={styles.graphContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-secondary)', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-secondary)', fontSize: 12}} dx={-10} tickFormatter={(value) => `₹${value/1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
              itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
              labelStyle={{ color: 'var(--color-text-primary)' }}
            />
            <Area type="monotone" dataKey="donations" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorDonations)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ImpactGraph;
