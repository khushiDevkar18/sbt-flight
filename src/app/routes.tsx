import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home";
import NotFoundPage from "../pages/NotFound";
import InventoryPage from "../pages/Inventory";
import NewHome from "../pages/legacy/NewHome";
import NewFormtaxivaxi from "../pages/legacy/NewFormtaxivaxi";
import Booking from "../pages/legacy/Booking";
import FlightBookingComplete from "../features/flight/pages/CompleteFlightbookingtbo";
import Newbookflow from "../pages/legacy/Newbookflow";
import FlightUapibookingflow from "../features/flight/pages/FlightUapibookingflow";
import FlightTbobookingflow from "../features/flight/pages/FlightTbobookingflow";
import CompleteFlightbookinguapi from "../features/flight/pages/Completedflightbookingupi";
import CompleteFlightbookingReturn from "../features/flight/pages/Completeflighbookingreturn";
import DateChange from "../pages/legacy/DateChange";
import ReturnFlightBookingFlow from "../features/flight/pages/ReturnFlightBookingFlow";
import ResultNotFound from "../pages/legacy/ResultNotFound";
import CabResultNotFound from "../pages/legacy/CabResultNotFound";
import TryAgainLater from "../pages/legacy/TryAgainLater";
import SearchHotel from "../pages/legacy/SearchHotel";
import HotelDetail from "../pages/legacy/HotelDetail";
import HotelBooking from "../pages/legacy/HotelBooking";
import HotelPayment from "../pages/legacy/HotelPayment";
import HotelRoom from "../pages/legacy/HotelRoom";
import HotelSearch from "../pages/legacy/HotelSearch";
import RowPage from "../pages/legacy/RowPage";
import SearchCab from "../pages/legacy/SearchCab";
import CabDetails from "../pages/legacy/CabDetails";
import FinalCab from "../pages/legacy/FinalCab";
import HotelBookingCompleted from "../pages/legacy/HotelBookingCompleted";
import SearchBus from "../pages/legacy/SearchBus";
import HotelCancellation from "../pages/legacy/HotelCancellation";
import TESTPAGE from "../pages/legacy/TESTPAGE";
import FinalSearchFlight from "../features/flight/pages/FinalSearchFlight";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/NewHome" element={<NewHome />} />
        <Route path="/SearchFlight" element={<FinalSearchFlight />} />
        <Route path="/FormTaxivaxi" element={<NewFormtaxivaxi />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/bookingProcess" element={<Booking />} />
        <Route path="/TbobookingCompleted" element={<FlightBookingComplete />} />
        <Route path="/BookFlow" element={<Newbookflow />} />
        <Route path="/UapiBookingflow" element={<FlightUapibookingflow />} />
        <Route path="/TboBookingflow" element={<FlightTbobookingflow />} />
        <Route path="/UapibookingCompleted" element={<CompleteFlightbookinguapi />} />
        <Route path="/ReturnbookingCompleted" element={<CompleteFlightbookingReturn />} />
        <Route path="/DateChange" element={<DateChange />} />
        <Route path="/ReturnBookingFlow" element={<ReturnFlightBookingFlow />} />
        <Route path="/ResultNotFound" element={<ResultNotFound />} />
        <Route path="/CabResultNotFound" element={<CabResultNotFound />} />
        <Route path="/tryagainlater" element={<TryAgainLater />} />
        <Route path="/SearchHotel" element={<SearchHotel />} />
        <Route path="/HotelDetail" element={<HotelDetail />} />
        <Route path="/HotelBooking" element={<HotelBooking />} />
        <Route path="/HotelPayment" element={<HotelPayment />} />
        <Route path="/HotelRoom" element={<HotelRoom />} />
        <Route path="/HotelSearch" element={<HotelSearch />} />
        <Route path="/RowPage" element={<RowPage />} />
        <Route path="/SearchCab" element={<SearchCab />} />
        <Route path="/CabDetails" element={<CabDetails />} />
        <Route path="/FinalCab" element={<FinalCab />} />
        <Route path="/HotelBookingCompleted" element={<HotelBookingCompleted />} />
        <Route path="/SearchBus" element={<SearchBus />} />
        <Route path="/HotelCancellation" element={<HotelCancellation />} />
        <Route path="/TESTPAGE" element={<TESTPAGE />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
