import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

const ANSWER_TIME = 20 // seconds per question

export default function Game({ roomCode, playerSlot, playerName, roomData, setRoomData, onFinish }) {
  const [localRoom, setLocalRoom] = useState(roomData)
  const [myAnswer, setMyAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(ANSWER_TIME)
  const [animKey, setAnimKey] = useState(0)
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  const isXrated = localRoom?.mode === 'xrated'
  const questions = localRoom?.questions || []
  const qIndex = localRoom?.current_question || 0
  const currentQ = questions[qIndex]
  const isDare = currentQ?.isDare
  const totalQ = questions.length

  const opponentSlot = playerSlot === 'p1' ? 'p2' : 'p1'
  const myScore = localRoom?.[`${playerSlot}_score`] || 0
  const opponentScore = localRoom?.[`${opponentSlot}_score`] || 0
  const opponentName = localRoom?.[`${opponentSlot}_name`] || 'Player 2'
  const myAnswerSaved = localRoom?.[`${playerSlot}_answered`]
  const opponentAnswerSaved = localRoom?.[`${opponentSlot}_answered`]
  const revealed = localRoom?.answers_revealed

  // Subscribe to room changes
  useEffect(() => {
    const channel = supabase
      .channel(`game:${roomCode}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `code=eq.${roomCode}`,
      }, (payload) => {
        setLocalRoom(payload.new)
        setRoomData(payload.new)
        if (payload.new.status === 'finished') onFinish()
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [roomCode])

  // Reset on question change
  useEffect(() => {
    setMyAnswer('')
    setSubmitted(false)
    setTimeLeft(ANSWER_TIME)
    setAnimKey(k => k + 1)
    inputRef.current?.focus()
  }, [qIndex])

  // Timer
  useEffect(() => {
    if (revealed || submitted) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          if (!submitted) submitAnswer('⏱ Time up!')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [qIndex, revealed])

  async function submitAnswer(answer) {
    if (submitted) return
    setSubmitted(true)
    clearInterval(timerRef.current)
    const val = (answer || myAnswer || '').trim() || '(no answer)'
    await supabase
      .from('rooms')
      .update({ [`${playerSlot}_answered`]: val })
      .eq('code', roomCode)
  }

  async function markCorrect(slot) {
    // Only p1 (host) controls scoring after reveal
    const scoreKey = `${slot}_score`
    const currentScore = localRoom[scoreKey] || 0
    await supabase.from('rooms').update({ [scoreKey]: currentScore + 1 }).eq('code', roomCode)
  }

  async function nextQuestion() {
    const next = qIndex + 1
    if (next >= totalQ) {
      await supabase.from('rooms').update({ status: 'finished' }).eq('code', roomCode)
    } else {
      await supabase.from('rooms').update({
        current_question: next,
        p1_answered: null,
        p2_answered: null,
        answers_revealed: false,
      }).eq('code', roomCode)
    }
  }

  async function revealAnswers() {
    await supabase.from('rooms').update({ answers_revealed: true }).eq('code', roomCode)
  }

  const bothAnswered = myAnswerSaved && opponentAnswerSaved
  const isHost = playerSlot === 'p1'
  const timerPct = (timeLeft / ANSWER_TIME) * 100
  const timerColor = timeLeft > 10 ? 'var(--gold)' : timeLeft > 5 ? '#f97316' : 'var(--rose)'

  if (!currentQ) return null

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      padding: '16px', maxWidth: '520px', margin: '0 auto',
      animation: 'fadeUp 0.4s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', marginBottom: '12px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.12em' }}>
          {roomCode} · {isXrated ? '🔥 X-RATED' : '🎯 REGULAR'}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
          Q {qIndex + 1}/{totalQ}
        </div>
      </div>

      {/* Scoreboard */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        {[
          { slot: playerSlot, name: playerName, score: myScore, isMe: true },
          { slot: opponentSlot, name: opponentName, score: opponentScore, isMe: false },
        ].map(p => (
          <div key={p.slot} style={{
            flex: 1, padding: '12px 16px', borderRadius: '16px',
            background: p.isMe ? 'rgba(212,168,67,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${p.isMe ? 'rgba(212,168,67,0.3)' : 'var(--border)'}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>
              {p.isMe ? 'YOU' : 'THEM'}
            </div>
            <div style={{ fontSize: '15px', color: 'var(--cream)', fontStyle: 'italic' }}>{p.name}</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: p.isMe ? 'var(--gold)' : 'var(--cream)', lineHeight: 1.2 }}>{p.score}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '2px',
          background: isXrated ? 'var(--rose)' : 'var(--gold)',
          width: `${((qIndex) / totalQ) * 100}%`,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Question Card */}
      <div key={animKey} style={{
        flex: 1, background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '24px', padding: '28px 24px',
        boxShadow: isXrated ? '0 4px 40px rgba(232,100,122,0.08)' : '0 4px 40px rgba(212,168,67,0.06)',
        animation: 'fadeUp 0.4s ease',
      }}>
        {/* Category badge */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em',
            padding: '4px 12px', borderRadius: '99px',
            background: isDare ? 'rgba(232,100,122,0.15)' : isXrated ? 'rgba(232,100,122,0.1)' : 'rgba(212,168,67,0.1)',
            color: isDare ? 'var(--rose)' : isXrated ? 'var(--rose)' : 'var(--gold)',
            border: `1px solid ${isDare ? 'rgba(232,100,122,0.3)' : isXrated ? 'rgba(232,100,122,0.2)' : 'rgba(212,168,67,0.2)'}`,
          }}>
            {isDare ? '🎲 DARE' : currentQ.category?.toUpperCase()}
          </span>

          {/* Timer */}
          {!revealed && !submitted && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="28" height="28" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke={timerColor} strokeWidth="3"
                  strokeDasharray="94.2" strokeDashoffset={94.2 * (1 - timerPct / 100)}
                  strokeLinecap="round" transform="rotate(-90 18 18)"
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                />
              </svg>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: timerColor, minWidth: '20px' }}>
                {timeLeft}
              </span>
            </div>
          )}
        </div>

        {/* Question */}
        <h2 style={{
          fontSize: 'clamp(20px, 5vw, 28px)', fontStyle: 'italic', lineHeight: 1.35,
          marginBottom: '28px', color: 'var(--cream)',
        }}>
          {currentQ.q}
        </h2>

        {/* Answer input */}
        {!revealed && (
          <div>
            {isDare ? (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  background: 'rgba(232,100,122,0.08)', border: '1px solid rgba(232,100,122,0.2)',
                  borderRadius: '16px', padding: '20px', textAlign: 'center',
                  color: 'var(--rose)', fontStyle: 'italic', fontSize: '16px', marginBottom: '16px',
                }}>
                  Complete this dare then tap Done! 🎲
                </div>
                <button onClick={() => submitAnswer('✅ Done!')} style={btnStyle('rose')}>
                  Done! ✅
                </button>
              </div>
            ) : (
              <div>
                <input
                  ref={inputRef}
                  style={{
                    width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.05)',
                    border: submitted ? '1px solid rgba(212,168,67,0.4)' : '1px solid var(--border)',
                    borderRadius: '16px', color: 'var(--cream)', fontSize: '18px',
                    fontFamily: 'var(--font-display)', outline: 'none', marginBottom: '16px',
                    opacity: submitted ? 0.6 : 1,
                    boxSizing: 'border-box',
                  }}
                  placeholder={submitted ? 'Answer submitted ✓' : 'Type your answer…'}
                  value={myAnswer}
                  onChange={e => setMyAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !submitted && submitAnswer()}
                  disabled={submitted}
                />
                <button onClick={() => submitAnswer()} disabled={submitted || !myAnswer.trim()} style={btnStyle(isXrated ? 'rose' : 'gold', submitted)}>
                  {submitted ? '✓ Submitted — waiting…' : 'Lock In Answer 🔒'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Status indicators */}
        {!revealed && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {[
              { label: playerName, answered: !!myAnswerSaved },
              { label: opponentName, answered: !!opponentAnswerSaved },
            ].map(p => (
              <div key={p.label} style={{
                flex: 1, padding: '10px', borderRadius: '12px', textAlign: 'center',
                background: p.answered ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${p.answered ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                transition: 'all 0.3s',
              }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{p.answered ? '✅' : '⏳'}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: p.answered ? '#4ade80' : 'var(--muted)' }}>
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reveal button (host only, when both answered) */}
        {!revealed && bothAnswered && isHost && (
          <button onClick={revealAnswers} style={{ ...btnStyle('gold'), marginTop: '20px' }}>
            Reveal Answers 👀
          </button>
        )}

        {/* Revealed state */}
        {revealed && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            {/* Correct answer */}
            <div style={{
              background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)',
              borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.12em', marginBottom: '6px' }}>
                CORRECT ANSWER
              </div>
              <div style={{ fontSize: '20px', color: 'var(--gold)', fontStyle: 'italic', fontWeight: 600 }}>
                {currentQ.a}
              </div>
            </div>

            {/* Both answers */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {[
                { name: playerName, answer: myAnswerSaved, slot: playerSlot },
                { name: opponentName, answer: opponentAnswerSaved, slot: opponentSlot },
              ].map(p => (
                <div key={p.slot} style={{
                  flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '14px', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', letterSpacing: '0.08em' }}>
                    {p.name.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '16px', fontStyle: 'italic', color: 'var(--cream)', marginBottom: isHost ? '10px' : '0' }}>
                    {p.answer || '(no answer)'}
                  </div>
                  {isHost && !isDare && (
                    <button onClick={() => markCorrect(p.slot)} style={{
                      padding: '6px 14px', background: 'rgba(34,197,94,0.15)',
                      border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px',
                      color: '#4ade80', fontSize: '12px', cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      ✓ Correct
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isHost && (
              <button onClick={nextQuestion} style={btnStyle(isXrated ? 'rose' : 'gold')}>
                {qIndex + 1 >= totalQ ? 'See Results 🏆' : 'Next Question →'}
              </button>
            )}
            {!isHost && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '13px', marginTop: '8px' }}>
                Waiting for host to continue…
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function btnStyle(color = 'gold', disabled = false) {
  return {
    width: '100%', padding: '16px', border: 'none', borderRadius: '16px',
    background: disabled ? 'rgba(255,255,255,0.06)' :
      color === 'rose' ? 'linear-gradient(135deg, #c04060, var(--rose))' :
        'linear-gradient(135deg, #a07830, var(--gold))',
    color: disabled ? 'var(--muted)' : '#0a0709',
    fontFamily: 'var(--font-display)', fontSize: '18px', fontStyle: 'italic',
    fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
    transition: 'transform 0.15s, opacity 0.15s',
    opacity: disabled ? 0.6 : 1,
  }
}
