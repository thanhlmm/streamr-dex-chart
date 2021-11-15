import { useState } from "react";
import DexVolume from "./components/DexVolume";
import logo from "./logo.svg";

function App() {
  return (
    <div className="App">
      <header className="App-header">Dex volume change</header>

      <DexVolume />
    </div>
  );
}

export default App;
