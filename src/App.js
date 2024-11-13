import React, { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [ws, setWs] = useState(null);

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://technest.ddns.net:8001/ws");
    setWs(socket);

    socket.onopen = () => {
      socket.send(apiKey);
    };

    socket.onmessage = (event) => {
      // สมมติว่า data เป็น JSON

      // เพิ่มข้อมูลใหม่เข้าใน data state โดยใช้ format เดียวกับ Recharts
      try {
        const jsonData = JSON.parse(event.data);

        const newDataPoint = {
          time: new Date().toLocaleTimeString(),
          power: jsonData["Energy Consumption"].Power,
          voltageL1: jsonData["Voltage"]["L1-GND"],
          voltageL2: jsonData["Voltage"]["L2-GND"],
          voltageL3: jsonData["Voltage"]["L3-GND"],
          pressure: jsonData.Pressure,
          force: jsonData.Force,
          cycleCount: jsonData["Cycle Count"],
          punchPosition: jsonData["Position of the Punch"],
        };
        setData((prevData) => [...prevData, newDataPoint]);
      } catch (error) {
        console.error("Received non-JSON message:", event.data);
      }
    };

    socket.onclose = () => console.log("WebSocket disconnected");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ws) ws.close();
    connectWebSocket();
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <h1 style={{ marginLeft: "10px" }}>WebSocket Recharts Dashboard</h1>
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "20px", marginLeft: "20px" }}
      >
        <label>API Key: </label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Connect</button>
      </form>

      <LineChart width={1350} height={600} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis domain={[-20, 250]} allowDataOverflow={true} />
        <Tooltip />
        <Legend />

        {/* Lines for each data point */}
        <Line type="monotone" dataKey="power" stroke="#8884d8" name="Power" />
        <Line
          type="monotone"
          dataKey="voltageL1"
          stroke="#82ca9d"
          name="Voltage L1-GND"
        />
        <Line
          type="monotone"
          dataKey="voltageL2"
          stroke="#ffc658"
          name="Voltage L2-GND"
        />
        <Line
          type="monotone"
          dataKey="voltageL3"
          stroke="#ff7300"
          name="Voltage L3-GND"
        />
        <Line
          type="monotone"
          dataKey="pressure"
          stroke="#d0ed57"
          name="Pressure"
        />
        <Line type="monotone" dataKey="force" stroke="#a4de6c" name="Force" />
        {/* <Line
          type="monotone"
          dataKey="cycleCount"
          stroke="#8884d8"
          name="Cycle Count"
        />  */}
        <Line
          type="monotone"
          dataKey="punchPosition"
          stroke="#82ca9d"
          name="Position of the Punch"
        />
      </LineChart>
      <div style={{ marginTop: "20px" }}>
        <h2>Power</h2>
        <LineChart width={1350} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[70, 120]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="power" stroke="#8884d8" name="Power" />
        </LineChart>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Voltage</h2>
        <LineChart width={1350} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[200, 250]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="voltageL1"
            stroke="#82ca9d"
            name="Voltage L1-GND"
          />
          <Line
            type="monotone"
            dataKey="voltageL2"
            stroke="#ffc658"
            name="Voltage L2-GND"
          />
          <Line
            type="monotone"
            dataKey="voltageL3"
            stroke="#ff7300"
            name="Voltage L3-GND"
          />
        </LineChart>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Pressure</h2>
        <LineChart width={1350} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis  />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pressure"
            stroke="#d0ed57"
            name="Pressure"
          />
        </LineChart>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Force</h2>
        <LineChart wwidth={1350} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis  />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="force" stroke="#a4de6c" name="Force" />
        </LineChart>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Cycle Count</h2>
        <LineChart width={1350} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cycleCount"
            stroke="#8884d8"
            name="Cycle Count"
          />
        </LineChart>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Position of the Punch</h2>
        <LineChart width={1350} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis  />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="punchPosition"
            stroke="#82ca9d"
            name="Position of the Punch"
          />
        </LineChart>
      </div>
    </div>
  );
}

export default App;
