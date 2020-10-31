import React, { useState } from 'react'

export default function Login({ handleSetUsername }) {
  const [name, setName] = useState('')

  return (
    <div className="App">
      <form
        onSubmit={e => {
          e.preventDefault()
          handleSetUsername(name)
        }}
      >
        <div className="App-header">
          Enter Username{' '}
          <input className="input" value={name} onChange={e => setName(e.target.value)} />
          <button>Submit</button>
        </div>
      </form>
    </div>
  )
}
