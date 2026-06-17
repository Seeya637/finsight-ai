import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08080F', color: '#E2E8F0', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, backgroundColor: 'rgba(8,8,15,0.92)',
        backdropFilter: 'blur(16px)', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#818CF8' }}>Fin</span>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Sight</span>
          <span style={{
            marginLeft: '8px', fontSize: '10px', padding: '2px 8px',
            borderRadius: '20px', backgroundColor: 'rgba(129,140,248,0.12)',
            color: '#818CF8', border: '1px solid rgba(129,140,248,0.25)',
            fontWeight: 600, letterSpacing: '0.05em'
          }}>AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/login')} style={{
            padding: '9px 20px', fontSize: '14px', color: '#94A3B8',
            background: 'none', border: 'none', cursor: 'pointer',
            borderRadius: '8px', transition: 'color 0.2s'
          }}
            onMouseEnter={e => e.target.style.color = '#E2E8F0'}
            onMouseLeave={e => e.target.style.color = '#94A3B8'}
          >Sign in</button>
          <button onClick={() => navigate('/signup')} style={{
            padding: '9px 22px', fontSize: '14px', fontWeight: 600,
            color: '#fff', backgroundColor: '#6366F1', border: 'none',
            borderRadius: '10px', cursor: 'pointer', transition: 'background 0.2s, transform 0.15s'
          }}
            onMouseEnter={e => { e.target.style.backgroundColor = '#4F46E5'; e.target.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.target.style.backgroundColor = '#6366F1'; e.target.style.transform = 'translateY(0)' }}
          >Get started</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 32px 80px', textAlign: 'center' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '100px',
          backgroundColor: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)',
          color: '#818CF8', fontSize: '13px', fontWeight: 500, marginBottom: '36px'
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#818CF8',
            boxShadow: '0 0 8px #818CF8', display: 'inline-block'
          }}></span>
          RAG · Groq LLaMA 3.1 · Semantic Search
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.08,
          letterSpacing: '-0.03em', marginBottom: '24px', color: '#F1F5F9'
        }}>
          Ask anything about<br />
          <span style={{ color: '#818CF8' }}>financial documents</span>
        </h1>

        <p style={{
          fontSize: '18px', color: '#64748B', maxWidth: '520px', margin: '0 auto 48px',
          lineHeight: 1.7
        }}>
          Upload annual reports, earnings calls, SEBI filings.
          Get AI answers with exact page citations — no hallucination, no guesswork.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}>
          <button onClick={() => navigate('/signup')} style={{
            padding: '14px 32px', fontSize: '16px', fontWeight: 700,
            color: '#fff', backgroundColor: '#6366F1', border: 'none',
            borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 8px 24px rgba(99,102,241,0.3)'
          }}
            onMouseEnter={e => { e.target.style.backgroundColor = '#4F46E5'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 32px rgba(99,102,241,0.4)' }}
            onMouseLeave={e => { e.target.style.backgroundColor = '#6366F1'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)' }}
          >Start for free →</button>
          <button onClick={() => navigate('/login')} style={{
            padding: '14px 32px', fontSize: '16px', fontWeight: 500,
            color: '#94A3B8', backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
            cursor: 'pointer', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.target.style.color = '#E2E8F0'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.backgroundColor = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { e.target.style.color = '#94A3B8'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.backgroundColor = 'rgba(255,255,255,0.04)' }}
          >Sign in</button>
        </div>

        {/* Demo window */}
        <div style={{
          backgroundColor: '#0E0E1A', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', overflow: 'hidden', textAlign: 'left',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)'
        }}>
          {/* Window chrome */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            backgroundColor: 'rgba(255,255,255,0.02)'
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.6)' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(245,158,11,0.6)' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.6)' }}></div>
            <span style={{ marginLeft: '10px', fontSize: '12px', color: '#475569' }}>FinSight AI — Live demo</span>
          </div>
          <div style={{ padding: '28px 28px 24px' }}>
            {/* User question */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <div style={{
                backgroundColor: '#6366F1', color: '#fff', borderRadius: '18px 18px 4px 18px',
                padding: '12px 18px', fontSize: '14px', maxWidth: '320px', lineHeight: 1.5
              }}>
                What was Reliance's net profit in FY2024?
              </div>
            </div>
            {/* AI answer */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                backgroundColor: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', color: '#818CF8'
              }}>✦</div>
              <div style={{
                backgroundColor: '#13131F', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px 18px 18px 18px', padding: '16px 20px',
                maxWidth: '480px'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  marginBottom: '10px', color: '#10B981', fontSize: '12px', fontWeight: 600
                }}>
                  <span>📄</span> Reliance_Annual_Report_FY24.pdf · Page 47
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '14px', lineHeight: 1.65, margin: '0 0 12px' }}>
                  Reliance's net profit (PAT) for FY2024 was <strong style={{ color: '#F1F5F9' }}>₹79,020 crore</strong>, reflecting a year-over-year growth of 7.3%.
                </p>
                <p style={{ color: '#475569', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', margin: 0 }}>
                  ⚠️ Not financial advice. Consult a SEBI registered advisor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 32px 100px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px'
        }}>
          {[
            { icon: '📁', title: 'Upload any PDF', desc: 'Annual reports, earnings transcripts, SEBI filings, mutual fund documents.' },
            { icon: '🔍', title: 'Semantic search', desc: 'Finds relevant sections by meaning, not just keywords. Understands full context.' },
            { icon: '📌', title: 'Cited answers', desc: 'Every answer shows the exact page and document it came from.' }
          ].map((f, i) => (
            <div key={i} style={{
              backgroundColor: '#0E0E1A', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '28px 24px', transition: 'all 0.2s', cursor: 'default'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.35)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ color: '#F1F5F9', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: '#64748B', fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '28px 32px', textAlign: 'center', color: '#334155', fontSize: '13px' }}>
        FinSight AI — For research purposes only. Not financial advice.
      </div>
    </div>
  )
}

export default LandingPage