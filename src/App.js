import logo from './logo.svg';
import './App.css';
import Link from '@mui/material/Link';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Link href="sample/10">サンプルページへ</Link>
      </header>
    </div>
  );
}

export default App;
