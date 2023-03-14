import "../styles/globals.css";

import { VotingProvider } from "../context/Voter";
import Navbar from "../components/NavBar/NavBar";

export default function App({ Component, pageProps }) {
  return (
    <VotingProvider>
      <div>
        <Navbar />
        <div>
          <Component {...pageProps} />
        </div>
      </div>
    </VotingProvider>
  );
}
