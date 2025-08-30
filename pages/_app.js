import '../styles/globals.css'
import { FinanceProvider } from '../context/FinanceContext'

export default function App({ Component, pageProps }) {
  return (
    <FinanceProvider>
      <Component {...pageProps} />
    </FinanceProvider>
  )
}
