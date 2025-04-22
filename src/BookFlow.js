import React, { useEffect, useState, useRef } from 'react';
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
import CONFIG from "./config";

const BookFlow = () => {
    // console.log('asdfasdfahello1');
    const [loading, setLoading] = useState(false);
    const searchParams = new URLSearchParams(window.location.search);
    const taxivaxidata = searchParams.get('taxivaxidata');
    const navigate = useNavigate();
    const [SegmentList, setSegment] = useState([]);
    const segmentRef = useRef([]);
    // console.log('segmentRef', segmentRef);
    const [HostList, setHostlist] = useState([]);
    const hostRef = useRef([]);
    // console.log('hostRef', hostRef);
    const [FareList, setFarelist] = useState([]);
    const fareRef = useRef([]);
    // console.log('fareRef', fareRef);
    const flightdetailRef = useRef([]);
    const [priceParse, setpriceparse] = useState([]);
    const priceparseRef = useRef([]);
    const [segmentpriceParse, setsegmentpriceparse] = useState([]);
    const segmentpriceparseRef = useRef([]);
    const [flightairoption, setFlightAirOptions] = useState([]);
    const flightairoptionRef = useRef([]);
    const [Airlines, setAirlineOptions] = useState([]);
      const [Airports, setAirportOptions] = useState([]);
      const isPriceLoadingRef = useRef(false);
const isReservationRef = useRef(false);
const Targetbranch = 'P4451438';
    
    useEffect(() => {
        setLoading(true);
        let airlineResponseData;
        let airportResponseData;
        let apiairportData;

        const makeAirlineRequest = async () => {
            // console.log('hi1');
        try {
             
            const airlineRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:util="http://www.travelport.com/schema/util_v50_0" xmlns:com="http://www.travelport.com/schema/common_v50_0">
            <soapenv:Header/>
            <soapenv:Body>
                <util:ReferenceDataRetrieveReq AuthorizedBy="TAXIVAXI" TargetBranch="${Targetbranch}" TraceId="AR45JHJ" TypeCode="AirAndRailSupplierType">
                    <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
                    <util:ReferenceDataSearchModifiers MaxResults="99999" StartFromResult="0"/>
                </util:ReferenceDataRetrieveReq>
            </soapenv:Body>
            </soapenv:Envelope>`;
            
            const airlineresponse = await axios.post(
                `${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightRequest`, 
                airlineRequest, { headers: { 'Content-Type': 'text/xml'  }}
            );
            airlineResponseData = airlineresponse.data;
            parseString(airlineResponseData, { explicitArray: false }, (errs, airlineresult) => {
                    if (errs) {
                      console.error('Error parsing XML:', errs);
                      return;
                    }
                    const airlinelist = airlineresult['SOAP:Envelope']['SOAP:Body']['util:ReferenceDataRetrieveRsp']['util:ReferenceDataItem'];
                    setAirlineOptions(airlinelist);
                  });
            
        } catch (error) {
            console.error(error);
            // navigate('/tryagainlater');
            }
            
        };

        const makeAirportRequest = async () => {
        try {
            
            const airportRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:util="http://www.travelport.com/schema/util_v50_0" xmlns:com="http://www.travelport.com/schema/common_v50_0">
            <soapenv:Header/>
            <soapenv:Body>
            <util:ReferenceDataRetrieveReq AuthorizedBy="TAXIVAXI" TargetBranch="${Targetbranch}" TraceId="AV145ER" TypeCode="CityAirport">
                <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
                <util:ReferenceDataSearchModifiers MaxResults="99999" StartFromResult="0"/>
            </util:ReferenceDataRetrieveReq>
            </soapenv:Body>
        </soapenv:Envelope>`;
        const airportResponse = await axios.post(
            `${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightRequest`, 
            airportRequest, { headers: { 'Content-Type': 'text/xml'  }}
        );
            airportResponseData = airportResponse.data;
            parseString(airportResponseData, { explicitArray: false }, (errs, airportresult) => {
                    if (errs) {
                      console.error('Error parsing XML:', errs);
                      return;
                    }
                    const airportlist = airportresult['SOAP:Envelope']['SOAP:Body']['util:ReferenceDataRetrieveRsp']['util:ReferenceDataItem'];
                    setAirportOptions(airportlist);
                    
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
                //   console.log('airports',apiairportData);
                } catch (error) {
                console.error('Error fetching data:', error);
                }
        };
        
        const fetchData = async () => {
                try {
                    // setLoading(true);
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
                         
                    const departureDateTime = formtaxivaxiData['departure_time']; 
                    const arrivalDateTime = formtaxivaxiData['arrival_time'];
                    // console.log('departureDateTime', departureDateTime);
                    // console.log('arrivalDateTime', arrivalDateTime);
                    const dateObj = new Date(departureDateTime);
                    const departureDate = dateObj.toLocaleDateString('en-CA'); // 'YYYY-MM-DD' format in local time
                    // console.log('departureDate', departureDate);
                    const departureTime = dateObj.toISOString().split('T')[1].slice(0, 5); 
                    const fare_type = formtaxivaxiData['fare_type'];
                    const booking_id = formtaxivaxiData['booking_id'];
                    const no_of_seats = formtaxivaxiData['no_of_seats'];
                    // console.log('asdfasd');
                    const client_id = formtaxivaxiData['client_id'];
                    const is_gst_benefit = formtaxivaxiData['is_gst_benefit'];
                    // console.log('log1');
                    const access_token = formtaxivaxiData['access_token'];
                    // const providercode = formtaxivaxiData['provider_code'];
                    const providercode = formtaxivaxiData['provider_code']?.split(",")[0].trim();
                    const no_of_stops = formtaxivaxiData['no_of_stops'];   
                    const markup_price = formtaxivaxiData['fare_markup'][0] || 0;
                    // console.log('markup_price', markup_price);
                    // const carrier = formtaxivaxiData['carrier']; 
                    // const flightNumber = formtaxivaxiData['flight_no'].split(',')[0].replace(new RegExp(`^${carrier}`, 'i'), '').trim();  // Remove the provider code from the flight number
                    // console.log('helo', flightNumber);
                    const carrier = formtaxivaxiData?.carrier?.split(',')[0]?.trim(); // Ensure valid data and pick the first carrier
                    const flightNumber = formtaxivaxiData?.flight_no?.split(', ').map(flight => flight.replace(carrier, '').trim());
                    // console.log('helo', flightNumber);  
                    const adult = no_of_seats;
                    const child = 0;
                    const infant = 0;
                    const classtype = formtaxivaxiData['seat_type'];
                    let cabinclass = classtype;
                    let bookingtype = formtaxivaxiData['is_return'] === "1" ? "Return" : "oneway";
                    if (classtype === "Economy/Premium Economy") {
                        cabinclass = "Economy";
                    }
                    let searchreturnDate = null;
                    let formattedsearchreturnDate = null;
                    let arrivalTime = null;

                    if (bookingtype === "Return") {
                        searchreturnDate = formtaxivaxiData['return_date'];
                        formattedsearchreturnDate = searchreturnDate ? formatDate(searchreturnDate) : null;

                        const arrivalDateTime = formtaxivaxiData['arrival_time']; 
                        const arrivalDateObj = new Date(arrivalDateTime);
                        arrivalTime = arrivalDateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); 
                    }

                    
                    
                    const dynamicCityCode = searchfromCode; 
                    const dynamicDestinationCode = searchtoCode; 
                    const dynamicDepTime = departureDate;
                    const returndynamicDepTime = formattedsearchreturnDate;
                    const dynamicCabinType = cabinclass; 
                    const PassengerCodeADT = adult; 
                    const PassengerCodeCNN = child; 
                    const PassengerCodeINF = infant; 
                      // console.log('helo');
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
                        // console.log('heloq1');
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
                        <air:LowFareSearchReq TargetBranch="${Targetbranch}" TraceId="TVSBP001" SolutionResult="false" DistanceUnits="Km" AuthorizedBy="TAXIVAXI" xmlns:air="http://www.travelport.com/schema/air_v52_0" xmlns:com="http://www.travelport.com/schema/common_v52_0">
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
                                    <com:Provider Code="${providercode}"/>
                                </air:PreferredProviders>
                                <air:PermittedCabins>
                                    <com:CabinClass Type="${cabinType}"/>
                                </air:PermittedCabins>
                                <air:FlightType MaxStops="${no_of_stops}"/>
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

                    console.log('soapEnvelope', soapEnvelope);
                    isPriceLoadingRef.current = true;
                    isReservationRef.current = false;
                   
                      console.log('segmentRef.current.length', segmentRef.current.length); 
                    if(segmentRef.current.length === 0){

                      const response = await axios.post(
                          `${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, 
                          soapEnvelope, { headers: { 'Content-Type': 'text/xml'  }}
                      );
                      console.log('call 1');
                      const eResponse = response.data;
                      console.log('eResponse',eResponse);
                      
                      parseString(eResponse, { explicitArray: false }, (err, result) => {
                          if (err) {
                              console.error("XML Parsing Error:", err);
                              return;
                          }
                          
                          const Segmentlist = result?.["SOAP:Envelope"]?.["SOAP:Body"]?.["air:LowFareSearchRsp"]?.["air:AirSegmentList"]?.["air:AirSegment"];
                          console.log('seg',Segmentlist);
                          if(carrier.includes("6E")){
                            const hosttokenlist = result['SOAP:Envelope']['SOAP:Body']['air:LowFareSearchRsp']['air:HostTokenList']['common_v52_0:HostToken'];
                            const hostdata = Array.isArray(hosttokenlist) ? hosttokenlist : [hosttokenlist];
                            hostRef.current = hostdata;
                            setHostlist(hostdata);
                          }
                          // console.log('outside1');
                          const fareinfolist = result['SOAP:Envelope']['SOAP:Body']['air:LowFareSearchRsp']['air:FareInfoList']['air:FareInfo'];
                          const pricepointlist = result['SOAP:Envelope']['SOAP:Body']['air:LowFareSearchRsp']['air:AirPricePointList']['air:AirPricePoint'];
                          const flightdetailist = result['SOAP:Envelope']['SOAP:Body']['air:LowFareSearchRsp']['air:FlightDetailsList']['air:FlightDetails'];
                          const pricepointlistArray = Array.isArray(pricepointlist) ? pricepointlist : [pricepointlist];
                          const extractedBookingInfo = [];
                          // console.log('outside2');
                          pricepointlistArray.forEach((airPricePoint) => {
                            // console.log('inside1');
                              const airPricingInfo = airPricePoint['air:AirPricingInfo'];
                              if (!airPricingInfo) return; // Skip if no AirPricingInfo is found

                              const flightOptionsList = airPricingInfo['air:FlightOptionsList'];
                              if (!flightOptionsList) return; // Skip if no FlightOptionsList is found

                              const flightOptions = flightOptionsList['air:FlightOption'];
                              const flightOptionArray = Array.isArray(flightOptions) ? flightOptions : [flightOptions]; // Normalize to array

                              // Iterate through each air:FlightOption
                              flightOptionArray.forEach((flightOption) => {
                              const options = flightOption['air:Option'];
                              const optionsArray = Array.isArray(options) ? options : [options]; // Normalize to array

                              flightOptionArray.forEach((flightOption) => {
                                  const options = flightOption['air:Option'];
                                  const optionsArray = Array.isArray(options) ? options : [options]; // Normalize to array
                                  optionsArray.forEach((airOption) => {
                                    const bookingInfo = airOption['air:BookingInfo'];
                                    const bookingInfoArray = Array.isArray(bookingInfo) ? bookingInfo : [bookingInfo]; // Normalize to array
                                    bookingInfoArray.forEach((info) => {
                                      if (info && info["$"]) {
                                        extractedBookingInfo.push(info["$"]); // Push the extracted info into the result array
                                      }
                                    });
                                    
                                  });
                                });
                              
                              });
                          });
                          
                          const flightairoptiondata = Array.isArray(extractedBookingInfo) ? extractedBookingInfo : [extractedBookingInfo];
                          flightairoptionRef.current = flightairoptiondata;
                          setFlightAirOptions(flightairoptiondata);
                          const segmentData = Array.isArray(Segmentlist) ? Segmentlist : [Segmentlist];
                          // console.log('segmentData', segmentData);
                          segmentRef.current = segmentData; // Store immediately    flightdetailRef
                          setSegment(segmentData);
                          const faredata = Array.isArray(fareinfolist) ? fareinfolist : [fareinfolist];
                          // console.log('faredata',faredata);
                          fareRef.current = faredata;
                          setFarelist(faredata);
                          const flightdetaildata = Array.isArray(flightdetailist) ? flightdetailist : [flightdetailist];
                          flightdetailRef.current = flightdetaildata;
                      });
                    }
                    // console.log('helkasdjfi');
                    const generateRandomKey = () => {
                      const randomBytes = CryptoJS.lib.WordArray.random(16);
                      const base64Key = CryptoJS.enc.Base64.stringify(randomBytes);
                      return base64Key;
                    };
                    const generatePassengerKeys = (adultCount) => {
                        const keys = [];
              
                        for (let i = 0; i < adultCount; i++) {
                          keys.push({
                            Key: generateRandomKey(),
                            Code: 'ADT'
                          });
                        }
                        return keys;
                      };
                      const passengerKeys = generatePassengerKeys(PassengerCodeADT);
                      const passengerKeysXml = passengerKeys.map(passenger => ({
                        '$': {
                          'Key': passenger.Key,
                          'Code': passenger.Code,
                          'Age': passenger.Age
                        }
                      }));

                    if (carrier.includes("AI")) {
                      
                      isPriceLoadingRef.current = false;
                      isReservationRef.current = true;
                      if (!segmentRef.current) {
                        console.error("Missing required flight data.");
                        return;
                      }
                
                    console.log("Matched 1G");
                    // console.log(SegmentList:", segmentRef.current);
                  //   const matchedSegment = segmentRef.current.find(segment => {
                  //     const segmentData = segment['$'];
                  //     return segmentData.FlightNumber === flightNumber &&
                  //            segmentData.DepartureTime === departureDateTime;
                  // }) || null;
                  // console.log('flightNumber', flightNumber);
                  if(flightNumber.length === 1){
                    console.log('in AI direct');
                    const matchedSegment = flightNumber
                      .flatMap(flight =>
                        (segmentRef.current || [])
                          .filter(segment =>
                            String(segment['$'].FlightNumber).trim() === String(flight).trim()
                          )
                      )[0] || null;
                    
                  // console.log('matched',matchedSegment);
                  if (matchedSegment) {
                      delete matchedSegment["air:FlightDetailsRef"];
                      matchedSegment["$"].ProviderCode = "1G";
                  }
                      // console.log('matched',matchedSegment);

                      const builder = require('xml2js').Builder;
                      var pricepointXMLpc = new builder().buildObject({
                        'soap:Envelope': {
                          '$': {
                            'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                          },
                          'soap:Body': {
                            'air:AirPriceReq': {
                              '$': {
                                'AuthorizedBy': 'TAXIVAXI',
                                'TargetBranch': Targetbranch,
                                'FareRuleType': 'short',
                                'TraceId': 'TVSBP001',
                                'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                'xmlns:com': 'http://www.travelport.com/schema/common_v52_0'
                              },
                              'BillingPointOfSaleInfo': {
                                '$': {
                                  'OriginApplication': 'UAPI',
                                  'xmlns': 'http://www.travelport.com/schema/common_v52_0'
                                },
                              },
                              'air:AirItinerary': {
                                'air:AirSegment': matchedSegment
                              },
                              'air:AirPricingModifiers': {
                                '$': {
                                  'InventoryRequestType': 'DirectAccess',
                                  'ETicketability': 'Yes',
                                  'FaresIndicator': "AllFares"
                                },
                                'air:PermittedCabins': {
                                  'com:CabinClass': {
                                    '$': {
                                      'Type': dynamicCabinType,
                                    },
                                  },
                                },
                                'air:BrandModifiers': {
                                  'air:FareFamilyDisplay': {
                                    '$': {
                                      'ModifierType': 'FareFamily',
                                    },
                                  },
                                },
                              },
                              'com:SearchPassenger': passengerKeysXml,
                              'air:AirPricingCommand': ''
                            }
                          }
                        }
                      });
                    }
                    else if (flightNumber.length !== 1){
                      console.log('in AI connecting');
                    //   const matchedSegment = flightNumber.flatMap(flight => 
                    //     segmentRef.current
                    //         .filter(segment => segment['$'].FlightNumber === flight)
                    //         .map(segment => segment['$'].Key)
                    // );
                      
                      const matchedSegment = (segmentRef.current || []).filter(segment =>
                        flightNumber.includes(String(segment['$'].FlightNumber).trim())
                      );
                    
                  // console.log('matched',matchedSegment);
                  if (matchedSegment) {
                    // console.log('hi')
                    matchedSegment.forEach(segment => {
                      delete segment["air:FlightDetailsRef"];
                      segment["$"].ProviderCode = "1G";
                    });
                  }
                      // console.log('matched2',matchedSegment);

                      const builder = require('xml2js').Builder;
                      var pricepointXMLpc = new builder().buildObject({
                        'soap:Envelope': {
                          '$': {
                            'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                          },
                          'soap:Body': {
                            'air:AirPriceReq': {
                              '$': {
                                'AuthorizedBy': 'TAXIVAXI',
                                'TargetBranch': Targetbranch,
                                'FareRuleType': 'short',
                                'TraceId': 'TVSBP001',
                                'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                'xmlns:com': 'http://www.travelport.com/schema/common_v52_0'
                              },
                              'BillingPointOfSaleInfo': {
                                '$': {
                                  'OriginApplication': 'UAPI',
                                  'xmlns': 'http://www.travelport.com/schema/common_v52_0'
                                },
                              },
                              'air:AirItinerary': {
                                'air:AirSegment': matchedSegment
                              },
                              'air:AirPricingModifiers': {
                                '$': {
                                  'InventoryRequestType': 'DirectAccess',
                                  'ETicketability': 'Yes',
                                  'FaresIndicator': "AllFares"
                                },
                                'air:PermittedCabins': {
                                  'com:CabinClass': {
                                    '$': {
                                      'Type': dynamicCabinType,
                                    },
                                  },
                                },
                                'air:BrandModifiers': {
                                  'air:FareFamilyDisplay': {
                                    '$': {
                                      'ModifierType': 'FareFamily',
                                    },
                                  },
                                },
                              },
                              'com:SearchPassenger': passengerKeysXml,
                              'air:AirPricingCommand': ''
                            }
                          }
                        }
                      });
                    }
                    console.log('pricepointXMLpc', pricepointXMLpc);
                     
                      console.log('priceparseRef.current.length', priceparseRef.current.length);
                      if (priceparseRef.current.length === 0){
                        var pricepointXML = pricepointXMLpc;
                        console.log('pricepointXML', pricepointXML);

                        const response = await axios.post(
                          `${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`,
                          pricepointXML,
                          { headers: { 'Content-Type': 'text/xml' } }
                        );
                        console.log('call 2');
                
                        const priceResponse = response.data;
                        console.log('priceResponse', priceResponse);
                
                        parseString(priceResponse, { explicitArray: false }, (err, priceresult) => {
                            if (err) {
                                console.error('Error parsing XML:', err);
                                return;
                            }
                
                            const AirPriceRsp = priceresult?.['SOAP:Envelope']?.['SOAP:Body']?.['air:AirPriceRsp'];
                            if (!AirPriceRsp) {
                                Swal.fire({
                                    title: 'Something Went Wrong!',
                                    text: 'Please try again later',
                                    confirmButtonText: 'OK'
                                });
                                return;
                            }
                            
                            const priceData = AirPriceRsp?.['air:AirPriceResult']?.['air:AirPricingSolution'];
                            const segmentData = AirPriceRsp?.['air:AirItinerary']?.['air:AirSegment'];
                
                            const priceparsedata = Array.isArray(priceData) ? priceData : [priceData];
                            console.log('priceparsedata', priceparsedata);
                            priceparseRef.current = priceparsedata;
                            setpriceparse(priceparsedata);
                            const segmentpricedata = Array.isArray(segmentData) ? segmentData : [segmentData];
                            segmentpriceparseRef.current = segmentpricedata;
                            setsegmentpriceparse(segmentpricedata);
                        });
                    }
              
                    const selectedPrice = priceparseRef.current.find(price => {
                      console.log('price', price);
                      let name = null;

                      const fareInfo = price?.["air:AirPricingInfo"]?.["air:FareInfo"];

                      if (fareInfo) {
                        const fareArray = Array.isArray(fareInfo) ? fareInfo : [fareInfo];

                        // You can pick the first brand name or do something custom here
                        name = fareArray[0]?.["air:Brand"]?.["$"]?.["Name"] || null;
                      }
                      console.log("Found Name:", name);
                  
                      const targetFareType = Array.isArray(fare_type) ? fare_type[0] : fare_type; // Handle array case
                      return name === targetFareType;
                  });
                  
                  console.log('selectedPrice:', selectedPrice);
                  
                  const fareInfoRefKey = selectedPrice['air:AirPricingInfo']['air:FareInfo']['air:FareRuleKey']
                  sessionStorage.setItem('packageselectedPrice', selectedPrice['$']['TotalPrice']);
                  const airPricingInfo = selectedPrice['air:AirPricingInfo'];
                  const combinedArray = [];
                  if (Array.isArray(airPricingInfo)) {
                    if (Array.isArray(airPricingInfo[0]['air:BookingInfo'])) {
                      airPricingInfo[0]['air:BookingInfo'].forEach(bookinginfo => {
                        combinedArray.push({
                          segmentRef: bookinginfo['$']['SegmentRef'],
                          hostTokenRef: bookinginfo['$']['HostTokenRef']
                        });
                      });
                    } else {
                      combinedArray.push({
                        segmentRef: airPricingInfo[0]['air:BookingInfo']['$']['SegmentRef'],
                        hostTokenRef: airPricingInfo[0]['air:BookingInfo']['$']['HostTokenRef']
                      });
                    }
                  } else {
                    if (Array.isArray(airPricingInfo['air:BookingInfo'])) {
                      airPricingInfo['air:BookingInfo'].forEach(bookinginfo => {
                        combinedArray.push({
                          segmentRef: bookinginfo['$']['SegmentRef'],
                          hostTokenRef: bookinginfo['$']['HostTokenRef']
                        });
                      });
                    } else {
                      combinedArray.push({
                        segmentRef: airPricingInfo['air:BookingInfo']['$']['SegmentRef'],
                        hostTokenRef: airPricingInfo['air:BookingInfo']['$']['HostTokenRef']
                      });
                    }
                  }
                  const HostToken = selectedPrice['common_v52_0:HostToken'];

                  const SegmentParse = segmentpriceparseRef.current;
                  let finaldeparturedate = '';
                  let finalreturndate = '';
                  let finalarrivaldate = '';

                  if (bookingtype === "Return") {
                    SegmentParse.map((segmentInfo, segmentindex) => {

                      if (segmentindex === 0) {
                        finaldeparturedate = segmentInfo['$']['DepartureTime'];
                      }
                      if (segmentInfo['$']['Group'] === '1') {
                        finalreturndate = segmentInfo['$']['DepartureTime'];
                        return true;
                      }
                      return false;
                    });
                  } else {
                    SegmentParse.map((segmentInfo, segmentindex) => {

                      if (segmentindex === 0) {
                        finaldeparturedate = segmentInfo['$']['DepartureTime'];
                        finalarrivaldate = segmentInfo['$']['ArrivalTime'];
                      }

                    });
                  }
                  for (let i = 0; i < SegmentParse.length; i++) {
                    let currentSegment = SegmentParse[i];
                    for (let j = i + 1; j < SegmentParse.length; j++) {
                      const nextSegment = SegmentParse[j];
                      if (currentSegment.$.Group === nextSegment.$.Group) {
                        currentSegment['air:Connection'] = "";
                        currentSegment = SegmentParse[j];
                        break;
                      }
                    }
                  }
                  SegmentParse.forEach(segment => {
                    const segmentKey = segment['$'].Key;
                    const matchedEntry = combinedArray.find(entry => entry.segmentRef === segmentKey);
                    if (matchedEntry) {
                      segment['$'].HostTokenRef = matchedEntry.hostTokenRef;
                    }
                  });
                  const builder = require('xml2js').Builder;
                  var servicerequestXML = new builder().buildObject({
                    'soap:Envelope': {
                      '$': {
                        'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                      },
                      'soap:Header': {

                      },
                      'soap:Body': {
                        '$': {
                          'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                          'xmlns:com': 'http://www.travelport.com/schema/common_v52_0',
                        },
                        'air:AirMerchandisingOfferAvailabilityReq': {
                          '$': {
                            'TargetBranch': Targetbranch,
                            'TraceId': 'ac191f0b9c0546659065f29389eae552'
                          },
                          'com:BillingPointOfSaleInfo': {
                            '$': {
                              'OriginApplication': 'UAPI'
                            },
                          },
                          'air:AirSolution': {
                            'air:AirSegment': SegmentParse,
                            'com:HostToken': HostToken
                          },

                        }
                      }
                    }
                  });

                  const serviceresponse = axios.post(
                    `${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, servicerequestXML);
      
                  const serviceData = {
                    apiairportsdata: apiairportData,
                    servicedata: serviceresponse.data,
                    SegmentPricelist: SegmentParse,
                    packageselected: selectedPrice,
                    hostToken: HostToken,
                    classtype: dynamicCabinType,
                    Passengerarray: passengerKeys,
                    searchdeparture: finaldeparturedate,
                    searchreturn: finalreturndate,
                    searcharrivaldate: finalarrivaldate,
                    finalorigin: searchfrom,
                    finaldestination: searchto,
                    Airports: Airports,
                    Airlines: Airlines,
                    formtaxivaxi: formtaxivaxiData,
                    booking_id: booking_id,
                    client_id: client_id,
                    is_gst_benefit: is_gst_benefit,
                    accesstoken: access_token,
                    markup_price: markup_price,
                    segmentArray: SegmentParse,
                    flightDetails: flightdetailRef.current,
      
                  };
                  console.log('servicedata1', serviceData);
                  navigate('/bookingProcess', { state: { serviceData }});
                 

                        
                    }
                    else if (carrier.includes("6E")) {
                      isPriceLoadingRef.current = false;
                      isReservationRef.current = true;
                      console.log('in 6E')
                        // Iterate over the segment list and check for the match
                        if(flightNumber.length === 1){
                        const matchedSegment = flightNumber
                          .flatMap(flight => 
                              segmentRef.current
                                  .filter(segment => segment['$'].FlightNumber === flight && segment['$'].DepartureTime === departureDateTime)
                                  .map(segment => segment['$'].Key)
                          )[0] || null;
                      
                      console.log('matchedSegments', matchedSegment);
                      
                        
                        const matchingBookingInfo = flightairoptionRef.current.filter(entry => entry.SegmentRef === matchedSegment);
                        console.log('matchingBookingInfo',matchingBookingInfo);
                        
                        const { fareKey, fareBasisCode } = matchingBookingInfo.map(booking => {
                            const fareEntry = fareRef.current.find(fare => fare['$'].Key === booking.FareInfoRef);
                            const fareFamily = fareEntry?.['$']?.FareFamily; 
                            if (fareEntry && fare_type.includes(fareFamily)) {
                                const fareKey = fareEntry['$'].Key || null;
                                const fareBasisCode = fareEntry['$'].FareBasis || null;
                                return { fareKey, fareBasisCode };
                            }
                        
                            return null; 
                        }).filter(Boolean)[0] || { fareKey: null, fareBasisCode: null };
                        console.log('fareKey, fareBasisCode', fareKey, fareBasisCode);
                        
                            const airPricingCommand = {
                              'air:AirSegmentPricingModifiers': {
                                $: {
                                  AirSegmentRef: matchedSegment,  
                                  FareBasisCode: fareBasisCode,  
                                }
                              }
                            };

                            const hostTokenRef = matchingBookingInfo
                            .find(entry => entry.SegmentRef === matchedSegment && entry.FareInfoRef === fareKey)?.HostTokenRef || null;  // Match both SegmentRef and FareInfoRef, return HostTokenRef

                            const BookingCode = matchingBookingInfo
                            .find(entry => entry.SegmentRef === matchedSegment && entry.FareInfoRef === fareKey)?.BookingCode || null;
                            console.log('airPricingCommand',airPricingCommand);

                            const comHostTokens = hostRef.current
                            .filter(hostToken => hostToken['$'] && hostToken['$']['Key'] === hostTokenRef) // Match the hostkey
                            .map(hostToken => ({
                              $: { Key: hostToken['$'].Key }, // Use the Key
                              _: hostToken._ // Add the token value
                            })); 
                            console.log('comHostTokens', comHostTokens);
                            const segmentArray = 
                                segmentRef.current
                                    ?.filter((segment) => segment?.['$']?.['Key'] === matchedSegment) // Ensure segment exists
                                    .map((segment) => {
                                    if (!segment || !segment.$) return null; // Skip undefined segments
                            
                                    // Clone the segment to avoid modifying the original object
                                    let updatedSegment = { ...segment, $: { ...segment.$ } };
                            
                                    // Update ProviderCode if available
                                    if (segment['air:AirAvailInfo']?.$?.ProviderCode) {
                                        updatedSegment.$.ProviderCode = segment['air:AirAvailInfo'].$.ProviderCode;
                                    }
                            
                                    // Add additional properties
                                    updatedSegment.$.HostTokenRef = hostTokenRef;
                                    updatedSegment.$.ClassOfService = BookingCode;
                            
                                    // Remove unnecessary properties
                                    delete updatedSegment['air:FlightDetailsRef'];
                            
                                return updatedSegment;
                                });
                                
                          
                                  
                                    // console.log('passengerKeys', passengerKeys)
                                const builder = require('xml2js').Builder;
                                var pricepointXMLpc = new builder().buildObject({
                                'soap:Envelope': {
                                    '$': {
                                    'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                                    },
                                    'soap:Body': {
                                    'air:AirPriceReq': {
                                        '$': {
                                        'AuthorizedBy': 'TAXIVAXI',
                                        'TargetBranch': Targetbranch,
                                        'FareRuleType': 'short',
                                        'TraceId': 'TVSBP001',
                                        'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                        'xmlns:com': 'http://www.travelport.com/schema/common_v52_0'
                                        },
                                        'BillingPointOfSaleInfo': {
                                        '$': {
                                            'OriginApplication': 'UAPI',
                                            'xmlns': 'http://www.travelport.com/schema/common_v52_0'
                                        },
                                        },
                                        'air:AirItinerary': {
                                        'air:AirSegment': segmentArray,
                                        'com:HostToken': comHostTokens,
                                        },
                                        'air:AirPricingModifiers': {
                                        '$': {
                                            'InventoryRequestType': 'DirectAccess',
                                            'ETicketability': 'Yes',
                                            'FaresIndicator': "AllFares"
                                        },
                                        'air:PermittedCabins': {
                                            'com:CabinClass': {
                                            '$': {
                                                'Type': dynamicCabinType,
                                            },
                                            },
                                        },
                                        'air:BrandModifiers': {
                                            'air:FareFamilyDisplay': {
                                            '$': {
                                                'ModifierType': 'FareFamily',
                                            },
                                            },
                                        },
                                        },
                                        'com:SearchPassenger': passengerKeysXml,
                                        'air:AirPricingCommand': airPricingCommand
                                    }
                                    }
                                }
                                });
                              }
                        else if (flightNumber.length !== 1){
                          const matchedSegment = flightNumber.flatMap(flight => 
                            segmentRef.current
                                .filter(segment => segment['$'].FlightNumber === flight)
                                .map(segment => segment['$'].Key)
                        );
                        
                        console.log('matchedSegments', matchedSegment);
                        
                        const matchingBookingInfo = flightairoptionRef.current.filter(entry => 
                            matchedSegment.includes(entry.SegmentRef) // Check if SegmentRef exists in matchedSegment array
                        );
                        
                        console.log('matchingBookingInfo', matchingBookingInfo);
                        
                        const { fareKey, fareBasisCode } = matchingBookingInfo.map(booking => {
                            const fareEntry = fareRef.current.find(fare => fare['$'].Key === booking.FareInfoRef);
                            const fareFamily = fareEntry?.['$']?.FareFamily; 
                            if (fareEntry && fare_type.includes(fareFamily)) {
                                const fareKey = fareEntry['$'].Key || null;
                                const fareBasisCode = fareEntry['$'].FareBasis || null;
                                return { fareKey, fareBasisCode };
                            }
                        
                            return null; 
                        }).filter(Boolean)[0] || { fareKey: null, fareBasisCode: null };
                        
                        const matchedbookinfo = matchingBookingInfo.filter(booking => {
                          // Find the BookingCode of the entry where FareInfoRef matches fareKey
                          const matchedBooking = matchingBookingInfo.find(entry => entry.FareInfoRef === fareKey);
                          
                          // If a matching entry is found, return all entries with the same BookingCode
                          return matchedBooking && booking.BookingCode === matchedBooking.BookingCode;
                      });
                      
                      console.log('matchedbookinfo', matchedbookinfo);
                      const segmentArray = matchedbookinfo
                          .flatMap((fareInfo) => {
                            const segmentkey = fareInfo['SegmentRef'];
                            const hostkey = fareInfo['HostTokenRef'];

                            return segmentRef.current
                              ?.filter((segment) => segment?.['$']?.['Key'] === segmentkey) // Ensure segment exists
                              .map((segment) => {
                                if (!segment || !segment.$) return null; // Skip undefined segments

                                // Clone the segment to avoid modifying the original object
                                let updatedSegment = { ...segment, $: { ...segment.$ } };

                                // Update ProviderCode if available
                                if (segment['air:AirAvailInfo']?.$?.ProviderCode) {
                                  updatedSegment.$.ProviderCode = segment['air:AirAvailInfo'].$.ProviderCode;
                                }

                                // Add additional properties
                                updatedSegment.$.HostTokenRef = hostkey;
                                updatedSegment.$.ClassOfService = fareInfo['BookingCode'];

                                // Remove unnecessary properties
                                delete updatedSegment['air:FlightDetailsRef'];

                                return updatedSegment;
                              });
                          })
                          .filter(Boolean) // Remove null values
                          .reduce((uniqueSegments, segment) => {
                            // Check if segment with the same Key already exists in the unique list
                            if (!uniqueSegments.some((item) => item.$.Key === segment.$.Key)) {
                              uniqueSegments.push(segment);
                            }
                            return uniqueSegments;
                          }, []);
                          console.log('segmentArray', segmentArray);
                          const comHostTokens = matchedbookinfo.map((fareInfo) => {
                            const hostkey = fareInfo['HostTokenRef'];
                      
                            return hostRef.current
                              .filter(hostToken => hostToken['$'] && hostToken['$']['Key'] === hostkey) // Match the hostkey
                              .map(hostToken => ({
                                $: { Key: hostToken['$'].Key }, // Use the Key
                                _: hostToken._ // Add the token value
                              }));
                          }).flat();
                          console.log('comHostTokens', comHostTokens);
                          const airPricingCommand = matchedbookinfo.map((fareInfo) => {
                            const farekey = fareInfo['FareInfoRef'];
                            const segmentkey = fareInfo['SegmentRef'];
                      
                            return fareRef.current
                              .filter(fareInfo => fareInfo['$'] && fareInfo['$']['Key'] === farekey) // Match the farekey
                              .map(fareInfo => {
                                const fareBasisCode = fareInfo['$'].FareBasis;
                                if (fareBasisCode) {
                                  return {
                                    'air:AirSegmentPricingModifiers': {
                                      $: {
                                        AirSegmentRef: segmentkey, // Use the already available segmentkey
                                        FareBasisCode: fareBasisCode,
                                      }
                                    }
                                  };
                                }
                      
                                return null; // Skip entries where FareBasisCode is missing
                              })
                              .filter(Boolean); // Remove nulls
                          }).flat();
                      
                          console.log("Processed airPricingCommand:", airPricingCommand);
                           
                                const builder = require('xml2js').Builder;
                                var pricepointXMLpc = new builder().buildObject({
                                'soap:Envelope': {
                                    '$': {
                                    'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                                    },
                                    'soap:Body': {
                                    'air:AirPriceReq': {
                                        '$': {
                                        'AuthorizedBy': 'TAXIVAXI',
                                        'TargetBranch': Targetbranch,
                                        'FareRuleType': 'short',
                                        'TraceId': 'TVSBP001',
                                        'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                        'xmlns:com': 'http://www.travelport.com/schema/common_v52_0'
                                        },
                                        'BillingPointOfSaleInfo': {
                                        '$': {
                                            'OriginApplication': 'UAPI',
                                            'xmlns': 'http://www.travelport.com/schema/common_v52_0'
                                        },
                                        },
                                        'air:AirItinerary': {
                                        'air:AirSegment': segmentArray,
                                        'com:HostToken': comHostTokens,
                                        },
                                        'air:AirPricingModifiers': {
                                        '$': {
                                            'InventoryRequestType': 'DirectAccess',
                                            'ETicketability': 'Yes',
                                            'FaresIndicator': "AllFares"
                                        },
                                        'air:PermittedCabins': {
                                            'com:CabinClass': {
                                            '$': {
                                                'Type': dynamicCabinType,
                                            },
                                            },
                                        },
                                        'air:BrandModifiers': {
                                            'air:FareFamilyDisplay': {
                                            '$': {
                                                'ModifierType': 'FareFamily',
                                            },
                                            },
                                        },
                                        },
                                        'com:SearchPassenger': passengerKeysXml,
                                        'air:AirPricingCommand': airPricingCommand
                                    }
                                    }
                                }
                                });
                        }
                                console.log('pricepointXMLpc', pricepointXMLpc);
                                const makeSoapRequest = async () => {
                                    var pricepointXML = pricepointXMLpc;
                                    // console.log('main_prc', pricepointXML); 
                                    console.log("in api1")
                                    
                                      const priceresponse = await axios.post(
                                        `${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`,
                                        pricepointXML);
                                      
                                      const priceResponse = priceresponse.data;
                                    //   console.log('priceResponse', priceResponse);
                                      parseString(priceResponse, { explicitArray: false }, (err, priceresult) => {
                                        if (err) {
                                          console.error('Error parsing XML:', err);
                                          return;
                                        }
                                        const AirPriceRsp = priceresult['SOAP:Envelope']['SOAP:Body']['air:AirPriceRsp'];
                              
                                        if (AirPriceRsp !== null && AirPriceRsp !== undefined) {
                                          const pricereponse = priceresult['SOAP:Envelope']['SOAP:Body']['air:AirPriceRsp']['air:AirPriceResult']['air:AirPricingSolution'];
                                          const segmentpricereponse = priceresult['SOAP:Envelope']['SOAP:Body']['air:AirPriceRsp']['air:AirItinerary']['air:AirSegment'];
                                          const Priceinginfoselected = pricereponse;
                                          const airPricingInfo = pricereponse['air:AirPricingInfo'];
                                          const combinedArray = [];
                                          if (Array.isArray(airPricingInfo)) {
                                            if (Array.isArray(airPricingInfo[0]['air:BookingInfo'])) {
                                              airPricingInfo[0]['air:BookingInfo'].forEach(bookinginfo => {
                                                combinedArray.push({
                                                  segmentRef: bookinginfo['$']['SegmentRef'],
                                                  hostTokenRef: bookinginfo['$']['HostTokenRef']
                                                });
                                              });
                                            } else {
                                              combinedArray.push({
                                                segmentRef: airPricingInfo[0]['air:BookingInfo']['$']['SegmentRef'],
                                                hostTokenRef: airPricingInfo[0]['air:BookingInfo']['$']['HostTokenRef']
                                              });
                                            }
                                          } else {
                                            if (Array.isArray(airPricingInfo['air:BookingInfo'])) {
                                              airPricingInfo['air:BookingInfo'].forEach(bookinginfo => {
                                                combinedArray.push({
                                                  segmentRef: bookinginfo['$']['SegmentRef'],
                                                  hostTokenRef: bookinginfo['$']['HostTokenRef']
                                                });
                                              });
                                            } else {
                                              combinedArray.push({
                                                segmentRef: airPricingInfo['air:BookingInfo']['$']['SegmentRef'],
                                                hostTokenRef: airPricingInfo['air:BookingInfo']['$']['HostTokenRef']
                                              });
                                            }
                                          }
                              
                                          const HostToken = pricereponse['common_v52_0:HostToken'];
                                          const SegmentParse = segmentpricereponse;
                              
                                          // Convert SegmentParse to an array if it's a single object
                                          const segmentArray = Array.isArray(SegmentParse) ? SegmentParse : [SegmentParse];
                              
                                          let finaldeparturedate = '';
                                          let finalreturndate = '';
                                          let finalarrivaldate = '';
                              
                                          if (bookingtype === "Return") {
                                            segmentArray.forEach((segmentInfo, segmentindex) => {
                                              if (segmentindex === 0) {
                                                finaldeparturedate = segmentInfo['$']['DepartureTime'];
                                              }
                                              if (segmentInfo['$']['Group'] === '1') {
                                                finalreturndate = segmentInfo['$']['DepartureTime'];
                                              }
                                            });
                                          } else {
                                            // Handle cases where the index is not 0
                                            segmentArray.forEach((segmentInfo, segmentindex) => {
                                              if (segmentindex === 0) {
                                                finaldeparturedate = segmentInfo['$']['DepartureTime'];
                                                finalarrivaldate = segmentInfo['$']['ArrivalTime'];
                                              } else {
                                                // Handle subsequent segments (not index 0)
                                                finaldeparturedate = segmentInfo['$']['DepartureTime'];
                                                finalarrivaldate = segmentInfo['$']['ArrivalTime'];
                                              }
                                            });
                              
                                            // If it's a single segment, ensure the dates are still assigned
                                            if (segmentArray.length === 1 && segmentArray[0]['$']) {
                                              finaldeparturedate = segmentArray[0]['$']['DepartureTime'];
                                              finalarrivaldate = segmentArray[0]['$']['ArrivalTime'];
                                            }
                                          }
                                          // Handle 'air:Connection' assignment for segments within the same group
                                          for (let i = 0; i < segmentArray.length; i++) {
                                            let currentSegment = segmentArray[i];
                              
                                            for (let j = i + 1; j < segmentArray.length; j++) {
                                              const nextSegment = segmentArray[j];
                                              if (currentSegment.$.Group === nextSegment.$.Group) {
                                                currentSegment['air:Connection'] = "";
                                                break;
                                              }
                                            }
                                          }
                              
                                          // Assign 'HostTokenRef' based on segmentRef
                                          segmentArray.forEach(segment => {
                                            const segmentKey = segment['$'].Key;
                                            const matchedEntry = combinedArray.find(entry => entry.segmentRef === segmentKey);
                                            if (matchedEntry) {
                                              segment['$'].HostTokenRef = matchedEntry.hostTokenRef;
                                            }
                                          });
                              
                                          const builder = require('xml2js').Builder;
                                          var servicerequestXML = new builder().buildObject({
                                            'soap:Envelope': {
                                              '$': {
                                                'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                                              },
                                              'soap:Header': {
                              
                                              },
                                              'soap:Body': {
                                                '$': {
                                                  'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                                  'xmlns:com': 'http://www.travelport.com/schema/common_v52_0',
                                                },
                                                'air:AirMerchandisingOfferAvailabilityReq': {
                                                  '$': {
                                                    'TargetBranch': Targetbranch,
                                                    'TraceId': 'ac191f0b9c0546659065f29389eae552'
                                                  },
                                                  'com:BillingPointOfSaleInfo': {
                                                    '$': {
                                                      'OriginApplication': 'UAPI'
                                                    },
                                                  },
                                                  'air:AirSolution': {
                                                    'air:AirSegment': SegmentParse,
                                                    'com:HostToken': HostToken
                                                  },
                              
                                                }
                                              }
                                            }
                                          });
                                          // console.log('servicerequestXML', servicerequestXML);
                                          const serviceresponse = axios.post(
                                            `${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, servicerequestXML);
                                          const serviceResponse = serviceresponse.data;
                                          // console.log('serviceResponse', serviceresponse);
                              
                                          const serviceData = {
                                            apiairportsdata: apiairportData,
                                            servicedata: serviceresponse.data,
                                            SegmentPricelist: SegmentParse,
                                            packageselected: Priceinginfoselected,
                                            hostToken: HostToken,
                                            classtype: dynamicCabinType,
                                            Passengerarray: passengerKeys,
                                            searchdeparture: finaldeparturedate,
                                            searchreturn: finalreturndate,
                                            searcharrivaldate: finalarrivaldate,
                                            finalorigin: searchfrom,
                                            finaldestination: searchto,
                                            Airports: Airports,
                                            Airlines: Airlines,
                                            formtaxivaxi: formtaxivaxiData,
                                            booking_id: booking_id,
                                            client_id: client_id,
                                            is_gst_benefit: is_gst_benefit,
                                            accesstoken: access_token,
                                            segmentArray: segmentArray,
                                            flightDetails: flightdetailRef.current,
                                            markup_price: markup_price,
                              
                                          };
                                          console.log('servicedata1', serviceData);
                                          navigate('/bookingProcess', { state: { serviceData } });
                              
                                        } else {
                                          const error = priceresult['SOAP:Envelope']['SOAP:Body']['SOAP:Fault']['faultstring'];
                                          // ErrorLogger.logError('price_api',pricepointXML,error);
                                          // Swal.fire({
                                          //   title: 'Something Went Wrong !',
                                          //   text: 'Please try again later',
                                          //   confirmButtonText: 'OK'
                                          // });
                                        }
                              
                              
                                      });
                                    
                                  };
                              
                                  makeSoapRequest();

                    }
                    
                    // navigate('/SearchFlight', { state: { responseData } });
                    // await new Promise(resolve => setTimeout(resolve, 1000));
                
                } catch (error) {
                    // navigate('/tryagainlater');
                }
                finally{
                    // setLoading(false);
                }
                
        };

        const executeRequestsSequentially = async () => {
            try {
                setLoading(true); 
                if (!airlineResponseData) {
                  await makeAirlineRequest();
              }
          
              if (!airportResponseData) {
                  await makeAirportRequest();
              }
          
              if (!apiairportData) {
                  await apiairportss();
              }
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
                    
                });
            }
    },[[navigate, taxivaxidata]]);



  return (
    <div className="yield-content">
        {loading && (
            <div className="page-center-loader flex items-center justify-center">
                <div className="big-loader flex items-center justify-center">
                    {/* <IconLoader className="big-icon animate-[spin_2s_linear_infinite]" /> */}
                    <img className="loader-gif" src="/img/cotravloader.gif" alt="Loader" />
                    {/* Conditional loading text */}
                    {isPriceLoadingRef.current ? (
                        <p className="text-center ml-4 text-gray-600 text-lg">
                            Fetching price....
                        </p>
                    ) : isReservationRef.current ? (
                        <p className="text-center ml-4 text-gray-600">
                            Processing your reservation. Please wait...
                        </p>
                    ) : (
                        <p className="text-center ml-4 text-gray-600 text-lg">
                            Retrieving flight details. Please wait a moment.
                        </p>
                    )}
                </div>
            </div>
        )}
    </div >
  )
}

export default BookFlow