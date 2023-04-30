import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { JHAList } from "./components/list";
import { Header } from "./components/header";
import { Footer } from "./components/footer";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Header />
      <JHAList />
      <Footer/>

    </>
  );
}

export default App;
