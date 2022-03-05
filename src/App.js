import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios" ; 
import toast, { Toaster } from "react-hot-toast";

const initialData = [
  {
    collectionName: "A",
  },
  {
    collectionName: "B",
  },
  {
    collectionName: "C",
  },
  {
    collectionName: "D",
  },
  {
    collectionName: "E",
  },
];

let handleInterval;
const getResultUrl = "https://itunes.apple.com/search?term=";

function App() {
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState([...initialData]);
  const [resultData, setResultData] = useState([...initialData]);
  const [isRender, setIsRender] = useState(false);
  const [clear, setClear] = useState(false)


  const handleData = () => {
    handleInterval = setInterval(() => {
      let addElement = searchResult.shift();
      resultData.shift();
      searchResult.push(addElement);
      setSearchResult([...searchResult]);
      resultData.push(addElement);
      setResultData([...resultData]);
    }, 1000);

  };

  useEffect(() => {
    handleData();
  }, []);

  useEffect(() => {
    if (searchResult && isRender) {
      handleData();
      setIsRender(false);
    }
  }, [searchResult]);

  const getResultData = async (searchVal) => {
    try {
      const resp = await axios.get(getResultUrl + searchVal)
      const sorted = resp.data.results.sort((a, b) => a.collectionName > b.collectionName ? 1 : -1).slice(0,5)
      setIsRender(true);
      setClear(!clear)
      clearInterval(handleInterval);
      setResultData([...initialData]);
      setSearchResult([...sorted]);
    } catch (ex) {
      console.log('++ handle exception ++ ', ex.message)
      toast.error("Check for CORS error.")
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && e.target.value.length ) {
      getResultData(e.target.value);
    } else if(e.key === "Enter" && !e.target.value.length){
      console.log('handle empty string search +++ reset state' )     
      setIsRender(true);
      clearInterval(handleInterval);
      setSearchResult([...initialData]);
      setClear(!clear)
      
    }   
  };

  const handleClear = () => {
      setSearchKey("")
      setIsRender(true);
      clearInterval(handleInterval);
      setSearchResult([...initialData]);
      setClear(!clear)
  }

  return (
    <div className="App">
      <div className="search-panel">
        <div style={{ display: 'flex' }}>
          <input
            type="search"
            className="search-box"
            value={searchKey} 
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Search Band"
            onKeyPress={handleSearch}
          />
          { searchKey && !clear && <button style={{width: '8%'}} > enter </button> }
          { searchKey && clear && <button style={{width: '8%'}} onClick={handleClear} > clear </button> }

        </div>
        <div className="result-panel">
          {resultData?.map((item, index) => (
            <div className="result-item" key={index}>
              {
                item && 
                <>
                  {item.collectionName} { item.trackName ? `( ${item.trackName})` : '' }
                </>
              }
            </div>
          ))}
        </div>
      </div>
      <div><Toaster/></div>
    </div>
  );
}

export default App;
