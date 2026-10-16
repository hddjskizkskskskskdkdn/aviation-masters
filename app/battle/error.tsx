'use client'

export default function BattleError({ reset }: { reset: () => void }) {
  return (
    <main className="auth-shell">
      <section className="auth-card" role="alert">
        <span className="auth-brand">AVIATION MASTERS / BATTLE</span>
        <h1>Battle systems offline.</h1>
        <p>The simulator could not load this mission. Your account is safe. Try reloading the battle module.</p>
        <button className="auth-submit battle-primary" type="button" onClick={reset}>RELOAD BATTLE</button>
        <a className="auth-switch" href="/">Return to archive</a>
      </section>
    </main>
  )
}
