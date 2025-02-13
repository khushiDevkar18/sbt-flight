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

const BookFlow = () => {
    // console.log('asdfasdfa');
    const [loading, setLoading] = useState(false);
    const searchParams = new URLSearchParams(window.location.search);
    const taxivaxidata = searchParams.get('taxivaxidata');
    const navigate = useNavigate();
    const [SegmentList, setSegment] = useState([]);
    // console.log('SegmentList', SegmentList);
    const [HostList, setHostlist] = useState([]);
    const [FareList, setFarelist] = useState([]);
    const [flightairoption, setFlightAirOptions] = useState([]);
    // console.log('FareList', FareList);
    
    useEffect(() => {
        // console.log('hi')
        setLoading(true);
        let airlineResponseData;
        let airportResponseData;
        let apiairportData;
        
        // console.log('airportResponseData', airportResponseData);
        // console.log('apiairportData', apiairportData);
        

        const makeAirlineRequest = async () => {
            // console.log('hi1');
        try {
            const username = 'Universal API/uAPI6514598558-21259b0c';
            const password = 'tN=54gT+%Y';
            const authHeader = `Basic ${btoa(`${username}:${password}`)}`; 
            const airlineRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:util="http://www.travelport.com/schema/util_v50_0" xmlns:com="http://www.travelport.com/schema/common_v50_0">
            <soapenv:Header/>
            <soapenv:Body>
                <util:ReferenceDataRetrieveReq AuthorizedBy="TAXIVAXI" TargetBranch="P7206253" TraceId="AR45JHJ" TypeCode="AirAndRailSupplierType">
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
            // console.log('airlineResponseData1', airlineResponseData);
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
            <util:ReferenceDataRetrieveReq AuthorizedBy="TAXIVAXI" TargetBranch="P7206253" TraceId="AV145ER" TypeCode="CityAirport">
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
            // console.log('airlineResponseData1', airlineResponseData);
  
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
                    // console.log('searchtoCode', searchtoCode);
                    // const searchdeparture = formtaxivaxiData['departure_date'];       
                    const departureDateTime = formtaxivaxiData['departure_time']; 
                    const arrivalDateTime = formtaxivaxiData['arrival_time'];
                    // console.log('departureDateTime', departureDateTime);
                    // console.log('arrivalDateTime', arrivalDateTime);
                    const dateObj = new Date(departureDateTime);
                    const departureDate = dateObj.toISOString().split('T')[0]; 
                    const departureTime = dateObj.toISOString().split('T')[1].slice(0, 5); 
                    const fare_type = formtaxivaxiData['fare_type'];
                    const spoc_email = formtaxivaxiData['email'];
                    const additional_emails = formtaxivaxiData['additional_emails'];
                    const ccmail = formtaxivaxiData['cc_email'];
                    const client_name = formtaxivaxiData['client_name'];
                    const spoc_name = formtaxivaxiData['spoc_name'];
                    const markup = formtaxivaxiData['markup_details'];
                    const booking_id = formtaxivaxiData['booking_id'];
                    const is_approved  = formtaxivaxiData['is_approved'];    
                    const no_of_seats = formtaxivaxiData['no_of_seats'];
                    const request_id = formtaxivaxiData['request_id'];
                    const request_type = formtaxivaxiData['request_type'];
                    const client_id = formtaxivaxiData['client_id'];
                    const is_gst_benefit = formtaxivaxiData['is_gst_benefit'];
                    const flight_type = formtaxivaxiData['flight_type'];
                    const access_token = formtaxivaxiData['access_token'];
                    const providercode = formtaxivaxiData['provider_code'].split(',')[0].trim();  // Get the first provider code and trim any extra spaces
                    const flightNumber = formtaxivaxiData['flight_no'].split(',')[0].replace(new RegExp(`^${providercode}`, 'i'), '').trim();  // Remove the provider code from the flight number
                    // console.log('helo', flightNumber);
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
                    const username = 'Universal API/uAPI6514598558-21259b0c';
                    const password = 'tN=54gT+%Y'; 
                    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
                    // sessionStorage.setItem('searchdata', soapEnvelope);
                    //   console.log('soapenv', soapEnvelope); 

                    const response = await axios.post(
                        'https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeFlightAirServiceRequest', 
                        soapEnvelope, { headers: { 'Content-Type': 'text/xml'  }}
                    );
                    // console.log(airlineResponseData);
                    // console.log(airportResponseData);
                    const eResponse = response.data;
                    // console.log('eResponse',eResponse);
                    parseString(eResponse, { explicitArray: false }, (err, result) => {
                        if (err) {
                            console.error("XML Parsing Error:", err);
                            return;
                        }
                        const Segmentlist = result?.["SOAP:Envelope"]?.["SOAP:Body"]?.["air:LowFareSearchRsp"]?.["air:AirSegmentList"]?.["air:AirSegment"];
                        const hosttokenlist = result['SOAP:Envelope']['SOAP:Body']['air:LowFareSearchRsp']['air:HostTokenList']['common_v52_0:HostToken'];
                        const fareinfolist = result['SOAP:Envelope']['SOAP:Body']['air:LowFareSearchRsp']['air:FareInfoList']['air:FareInfo'];
                        const pricepointlist = result['SOAP:Envelope']['SOAP:Body']['air:LowFareSearchRsp']['air:AirPricePointList']['air:AirPricePoint'];

                        const pricepointlistArray = Array.isArray(pricepointlist) ? pricepointlist : [pricepointlist];
                        const extractedBookingInfo = [];
                        // Iterate through the AirPricePoint list
                        pricepointlistArray.forEach((airPricePoint) => {
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
                  
                                // Iterate through each air:Option
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
                        setFlightAirOptions(Array.isArray(extractedBookingInfo) ? extractedBookingInfo : [extractedBookingInfo]);

                        setSegment(Array.isArray(Segmentlist) ? Segmentlist : [Segmentlist]);
                        setHostlist(Array.isArray(hosttokenlist) ? hosttokenlist : [hosttokenlist]);
                        setFarelist(Array.isArray(fareinfolist) ? fareinfolist : [fareinfolist]);

                        


                    });
                    // console.log('helkasdjfi');

                    if (providercode.includes("AI")) {
                        console.log("Matched 6E");
                    }
                    else if (providercode.includes("6E")) {
                        // Iterate over the segment list and check for the match
                        const matchedSegment = SegmentList.find(segment => {
                            const segmentData = segment['$'];
                            return segmentData.FlightNumber === flightNumber &&
                                   segmentData.DepartureTime === departureDateTime;
                        })?.['$'].Key || null;
                        
                        const matchingBookingInfo = flightairoption.filter(entry => entry.SegmentRef === matchedSegment);
                        // console.log('matchingBookingInfo',matchingBookingInfo);
                        
                        const { fareKey, fareBasisCode } = matchingBookingInfo.map(booking => {
                            const fareEntry = FareList.find(fare => fare['$'].Key === booking.FareInfoRef);
                            const fareFamily = fareEntry?.['$']?.FareFamily; 
                            if (fareEntry && fare_type.includes(fareFamily)) {
                                const fareKey = fareEntry['$'].Key || null;
                                const fareBasisCode = fareEntry['$'].FareBasis || null;
                                return { fareKey, fareBasisCode };
                            }
                        
                            return null; 
                        }).filter(Boolean)[0] || { fareKey: null, fareBasisCode: null };
                        
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
                            // console.log('BookingCode',BookingCode);

                            const comHostTokens = HostList
                            .filter(hostToken => hostToken['$'] && hostToken['$']['Key'] === hostTokenRef) // Match the hostkey
                            .map(hostToken => ({
                              $: { Key: hostToken['$'].Key }, // Use the Key
                              _: hostToken._ // Add the token value
                            })); 
                            // console.log('comHostTokens', comHostTokens);
                            const segmentArray = 
                                SegmentList
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
                                    // console.log('segmentArray', segmentArray)
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
                                        'TargetBranch': 'P7206253',
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
                                        'com:SearchPassenger': PassengerCodeADT,
                                        'air:AirPricingCommand': airPricingCommand
                                    }
                                    }
                                }
                                });
                                console.log('pricepointXMLpc', pricepointXMLpc);
    
                        
                          
                            
                          
                        

                    }
                    
                    // navigate('/SearchFlight', { state: { responseData } });
                    // await new Promise(resolve => setTimeout(resolve, 1000));
                
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
                                <img className="loader-gif" src="/img/cotravloader.gif" alt="Loader" />
                                <p className="text-center ml-4 text-gray-600 text-lg">
                                Retrieving flight details. Please wait a moment.
                                </p>
                            </div>
                        </div>
         )}
      </div >
  )
}

export default BookFlow