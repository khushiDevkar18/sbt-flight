import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import SearchFlight from './SearchFlight';
import FormTaxivaxi from './FormTaxivaxi';
import NewFormtaxivaxi from "./NewFormtaxivaxi";     //NEw
import Booking from './Booking';
import BookingComplete from './BookingComplete';
import BookFlow from './BookFlow';
import Home from './Home';
import SearchHotel from './SearchHotel';
import HotelDetail from './HotelDetail';
import HotelBooking from './HotelBooking';
import HotelPayment from './HotelPayment';
import DateChange from './DateChange';
import FlightBookingComplete from "./CompleteFlightbookingtbo";
import CompleteFlightbookinguapi from "./Completedflightbookingupi";
import Newbookflow from "./Newbookflow";
import PageNotFound from './PageNotFound';
import TryAgainLater from './TryAgainLater';
import HotelSearch from './HotelSearch';
import HotelRoom from './HotelRoom';
import RowPage from './RowPage';
import SearchCab from './SearchCab';
import HotelBookingCompleted from './HotelBookingCompleted';
import ResultNotFound from './ResultNotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import CabResultNotFound from "./CabResultNotFound";
import NewHome from "./NewHome";
import CabDetails from "./CabDetails";
import FinalCab from "./FinalCab";
import SearchBus from "./SearchBus";
import TESTPAGE from "./TESTPAGE";
import HotelCancellation from "./HotelCancellation";
import ScrollToTop from './ScrollToTop';
import FinalSearchFlight from "./FinalSearchFlight";   //NEW
import FlightTbobookingflow from "./FlightTbobookingflow";  //NEW
import FlightUapibookingflow from "./FlightUapibookingflow";  //NEW
import { ToastContainer } from 'react-toastify';
import ReturnFlightBookingFlow from "./ReturnFlightBookingFlow";
import CompleteFlightbookingReturn from "./Completeflighbookingreturn";

const App = () => {
  return (
    <Router>
       <ScrollToTop />
      <div className="app">
        <Header />
        <div className="content">
        <Routes>
         
          <Route exact path="/" element={<Home />}/>
          <Route exact path="/NewHome" element={<NewHome />}/>
          {/* <Route path="/SearchFlight" element={<SearchFlight />}/> */}
           <Route path="/SearchFlight" element={<FinalSearchFlight />}/>   
          {/* <Route path="/FormTaxivaxi" element={<FormTaxivaxi />}/> */}
          <Route path="/FormTaxivaxi" element={<NewFormtaxivaxi/>}/>
          <Route path="/bookingProcess" element={<Booking />}/>
          {/* <Route path="/bookingCompleted" element={<BookingComplete />}/> */}
           <Route path="/TbobookingCompleted" element={<FlightBookingComplete />}/>
          {/* <Route path="/BookFlow" element={<BookFlow />}/> */}
          <Route path="/BookFlow" element={<Newbookflow />}/>
          <Route path="/UapiBookingflow" element={<FlightUapibookingflow /> }/>
          <Route path="/TboBookingflow" element={<FlightTbobookingflow />}/>
          <Route path="/UapibookingCompleted" element={<CompleteFlightbookinguapi/>}/>
          <Route path="/ReturnbookingCompleted" element={<CompleteFlightbookingReturn/>}/>
          <Route path="/DateChange" element={<DateChange />}/>
          <Route path="/ReturnBookingFlow" element={<ReturnFlightBookingFlow/>}/>
          <Route path="/pagenotfound" element={<PageNotFound />}/>
          <Route path="/ResultNotFound" element={<ResultNotFound />}/>
          <Route path="/CabResultNotFound" element={<CabResultNotFound />}/>
          <Route path="/tryagainlater" element={<TryAgainLater />}/>
          <Route path="/SearchHotel" element={<SearchHotel />}/>
          <Route path="/HotelDetail" element={<HotelDetail />}/>
          <Route path="/HotelBooking" element={<HotelBooking />}/>
          <Route path="/HotelPayment" element={<HotelPayment />}/>
          <Route path="/HotelRoom" element={<HotelRoom />}/>
          <Route path="/HotelSearch" element={<HotelSearch />}/>
          <Route path="/RowPage" element={<RowPage />}/>
          <Route path="/SearchCab" element={<SearchCab />}/>
          <Route path="/CabDetails" element={<CabDetails />}/>
          <Route path="/FinalCab" element={<FinalCab />}/>
          <Route path="/HotelBookingCompleted" element={<HotelBookingCompleted />}/>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/SearchBus" element={<SearchBus />} />
          <Route path="/HotelCancellation" element={<HotelCancellation />} />
          <Route path="/TESTPAGE" element={<TESTPAGE />} />
          
        </Routes>
        </div>
        <Footer />
         <ToastContainer 
          position="top-right"
          autoClose={7000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" // or "light", "dark"
        />
      </div>
    </Router>
    
  );
};


export default App;
