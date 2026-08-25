import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic title if provided, otherwise default
    const hasTitle = searchParams.has('title');
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'Surya CS | Full-Stack Developer';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0f',
            fontFamily: 'system-ui, sans-serif',
            position: 'relative',
          }}
        >
          {/* Magical Background Orbs */}
          <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: 'rgba(139, 92, 246, 0.3)', filter: 'blur(100px)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, background: 'rgba(59, 130, 246, 0.3)', filter: 'blur(100px)', borderRadius: '50%' }} />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '60px 80px',
              background: 'rgba(255, 255, 255, 0.03)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 900,
                color: 'white',
                marginBottom: '10px',
                lineHeight: 1.1,
                textAlign: 'center',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#8b5cf6', // accent color
                fontWeight: 600,
                marginTop: 0,
                marginBottom: '40px',
              }}
            >
              Crafting Digital Experiences
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '24px', color: '#9ca3af', background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '100px' }}>Python</span>
              <span style={{ fontSize: '24px', color: '#9ca3af', background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '100px' }}>Django</span>
              <span style={{ fontSize: '24px', color: '#9ca3af', background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '100px' }}>React</span>
              <span style={{ fontSize: '24px', color: '#9ca3af', background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '100px' }}>Next.js</span>
            </div>
          </div>
          
          <div style={{ position: 'absolute', bottom: 40, color: 'rgba(255,255,255,0.5)', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>suryacs-websolutions.vercel.app</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
