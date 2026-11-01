import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('Shas Fresh Mart render error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#fffdf8',fontFamily:'DM Sans, sans-serif',color:'#062b53'}}>
          <section style={{maxWidth:520,width:'100%',padding:28,border:'1px solid #e6e9e8',borderRadius:20,background:'#fff',boxShadow:'0 18px 48px #07284619'}}>
            <img src="/shas-logo.svg" alt="Shas Fresh Mart" style={{width:180,maxWidth:'100%',marginBottom:24}} />
            <h1 style={{margin:'0 0 12px'}}>We’re fixing a display issue</h1>
            <p style={{lineHeight:1.6,color:'#526779'}}>The store encountered a browser rendering error. Reload the page to try again. If it continues, share the error code below with the store developer.</p>
            <pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',padding:12,borderRadius:10,background:'#f5f7f8',fontSize:12}}>{String(this.state.error?.message || this.state.error)}</pre>
            <button onClick={() => window.location.reload()} style={{border:0,borderRadius:999,padding:'12px 20px',background:'#062b53',color:'#fff',fontWeight:700,cursor:'pointer'}}>Reload store</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

const root = createRoot(document.getElementById('root'));
root.render(<AppErrorBoundary><App /></AppErrorBoundary>);
