import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import SearchFlight from './SearchFlight';
import FormTaxivaxi from './FormTaxivaxi';
import Booking from './Booking';
import BookingComplete from './BookingComplete';
import Home from './Home';
import SearchHotel from './SearchHotel';
import HotelDetail from './HotelDetail';
import HotelBooking from './HotelBooking';
import HotelPayment from './HotelPayment';
import PageNotFound from './PageNotFound';
import TryAgainLater from './TryAgainLater';
import HotelSearch from './HotelSearch';
import RowPage from './RowPage';
import HotelBookingCompleted from './HotelBookingCompleted';
import ResultNotFound from './ResultNotFound';
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
          <Route path="/ResultNotFound" element={<ResultNotFound />}/>
          <Route path="/tryagainlater" element={<TryAgainLater />}/>
          <Route path="/SearchHotel" element={<SearchHotel />}/>
          <Route path="/HotelDetail" element={<HotelDetail />}/>
          <Route path="/HotelBooking" element={<HotelBooking />}/>
          <Route path="/HotelPayment" element={<HotelPayment />}/>
          <Route path="/HotelSearch" element={<HotelSearch />}/>
          <Route path="/RowPage" element={<RowPage />}/>
          <Route path="/HotelBookingCompleted" element={<HotelBookingCompleted />}/>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    
  );
};


export default App;
