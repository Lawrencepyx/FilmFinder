
import './css/App.css';
/*works since did default export, if not default, do import {MovieDisplay} etc.*/
import MovieDisplay from './components/MovieDisplay';
import Home from "./pages/Home";
import {Routes, Route} from "react-router-dom"
import Likes from "./pages/Likes";
import TopGenres from "./pages/TopGenres";
import NavigationBar from "./components/NavigationBar";
import { MovieProvider} from "./contexts/MovieContext";
function App() {
  /*javascript code here*/
  /*const movieNum=1; condition rendering, if movieNumber is 1, show movie display*/
  

  return (
    /* Must return only one root parent thing*/
    /* Fragment is an placeholder root parent you can do instead <> </> its empty*/
    /*<Text display="Hello World" />*/

    /*Second curly braces is for the object, first curly braces is for the js code variable*/
    /*conditional rendering, if movieNum is 1, display blah */
    <MovieProvider>
      <NavigationBar />

      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/likes" element={<Likes />}/>
          <Route path="/top-genres" element={<TopGenres />}/>
        </Routes>
      </main>
    </MovieProvider>
  );
}
/*

/*using props to pass data to components similar to functions
function Text({display}) {
  return (
  <div>
    <p>{display}</p>
  </div>
  );
}
*/
export default App;
