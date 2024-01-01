import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import {AuthProvider} from './Context/AuthContext.tsx'
import { QueryClientProvider, QueryClient} from '@tanstack/react-query'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
                <App />
          </AuthProvider>
        </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
