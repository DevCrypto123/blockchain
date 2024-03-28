import './App.css'
import Header from "./components/pages/Header.tsx"
import { Routes, Route } from "react-router-dom"


function App() {
    return (
        <div className="App">
          <Header />
            <div className="mainWindow">
                <Routes >
                    <Route path="/" />
                    <Route path="/tokens" />
                </Routes>
            </div>
        </div>
  )
}

export default App
