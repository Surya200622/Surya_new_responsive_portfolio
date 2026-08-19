import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Surya CS - Full-Stack Python Developer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #0f172a, #1e293b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="100" height="100">
            <defs>
              <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
            <g transform="translate(3, 0)">
              <path d="M22,0 L44,12.5 L44,37.5 L22,50 L0,37.5 L0,12.5 Z" fill="#ffffff" stroke="url(#primaryGrad)" strokeWidth="2" />
              <path d="M28,14 C28,14 16,14 16,22 C16,28 28,28 28,34 C28,40 16,40 16,40" fill="none" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
          <div style={{ display: 'flex', fontSize: 60, fontWeight: 800 }}>
            <span>SURYA</span>
            <span style={{ color: '#f97316' }}>CS</span>
          </div>
        </div>
        
        <div style={{ fontSize: 48, fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
          Full-Stack Python Developer
        </div>
        
        <div style={{ fontSize: 32, color: '#94a3b8', textAlign: 'center' }}>
          Django • React • Next.js
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
