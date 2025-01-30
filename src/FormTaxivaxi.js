import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { parseString } from 'xml2js';
import './styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse,parseISO,isValid  } from 'date-fns';
import "rc-slider/assets/index.css";
import IconLoader from './IconLoader';


const FormTaxivaxi = () => {
const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const searchParams = new URLSearchParams(window.location.search);
  // const taxivaxidata = searchParams.get('taxivaxidata');
  const searchParams = new URLSearchParams(window.location.search);
  const taxivaxidata = searchParams.get('taxivaxidata');
   
  useEffect(() => {
    
    setLoading(true);
    let airlineResponseData;
    let airportResponseData;
    let apiairportData;

      const apiairportss = async () => {
              try {
              const response = await axios.get('https://selfbooking.taxivaxi.com/api/airports');
              apiairportData = response.data;
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
                  const searchfromMatch = searchfrom.match(/\((\w+)\)/);
                  const searchfromCode = searchfromMatch[1];
                  const searchto = formtaxivaxiData['to_city']; 
                  const searchtoMatch = searchto.match(/\((\w+)\)/);
                  const searchtoCode = searchtoMatch[1];
                  const searchdeparture = formtaxivaxiData['departure_date'];       
                  const formattedsearchdeparture = formatDate(searchdeparture);
                  const spoc_email = formtaxivaxiData['email'];
                  const additional_emails = formtaxivaxiData['additional_emails'];
                  const ccmail = formtaxivaxiData['cc_email'];
                  const client_name = formtaxivaxiData['client_name'];
                  const spoc_name = formtaxivaxiData['spoc_name'];
                  const markup = formtaxivaxiData['markup_details'];
                  const booking_id = formtaxivaxiData['booking_id'];
                  const no_of_seats = formtaxivaxiData['no_of_seats'];
                  const request_id = formtaxivaxiData['request_id'];
                  const request_type = formtaxivaxiData['request_type'];
                  const client_id = formtaxivaxiData['client_id'];
                  const is_gst_benefit = formtaxivaxiData['is_gst_benefit'];
                  const flight_type = formtaxivaxiData['flight_type'];
                  
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
                    <air:LowFareSearchReq TargetBranch="P7206253" TraceId="TVSBP001" SolutionResult="false" DistanceUnits="Km" AuthorizedBy="TAXIVAXI" xmlns:air="http://www.travelport.com/schema/air_v52_0" xmlns:com="http://www.travelport.com/schema/common_v52_0">
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

                  sessionStorage.setItem('searchdata', soapEnvelope);

                  const response = await axios.post(
                    'https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeFlightAirServiceRequest', 
                    soapEnvelope, { headers: { 'Content-Type': 'text/xml'  }}
                  );
 console.log("response",response)
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
                      requesttype: request_type,
                      spocemail: spoc_email,
                      additionalemail: additional_emails,
                      ccmail: ccmail,
                      clientname:client_name,
                      spocname:spoc_name,
                      markupdata: markup,
                      bookingid: booking_id,
                      no_of_seats: no_of_seats,
                      request_id: request_id,
                      clientid: client_id,
                      is_gst_benefit: is_gst_benefit,
                      flighttype:flight_type
                  };
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
            await apiairportss();
            await fetchData();
        } catch (error) {
            console.error(error);
            navigate('/tryagainlater');
        } finally {
            setLoading(false);
        }
      };  
        
          const formtaxivaxiData = JSON.parse(decodeURIComponent(taxivaxidata));

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