import { useState } from "react";
import DexVolume from "./components/DexVolume";
import SectorComponent from "./components/SectorComponent";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Top 10 DEX by volume</h1>
      <DexVolume />

      <h1>Blockchain Component Marketcap</h1>
      <iframe
        src="https://count.co/embed/h6ctrZzSJuz"
        width="100%"
        height="900"
        frameBorder=""
      ></iframe>

      <p>
        <em>The data is update every 30 mins</em>
      </p>

      <div>
        <ul>
          <li>
            Blog:{" "}
            <a href="https://thanhle.blog/blog/build-realtime-dashboard-using-centralized-platform-streamr">
              https://thanhle.blog/blog/build-realtime-dashboard-using-centralized-platform-streamr
            </a>
          </li>
          <li>
            Stream Airbyte connector:{" "}
            <a href="https://github.com/devmate-cloud/streamr-airbyte-connectors">
              https://github.com/devmate-cloud/streamr-airbyte-connectors
            </a>
          </li>
          <li>
            Chart source code:{" "}
            <a href="https://github.com/devmate-cloud/streamr-dex-chart">
              https://github.com/devmate-cloud/streamr-dex-chart
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
