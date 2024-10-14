import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import SearchFlight from './SearchFlight';
import FormTaxivaxi from './FormTaxivaxi';
import Booking from './Booking';
import BookingComplete from './BookingComplete';
import Home from './Home';
import PageNotFound from './PageNotFound';
import TryAgainLater from './TryAgainLater';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="content">
        <Routes>
          <Route exact path="/" element={<Home />}/>
          <Route path="/SearchFlight" element={<SearchFlight />}/>
          <Route path="/FormTaxivaxi" element={<FormTaxivaxi />}/>
          <Route path="/bookingProcess" element={<Booking />}/>
          <Route path="/bookingCompleted" element={<BookingComplete />}/>
          <Route path="/pagenotfound" element={<PageNotFound />}/>
          <Route path="/tryagainlater" element={<TryAgainLater />}/>
        </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    // <Router>
      // <Routes>
      //   <Route exact path="/" element={<Home />}/>
      //   <Route path="/SearchFlight" element={<SearchFlight />}/>
      //   <Route path="/bookingProcess" element={<Booking />}/>
      //   <Route path="/bookingCompleted" element={<BookingComplete />}/>
      //   <Route path="/pagenotfound" element={<PageNotFound />}/>
      //   <Route path="/tryagainlater" element={<TryAgainLater />}/>
      // </Routes>
      
      
    // </Router>
  );
};


export default App;
