import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { parseString } from 'xml2js';
import { Nav, Modal, Button } from 'react-bootstrap';
import './styles.css';
import CryptoJS from 'crypto-js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse,parseISO,isValid  } from 'date-fns';
import Slider from 'rc-slider';
import "rc-slider/assets/index.css";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import IconLoader from './IconLoader';


const FormTaxivaxi = () => {
const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  const [emptaxivaxi, setEmptaxivaxi] = useState([]);
  // const searchParams = new URLSearchParams(window.location.search);
  // const taxivaxidata = searchParams.get('taxivaxidata');
  const searchParams = new URLSearchParams(window.location.search);
  const taxivaxidata = searchParams.get('taxivaxidata');


  
//   alert('okay', taxivaxidata);
//   console.log('data', taxivaxidata);
  

  const [Airports, setAirportOptions] = useState([]);
  const [allAirportsOrigin, setAllAirportsOrigin] = useState([]);
  const [airportOriginCodes, setAirportOriginCodes] = useState(null);
  const [allAirportsDestination, setAllAirportsDestination] = useState([]);
  const [airportDestinationCodes, setAirportDestinationCodes] = useState(null);
 
  useEffect(() => {
    
    setLoading(true);
    let airlineResponseData;
    let airportResponseData;
    let apiairportData;
    

      const makeAirlineRequest = async () => {
      try {
          const username = 'Universal API/uAPI6514598558-21259b0c';
          const password = 'tN=54gT+%Y';
          const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
          const airlineRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:util="http://www.travelport.com/schema/util_v50_0" xmlns:com="http://www.travelport.com/schema/common_v50_0">
          <soapenv:Header/>
          <soapenv:Body>
              <util:ReferenceDataRetrieveReq AuthorizedBy="TAXIVAXI" TargetBranch="P4451438" TraceId="AR45JHJ" TypeCode="AirAndRailSupplierType">
                  <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
                  <util:ReferenceDataSearchModifiers MaxResults="99999" StartFromResult="0"/>
              </util:ReferenceDataRetrieveReq>
          </soapenv:Body>
          </soapenv:Envelope>`;
          
          const airlineresponse = await axios.post(
            'https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeFlightRequest', 
            airlineRequest, { headers: { 'Content-Type': 'text/xml'  }}
          );
          airlineResponseData = airlineresponse.data;
          // setAirlineResponse(airlineresponse);
          
      } catch (error) {
          console.error(error);
          // navigate('/tryagainlater');
          }
          
      };

      const makeAirportRequest = async () => {
      try {
          const username1 = 'Universal API/uAPI6514598558-21259b0c';
          const password1 = 'tN=54gT+%Y';
          const authHeader1 = `Basic ${btoa(`${username1}:${password1}`)}`;
          const airportRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:util="http://www.travelport.com/schema/util_v50_0" xmlns:com="http://www.travelport.com/schema/common_v50_0">
          <soapenv:Header/>
          <soapenv:Body>
          <util:ReferenceDataRetrieveReq AuthorizedBy="TAXIVAXI" TargetBranch="P4451438" TraceId="AV145ER" TypeCode="CityAirport">
              <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
              <util:ReferenceDataSearchModifiers MaxResults="99999" StartFromResult="0"/>
          </util:ReferenceDataRetrieveReq>
          </soapenv:Body>
      </soapenv:Envelope>`;
      const airportResponse = await axios.post(
        'https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeFlightRequest', 
        airportRequest, { headers: { 'Content-Type': 'text/xml'  }}
      );
          airportResponseData = airportResponse.data;
          // setAirportResponse(airportResponse);
          
          parseString(airportResponse.data, { explicitArray: false }, (errs, airportresult) => {
              if (errs) {
              console.error('Error parsing XML:', errs);
              return;
              }
              const airportlist = airportresult['SOAP:Envelope']['SOAP:Body']['util:ReferenceDataRetrieveRsp']['util:ReferenceDataItem'];
              setAirportOptions(airportlist);
              const tempAirportCodes = {};
              airportlist.forEach((airport) => {
                      tempAirportCodes[airport.$.Code] = airport.$.Name;
                  });
              
              setAirportOriginCodes(tempAirportCodes);
              setAllAirportsOrigin(airportlist);

              setAirportDestinationCodes(tempAirportCodes);
              setAllAirportsDestination(airportlist);
          });
          
      } catch (error) {
          console.error(error);
              // navigate('/tryagainlater');
              }
              
      };

      const apiairportss = async () => {
              try {
              const response = await axios.get('https://selfbooking.taxivaxi.com/api/airports');
              apiairportData = response.data;
              // setAirports(response.data);
              } catch (error) {
              console.error('Error fetching data:', error);
              }
      };
      
      const fetchData = async () => {
              try {
                  setLoading(true);
                  const formatDate = (inputDate) => {
                      const parsedDate = parseISO(inputDate); 
                      if (!isValid(parsedDate)) {
                          return null;
                      } else {
                          const formattedDate = format(parsedDate, 'yyyy-MM-dd');
                          return formattedDate;
                      }
                  };
                  const searchfrom = formtaxivaxiData['from_city'];
                //   console.log('searchfrom', searchfrom);
                  const searchfromMatch = searchfrom.match(/\((\w+)\)/);
                  const searchfromCode = searchfromMatch[1];
                //   console.log('sechfromcode', searchfromCode);
                  const searchto = formtaxivaxiData['to_city']; 
                  const searchtoMatch = searchto.match(/\((\w+)\)/);
                  const searchtoCode = searchtoMatch[1];
                  const searchdeparture = formtaxivaxiData['departure_date'];       
                //   const searchdeparture = formtaxivaxiData['departure_date'].split('-').reverse().join('/');
                  const formattedsearchdeparture = formatDate(searchdeparture);
                  const spoc_email = formtaxivaxiData['email'];
                  const client_name = formtaxivaxiData['client_name'];
                  const spoc_name = formtaxivaxiData['spoc_name'];
                  const markup = formtaxivaxiData['markup_details'];
                  const booking_id = formtaxivaxiData['booking_id'];
                  const no_of_seats = formtaxivaxiData['no_of_seats'];
                  const request_id = formtaxivaxiData['request_id'];
                  
                  const adult = no_of_seats;
                  const child = 0;
                  const infant = 0;
                  const classtype = formtaxivaxiData['seat_type'];
                  let cabinclass = classtype;
                  let bookingtype = formtaxivaxiData['trip_type'] === "Round Trip" ? "Return" : "oneway";
                  if (classtype === "Economy/Premium Economy") {
                      cabinclass = "Economy";
                  }
                  let searchreturnDate = null;
                  let formattedsearchreturnDate = null;
                  if(bookingtype === "Return"){
                    searchreturnDate = formtaxivaxiData['return_date'];
                    formattedsearchreturnDate = searchreturnDate ? formatDate(searchreturnDate) : null;
                  }

                  
                  
                  const dynamicCityCode = searchfromCode; 
                  const dynamicDestinationCode = searchtoCode; 
                  const dynamicDepTime = formattedsearchdeparture;
                  const returndynamicDepTime = formattedsearchreturnDate;
                  const dynamicCabinType = cabinclass; 
                  const PassengerCodeADT = adult; 
                  const PassengerCodeCNN = child; 
                  const PassengerCodeINF = infant; 
                //   console.log('helo');
                  const createSoapEnvelope = (
                      cityCode,
                      destinationCode,
                      depTime,
                      returnDepTime,
                      cabinType,
                      passengerCodeADT,
                      passengerCodeCNN,
                      passengerCodeINF
                  ) => {
                  
                      const generatePassengerElements = (age, count,type) => {
                      return Array.from({ length: count }, (_, index) => `<com:SearchPassenger Code="${type}"${age ? ` Age="${age}"` : ''}/>`).join('');
                      };
                      const searchPassengerADT = generatePassengerElements('', passengerCodeADT,'ADT');
                      const searchPassengerCNN = generatePassengerElements('10', passengerCodeCNN,'CNN');
                      const searchPassengerINF = generatePassengerElements('01', passengerCodeINF,'INF');
                      
                      const returnLegSection = returnDepTime
                      ? `<air:SearchAirLeg>
                          <air:SearchOrigin>
                          <com:CityOrAirport Code="${destinationCode}"/>
                          </air:SearchOrigin>
                          <air:SearchDestination>
                          <com:CityOrAirport Code="${cityCode}"/>
                          </air:SearchDestination>
                          <air:SearchDepTime PreferredTime="${returnDepTime}"/>
                      </air:SearchAirLeg>`
                      : '';
                  
                      return `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                    <air:LowFareSearchReq TargetBranch="P4451438" TraceId="TVSBP001" SolutionResult="false" DistanceUnits="Km" AuthorizedBy="TAXIVAXI" xmlns:air="http://www.travelport.com/schema/air_v52_0" xmlns:com="http://www.travelport.com/schema/common_v52_0">
                        <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
                        <air:SearchAirLeg>
                            <air:SearchOrigin>
                                <com:CityOrAirport Code="${cityCode}"/>
                            </air:SearchOrigin>
                            <air:SearchDestination>
                                <com:CityOrAirport Code="${destinationCode}"/>
                            </air:SearchDestination>
                            <air:SearchDepTime PreferredTime="${depTime}"/>
                        </air:SearchAirLeg>
                        ${returnLegSection}
                        <air:AirSearchModifiers ETicketability="Yes" FaresIndicator="AllFares">
                            <air:PreferredProviders>
                                <com:Provider Code="1G"/>
                                <com:Provider Code="ACH"/>
                            </air:PreferredProviders>
                            <air:PermittedCabins>
                                <com:CabinClass Type="${cabinType}"/>
                            </air:PermittedCabins>
                        </air:AirSearchModifiers>
                        ${searchPassengerADT}
                        ${searchPassengerCNN}
                        ${searchPassengerINF}
                    </air:LowFareSearchReq>
                </soap:Body>
                </soap:Envelope>`;
                  };
                  const soapEnvelope = createSoapEnvelope(
                      dynamicCityCode,
                      dynamicDestinationCode,
                      dynamicDepTime,
                      returndynamicDepTime,
                      dynamicCabinType,
                      PassengerCodeADT,
                      PassengerCodeCNN,
                      PassengerCodeINF,
                  );
                  const username = 'Universal API/uAPI6514598558-21259b0c';
                  const password = 'tN=54gT+%Y'; 
                  const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

                  sessionStorage.setItem('searchdata', soapEnvelope);
                //   console.log('soapenv', soapEnvelope); 

                const response = await axios.post(
                    'https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeFlightAirServiceRequest', 
                    soapEnvelope, { headers: { 'Content-Type': 'text/xml'  }}
                  );
                  // console.log(airlineResponseData);
                  // console.log(airportResponseData);
                  const responseData = {
                      responsedata: response.data,
                      searchfromcity: searchfrom,
                      searchtocity: searchto,
                      searchdeparture: searchdeparture,
                      searchreturnd: searchreturnDate,
                      airlinedata: airlineResponseData,
                      airportData: airportResponseData,
                      selectadult: adult,
                      selectchild: child,
                      selectinfant: infant,
                      selectclass: cabinclass,
                      bookingtype: bookingtype,
                      apiairportsdata: apiairportData,
                      fromcotrav: '1',
                      spocemail: spoc_email,
                      clientname:client_name,
                      spocname:spoc_name,
                      markupdata: markup,
                      bookingid: booking_id,
                      no_of_seats: no_of_seats,
                      request_id: request_id,
                  };
                  console.log('resp', responseData);
 
                  
                  navigate('/SearchFlight', { state: { responseData } });
                  await new Promise(resolve => setTimeout(resolve, 1000));
              
              } catch (error) {
                  navigate('/tryagainlater');
              }
              finally{
                setLoading(false);
              }
              
      };
      const executeRequestsSequentially = async () => {
        try {
            setLoading(true); 
            await makeAirlineRequest();
            await makeAirportRequest();
            await apiairportss();
            await fetchData();
        } catch (error) {
            console.error(error);
            navigate('/tryagainlater');
        } finally {
            setLoading(false); // Hide loader when all async operations are completed
        }
      };  
        
          const formtaxivaxiData = JSON.parse(decodeURIComponent(taxivaxidata));
          console.log('formtaxivaxiData', formtaxivaxiData); 
          if (formtaxivaxiData) {
            setLoading(true)
            sessionStorage.setItem('formtaxivaxiData', JSON.stringify(formtaxivaxiData));
              
              executeRequestsSequentially().then(() => {
                setLoading(true); 
              });
          }
  },[[navigate, taxivaxidata]]);

  

  return (
    
   
    
      <div className="yield-content">
        {loading && (<div className="page-center-loaderr flex items-center justify-center">
                            <div className="big-loader flex items-center justify-center">
                                <IconLoader className="big-icon animate-[spin_2s_linear_infinite]" />
                                <p className="text-center ml-4 text-gray-600 text-lg">
                                Retrieving flight details. Please wait a moment.
                                </p>
                            </div>
                        </div>
       )}
        </div >
    
  );
}

export default FormTaxivaxi;                                