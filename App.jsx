import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Lobby from './components/Lobby'
import Game from './components/Game'
import Results from './components/Results'

export default function App() {
  const [screen, setScreen] = useState('lobby') // lobby | waiting | game | results
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [playerSlot, setPlayerSlot] = useState(null) // 'p1' | 'p2'
  const [roomData, setRoomData] = useState(null)
  const [error, setError] = useState('')

  // Subscribe to room changes
  useEffect(() => {
    if (!roomCode) return
    const channel = supabase
      .channel(`room:${roomCode}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `code=eq.${roomCode}`
      }, (payload) => {
        setRoomData(payload.new)
        if (payload.new.status === 'playing' && screen === 'waiting') {
          setScreen('game')
        }
        if (payload.new.status === 'finished') {
          setScreen('results')
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [roomCode, screen])

  async function createRoom(name, mode) {
    setError('')
    const { generateRoomCode, getQuestionSet } = await import('./questions.js')
    const code = generateRoomCode()
    const questions = getQuestionSet(mode)

    const { data, error: err } = await supabase
      .from('rooms')
      .insert({
        code,
        mode,
        questions,
        status: 'waiting',
        p1_name: name,
        p2_name: null,
        p1_score: 0,
        p2_score: 0,
        current_question: 0,
        p1_answered: null,
        p2_answered: null,
        answers_revealed: false,
      })
      .select()
      .single()

    if (err) { setError('Failed to create room. Check Supabase setup.'); return }
    setRoomCode(code)
    setPlayerName(name)
    setPlayerSlot('p1')
    setRoomData(data)
    setScreen('waiting')
  }

  async function joinRoom(name, code) {
    setError('')
    const { data, error: err } = await supabase
      .from('rooms')
      .select()
      .eq('code', code.toUpperCase())
      .single()

    if (err || !data) { setError('Room not found. Check the code.'); return }
    if (data.p2_name) { setError('Room is full!'); return }
    if (data.status !== 'waiting') { setError('Game already started.'); return }

    const { data: updated, error: updateErr } = await supabase
      .from('rooms')
      .update({ p2_name: name, status: 'playing' })
      .eq('code', code.toUpperCase())
      .select()
      .single()

    if (updateErr) { setError('Failed to join room.'); return }
    setRoomCode(code.toUpperCase())
    setPlayerName(name)
    setPlayerSlot('p2')
    setRoomData(updated)
    setScreen('game')
  }

  function reset() {
    setScreen('lobby')
    setRoomCode('')
    setPlayerName('')
    setPlayerSlot(null)
    setRoomData(null)
    setError('')
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient background orbs */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(212,168,67,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 90%, rgba(232,100,122,0.07) 0%, transparent 60%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {screen === 'lobby' && (
          <Lobby onCreate={createRoom} onJoin={joinRoom} error={error} />
        )}
        {screen === 'waiting' && (
          <WaitingRoom roomCode={roomCode} playerName={playerName} roomData={roomData} />
        )}
        {screen === 'game' && (
          <Game
            roomCode={roomCode}
            playerSlot={playerSlot}
            playerName={playerName}
            roomData={roomData}
            setRoomData={setRoomData}
            onFinish={() => setScreen('results')}
          />
        )}
        {screen === 'results' && (
          <Results roomData={roomData} onReset={reset} />
        )}
      </div>
    </div>
  )
}

function WaitingRoom({ roomCode, playerName, roomData }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      animation: 'fadeUp 0.5s ease',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: '32px', fontStyle: 'italic',
        color: 'var(--gold)', marginBottom: '8px',
      }}>Waiting for player 2…</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '32px', fontSize: '18px' }}>
        Share your room code
      </p>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '32px 48px', textAlign: 'center',
        boxShadow: '0 0 60px rgba(212,168,67,0.08)',
      }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
          ROOM CODE
        </div>
        <div style={{
          fontSize: '52px', fontWeight: '700', letterSpacing: '0.15em',
          fontFamily: 'var(--font-mono)', color: 'var(--gold)',
          textShadow: '0 0 30px rgba(212,168,67,0.4)',
        }}>
          {roomCode}
        </div>
        <div style={{ marginTop: '16px', fontSize: '16px', color: 'var(--cream)', opacity: 0.6 }}>
          Logged in as <strong>{playerName}</strong>
        </div>
      </div>
      <p style={{ marginTop: '24px', color: 'var(--muted)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
        Game starts automatically when they join
      </p>
    </div>
  )
}
