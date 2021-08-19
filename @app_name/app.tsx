import React from 'react'

export function AppName(): JSX.Element {
  const [count, setCount] = React.useState(0)

  return (
    <div>
      <h1>Hello Deno Land!</h1>
      <button onClick={() => setCount(count + 1)}>Click the 🦕</button>
      <p>You clicked the 🦕 {count} times</p>
    </div>
  )
}
