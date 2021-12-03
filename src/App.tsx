import { useState } from "react";
import DexVolume from "./components/DexVolume";
import logo from "./logo.svg";

function App() {
  return (
    <div className="App">
      <h1>
        Top 10 DEX by volume
      </h1>
      <DexVolume />

      <div>
        <ul>
          <li>
            Blog: <a href="https://thanhle.blog/blog/build-realtime-dashboard-using-centralized-platform-streamr">https://thanhle.blog/blog/build-realtime-dashboard-using-centralized-platform-streamr</a>
          </li>
          <li>
            Stream Airbyte connector: <a href="https://github.com/devmate-cloud/streamr-airbyte-connectors">https://github.com/devmate-cloud/streamr-airbyte-connectors</a>
          </li>
          <li>
            Chart source code: <a href="https://github.com/devmate-cloud/streamr-dex-chart">https://github.com/devmate-cloud/streamr-dex-chart</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
