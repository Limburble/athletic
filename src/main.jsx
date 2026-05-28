import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

if (navigator.storage?.persist) {
  navigator.storage.persist().then(granted => {
    if (granted) console.log('[Athletic] Persistent storage granted — data protected from auto-eviction.')
    else console.warn('[Athletic] Persistent storage not granted — data may be cleared under storage pressure.')
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
