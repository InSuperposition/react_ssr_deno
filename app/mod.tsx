import React from 'react'
import VersionTest from '../components/version_test.tsx'
import V1 from 'https://raw.githubusercontent.com/InSuperposition/react_ssr_deno/v0.0.1/components/version_test.tsx'
const App = () => {
  const [count, setCount] = React.useState(0)

  return (
    <div>
      <h1>Hello Deno Land!</h1>
      <button onClick={() => setCount(count + 1)}>Click the 🦕</button>
      <p>You clicked the 🦕 {count} times</p>
      <VersionTest />
      <V1 />
    </div>
  )
}

export default App
