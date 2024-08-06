// Import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

// Include your index.css file into the bundle
import "../styles/index.css";

// Import your own components
import Layout from "./layout";
import injectContext from "./store/appContext";

// Wrap Layout with the injectContext
const AppWithContext = injectContext(Layout);

// Render your React application
ReactDOM.render(<AppWithContext />, document.querySelector("#app"));
