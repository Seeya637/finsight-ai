import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import api from '../services/api'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout, messages, addMessage, setLoading, isLoading, clearMessages } = useStore()

  const [question, setQuestion] = useState('')
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchDocuments()
    fetchHistory()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/upload/my-documents')
      setDocuments(res.data.documents)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await api.get('/chat/history')
      setChatHistory(res.data.history)
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    setUploading(true)
    try {
      await api.post('/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      fetchDocuments()
    } catch (err) {
      console.log(err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (docId, filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return
    setDeletingId(docId)
    try {
      await api.delete(`/upload/${docId}`)
      setDocuments(prev => prev.filter(d => d.id !== docId))
    } catch (err) {
      console.log(err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleChat = async (e) => {
    e.preventDefault()
    if (!question.trim() || isLoading) return

    const q = question.trim()
    addMessage({ role: 'user', content: q })
    setQuestion('')
    setLoading(true)

    try {
      const res = await api.post('/chat/', { question: q })
      addMessage({
        role: 'ai',
        content: res.data.answer,
        disclaimer: res.data.disclaimer
      })
      fetchHistory()
    } catch (err) {
      addMessage({
        role: 'ai',
        content: 'Something went wrong. Please try again.',
        error: true
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const loadHistoryMessage = (item) => {
    clearMessages()
    addMessage({ role: 'user', content: item.question })
    addMessage({ role: 'ai', content: item.answer })
    setShowHistory(false)
  }

  // Format AI answer — bold, bullet points
  const formatAnswer = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#F1F5F9">$1</strong>')
      .replace(/^• /gm, '<span style="color:#6366F1">•</span> ')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div style={{
  height: '100vh', backgroundColor: '#08080F',
  color: '#E2E8F0', fontFamily: "'Inter', system-ui, sans-serif",
  display: 'flex', flexDirection: 'column',
  overflow: 'hidden'
}}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '56px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(8,8,15,0.95)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100, flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none', border: 'none', color: '#64748B',
              cursor: 'pointer', fontSize: '18px', padding: '4px',
              display: 'flex', alignItems: 'center'
            }}
          >☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '17px', fontWeight: 700, color: '#818CF8' }}>Fin</span>
            <span style={{ fontSize: '17px', fontWeight: 700, color: '#F1F5F9' }}>Sight</span>
            <span style={{
              marginLeft: '6px', fontSize: '9px', padding: '2px 6px',
              borderRadius: '20px', backgroundColor: 'rgba(129,140,248,0.12)',
              color: '#818CF8', border: '1px solid rgba(129,140,248,0.2)', fontWeight: 600
            }}>AI</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => { setShowHistory(!showHistory); fetchHistory() }}
            style={{
              padding: '7px 14px', fontSize: '13px', fontWeight: 500,
              color: showHistory ? '#818CF8' : '#64748B',
              backgroundColor: showHistory ? 'rgba(129,140,248,0.1)' : 'transparent',
              border: '1px solid',
              borderColor: showHistory ? 'rgba(129,140,248,0.3)' : 'rgba(255,255,255,0.08)',
              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            🕐 History
          </button>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: '#6366F1', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff'
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '7px 14px', fontSize: '13px', color: '#64748B',
              background: 'none', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', cursor: 'pointer', transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.target.style.color = '#EF4444'}
            onMouseLeave={e => e.target.style.color = '#64748B'}
          >Logout</button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* Sidebar */}
{sidebarOpen && (
  <aside style={{
    width: '260px',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    backgroundColor: '#0A0A14',
    overflow: 'hidden',
    height: '100%'
  }}>

    {/* Upload section — FIXED, kabhi scroll nahi hoga */}
    <div style={{ padding: '16px', flexShrink: 0 }}>
      <label style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
        <div style={{
          border: '1.5px dashed rgba(129,140,248,0.3)',
          borderRadius: '12px', padding: '20px',
          textAlign: 'center', transition: 'all 0.2s',
          backgroundColor: uploading ? 'rgba(129,140,248,0.05)' : 'transparent'
        }}
          onMouseEnter={e => {
            if (!uploading) {
              e.currentTarget.style.borderColor = 'rgba(129,140,248,0.6)'
              e.currentTarget.style.backgroundColor = 'rgba(129,140,248,0.05)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(129,140,248,0.3)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>
            {uploading ? '⏳' : '📁'}
          </div>
          <p style={{ color: '#818CF8', fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>
            {uploading ? 'Processing...' : 'Drop PDF here'}
          </p>
          <p style={{ color: '#475569', fontSize: '11px', margin: 0 }}>
            {uploading ? 'Please wait' : 'or click to browse'}
          </p>
        </div>
        <input
          type="file" accept=".pdf"
          onChange={handleUpload}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </label>
    </div>

    {/* Divider */}
    <div style={{
      height: '1px',
      backgroundColor: 'rgba(255,255,255,0.06)',
      flexShrink: 0
    }} />

    {/* Documents list — SCROLLABLE, apna scrollbar */}
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      minHeight: 0
    }}>
      <p style={{
        fontSize: '11px', fontWeight: 600, color: '#334155',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        margin: '0 0 12px 4px'
      }}>
        Your Documents ({documents.length})
      </p>

      {documents.length === 0 ? (
        <p style={{
          color: '#334155', fontSize: '13px',
          textAlign: 'center', padding: '20px 0'
        }}>
          No documents yet
        </p>
      ) : (
        documents.map((doc) => (
          <div
            key={doc.id}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '12px', backgroundColor: '#0E0E1A',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', marginBottom: '8px',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>📄</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: '#CBD5E1', fontSize: '12px', fontWeight: 500,
                margin: '0 0 3px', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {doc.filename}
              </p>
              <p style={{ color: '#334155', fontSize: '11px', margin: 0 }}>
                {doc.chunks} chunks indexed
              </p>
            </div>
            <button
              onClick={() => handleDelete(doc.id, doc.filename)}
              disabled={deletingId === doc.id}
              style={{
                background: 'none', border: 'none',
                color: deletingId === doc.id ? '#334155' : '#475569',
                cursor: deletingId === doc.id ? 'not-allowed' : 'pointer',
                fontSize: '14px', padding: '2px', flexShrink: 0,
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => { if (deletingId !== doc.id) e.target.style.color = '#EF4444' }}
              onMouseLeave={e => { if (deletingId !== doc.id) e.target.style.color = '#475569' }}
              title="Delete document"
            >
              {deletingId === doc.id ? '...' : '🗑'}
            </button>
          </div>
        ))
      )}
    </div>
  </aside>
)}
        {/* History Panel */}
        {showHistory && (
          <div style={{
            width: '300px', borderRight: '1px solid rgba(255,255,255,0.06)',
            backgroundColor: '#0A0A14', display: 'flex', flexDirection: 'column',
            flexShrink: 0
          }}>
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <p style={{ color: '#94A3B8', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                Chat History
              </p>
              <button
                onClick={() => setShowHistory(false)}
                style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '16px' }}
              >✕</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>
              {chatHistory.length === 0 ? (
                <p style={{ color: '#334155', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                  No chat history yet
                </p>
              ) : (
                chatHistory.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => loadHistoryMessage(item)}
                    style={{
                      padding: '12px', borderRadius: '10px', marginBottom: '8px',
                      backgroundColor: '#0E0E1A', border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(129,140,248,0.3)'
                      e.currentTarget.style.backgroundColor = '#13131F'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.backgroundColor = '#0E0E1A'
                    }}
                  >
                    <p style={{
                      color: '#94A3B8', fontSize: '12px', fontWeight: 500,
                      margin: '0 0 4px', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {item.question}
                    </p>
                    <p style={{
                      color: '#334155', fontSize: '11px', margin: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {item.answer?.slice(0, 60)}...
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chat Main */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',height:'100%' }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px',minHeight:0 }}>

            {messages.length === 0 ? (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '60px 20px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: 600, margin: '0 0 8px' }}>
                  Ask about your documents
                </h2>
                <p style={{ color: '#475569', fontSize: '14px', maxWidth: '360px', lineHeight: 1.6, margin: '0 0 32px' }}>
                  Upload a financial PDF and ask anything — net profit, revenue, risks, SEBI guidelines.
                </p>
                {/* Suggestion chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '500px' }}>
                  {[
                    "What is the net profit?",
                    "What are the key risks?",
                    "Summarize revenue growth",
                    "What does the CEO say?"
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setQuestion(suggestion)}
                      style={{
                        padding: '8px 16px', fontSize: '13px',
                        color: '#818CF8', backgroundColor: 'rgba(129,140,248,0.08)',
                        border: '1px solid rgba(129,140,248,0.2)',
                        borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(129,140,248,0.15)'
                        e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(129,140,248,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(129,140,248,0.2)'
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      gap: '12px', alignItems: 'flex-start'
                    }}
                  >
                    {/* AI Avatar */}
                    {msg.role === 'ai' && (
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                        backgroundColor: 'rgba(129,140,248,0.15)',
                        border: '1px solid rgba(129,140,248,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', color: '#818CF8', marginTop: '2px'
                      }}>✦</div>
                    )}

                    <div style={{
                      maxWidth: '680px',
                      backgroundColor: msg.role === 'user' ? '#6366F1' : '#0E0E1A',
                      border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                      padding: '14px 18px',
                      boxShadow: msg.role === 'user' ? '0 4px 16px rgba(99,102,241,0.2)' : 'none'
                    }}>
                      {msg.role === 'ai' ? (
                        <>
                          <div
                            style={{ fontSize: '14px', lineHeight: 1.75, color: '#CBD5E1' }}
                            dangerouslySetInnerHTML={{ __html: formatAnswer(msg.content) }}
                          />
                          {msg.disclaimer && (
                            <p style={{
                              fontSize: '11px', color: '#475569', margin: '12px 0 0',
                              paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)'
                            }}>
                              ⚠️ {msg.disclaimer}
                            </p>
                          )}
                        </>
                      ) : (
                        <p style={{ fontSize: '14px', color: '#fff', margin: 0, lineHeight: 1.6 }}>
                          {msg.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading dots */}
                {isLoading && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      backgroundColor: 'rgba(129,140,248,0.15)',
                      border: '1px solid rgba(129,140,248,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', color: '#818CF8'
                    }}>✦</div>
                    <div style={{
                      backgroundColor: '#0E0E1A', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '4px 18px 18px 18px', padding: '16px 20px',
                      display: 'flex', gap: '4px', alignItems: 'center'
                    }}>
                      {[0, 150, 300].map((delay, i) => (
                        <div key={i} style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          backgroundColor: '#6366F1', animation: 'bounce 1s infinite',
                          animationDelay: `${delay}ms`
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '16px 24px 20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            backgroundColor: '#08080F'
          }}>
            <form onSubmit={handleChat} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask about your financial documents..."
                style={{
                  flex: 1, backgroundColor: '#0E0E1A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px', padding: '14px 20px',
                  color: '#E2E8F0', fontSize: '14px', outline: 'none',
                  transition: 'border-color 0.2s', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                style={{
                  padding: '14px 24px', fontSize: '14px', fontWeight: 600,
                  color: '#fff', backgroundColor: '#6366F1',
                  border: 'none', borderRadius: '14px', cursor: 'pointer',
                  transition: 'all 0.2s', flexShrink: 0,
                  opacity: (isLoading || !question.trim()) ? 0.5 : 1,
                  boxShadow: '0 4px 16px rgba(99,102,241,0.25)'
                }}
                onMouseEnter={e => { if (!isLoading && question.trim()) e.target.style.backgroundColor = '#4F46E5' }}
                onMouseLeave={e => e.target.style.backgroundColor = '#6366F1'}
              >
                Ask →
              </button>
            </form>
            <p style={{ textAlign: 'center', color: '#1E293B', fontSize: '11px', margin: '10px 0 0' }}>
              FinSight AI may make mistakes — always verify with the source document.
            </p>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}

export default DashboardPage