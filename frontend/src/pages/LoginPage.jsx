import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import useStore from '../store/useStore'

const inputStyle = {
  width: '100%', backgroundColor: '#0A0A14', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px', padding: '14px 16px', color: '#E2E8F0',
  fontSize: '15px', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s', fontFamily: 'inherit'
}

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useStore((state) => state.login)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login({ name: res.data.name, email: res.data.email }, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Wrong email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#08080F',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 16px', fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <Link to="/" style={{
        position: 'absolute', top: '24px', left: '32px',
        color: '#475569', textDecoration: 'none', fontSize: '14px',
        display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s'
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
        onMouseLeave={e => e.currentTarget.style.color = '#475569'}
      >← Home</Link>

      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#818CF8' }}>Fin</span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#F1F5F9' }}>Sight AI</span>
          </div>
          <p style={{ color: '#64748B', fontSize: '15px', margin: 0 }}>Welcome back — sign in to continue</p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#0E0E1A', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: '36px 32px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)'
        }}>
          {error && (
            <div style={{
              marginBottom: '24px', padding: '13px 16px',
              backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px', color: '#F87171', fontSize: '14px',
              display: 'flex', gap: '10px', alignItems: 'flex-start'
            }}>
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Email
              </label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" required
                style={{ ...inputStyle, borderColor: focused === 'email' ? '#6366F1' : 'rgba(255,255,255,0.1)' }}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••" required
                style={{ ...inputStyle, borderColor: focused === 'password' ? '#6366F1' : 'rgba(255,255,255,0.1)' }}
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px', fontSize: '15px', fontWeight: 700,
              color: '#fff', backgroundColor: loading ? '#4F46E5' : '#6366F1',
              border: 'none', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(99,102,241,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: loading ? 0.8 : 1
            }}
              onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = '#4F46E5' }}
              onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = '#6366F1' }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.8s linear infinite'
                  }}></span>
                  Signing in...
                </>
              ) : 'Sign in →'}
            </button>
          </form>

          <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
              No account?{' '}
              <Link to="/signup" style={{ color: '#818CF8', textDecoration: 'none', fontWeight: 600 }}
                onMouseEnter={e => e.target.style.color = '#A5B4FC'}
                onMouseLeave={e => e.target.style.color = '#818CF8'}
              >Create one free</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default LoginPage