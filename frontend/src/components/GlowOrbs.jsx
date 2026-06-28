import React from 'react';
export default function GlowOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.08]"
        style={{ background: 'radial-gradient(circle, #1565C0, transparent 70%)', filter: 'blur(60px)', animation: 'float1 14s ease-in-out infinite' }} />
      <div className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #0288D1, transparent 70%)', filter: 'blur(70px)', animation: 'float2 18s ease-in-out infinite' }} />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #1976D2, transparent 70%)', filter: 'blur(80px)', animation: 'float3 22s ease-in-out infinite' }} />
    </div>
  );
}
