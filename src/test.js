<form id="submit-form" onSubmit={(e) => handleSubmit(e)} action="" method="POST" autoComplete="off">

                                                            <input type="hidden" name="_token" defaultValue="S1NzGDzenZ2TihPVjEByzt2t1VkgNBfoEIoqg8rK" /><div className="page-search-p1">
                                                                <div className="One_Way">
                                                                    <input
                                                                        type="radio"
                                                                        className="bookingtypecheck"
                                                                        name="bookingtype"
                                                                        value="oneway"
                                                                        onChange={handleRadioChange}
                                                                        checked={formData.bookingType === 'oneway'}
                                                                        id="departureRadio"
                                                                    />
                                                                    <label className="bookingtype onewaybookingtype" htmlFor="departureRadio" style={getLabelStyle('oneway')}>One-Way</label>
                                                                </div>

                                                                <div className="Return">
                                                                    <input
                                                                        type="radio"
                                                                        className="bookingtypecheck"
                                                                        name="bookingtype"
                                                                        value="Return"
                                                                        onChange={handleRadioChange}
                                                                        checked={formData.bookingType === 'Return'}
                                                                        id="returnRadio"
                                                                    />
                                                                    <label className="bookingtype returnbookingtype" htmlFor="returnRadio" style={getLabelStyle('Return')}>Return</label>
                                                                </div>
                                                                <div className="clear"></div>
                                                                
                                                            </div>

                                                            <div className="page-search-p">

                                                                <div className="search-large-i">

                                                                    <div className="srch-tab-line no-margin-bottom">
                                                                        <div className="srch-tab-left">
                                                                            <label>From</label>
                                                                            <div className="input-a">
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Search..."
                                                                                    id="searchfrom"
                                                                                    className="text_input"
                                                                                    name="searchfrom"
                                                                                    value={inputOrigin}
                                                                                    onChange={(e) => handleOriginChange(e.target.value)}
                                                                                />

                                                                                {showOriginDropdown && (
                                                                                    <ul style={{
                                                                                        position: 'absolute',
                                                                                        top: '100%',
                                                                                        marginLeft: '-8px',
                                                                                        borderRadius: '3px',
                                                                                        backgroundColor: '#fff',
                                                                                        paddingLeft: '6px',
                                                                                        width: '100%',
                                                                                        border: '1px solid #e3e3e3',
                                                                                        listStyle: 'none',
                                                                                        width: '100%',
                                                                                        zIndex: '9999',
                                                                                        maxHeight: '150px',
                                                                                        minHeight: 'auto',
                                                                                        overflow: 'auto'
                                                                                    }}>
                                                                                        {origin.map((option) => (
                                                                                            <li style={{
                                                                                                cursor: 'pointer',
                                                                                                fontFamily: 'Montserrat',
                                                                                                color: '#4c4c4c',
                                                                                                fontSize: '10px',
                                                                                                paddingTop: '5px',
                                                                                                paddingBottom: '5px',
                                                                                                paddingRight: '5px'
                                                                                            }} key={option.value} onClick={() => handleOrigin(option.value,option.airportName)}>
                                                                                                {option.label} ({option.value}) <br/>
                                                                                                {option.airportName}
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                )}


                                                                            </div>
                                                                            <div className="redorigin" style={{
                                                                                color: 'red',
                                                                                fontsize: '10px',
                                                                                fontfamily: 'Raleway', display: 'none'
                                                                            }}>Please select Origin</div>
                                                                            <div className="redorigin1" style={{
                                                                                color: 'red',
                                                                                fontsize: '10px',
                                                                                fontfamily: 'Raleway', display: 'none'
                                                                            }}>Please select valid Origin</div>
                                                                        </div>
                                                                        <button type="button" className='swapbutton' onClick={swapOriginAndDestination}><img src='/img/swap.png' width={'16px'}/></button>
                                                                        <div className="srch-tab-right">
                                                                            <label>To</label>
                                                                            <div className="input-a">
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Search..."
                                                                                    id="searchto" className="text_input" name="searchto"
                                                                                    value={inputDestination}
                                                                                    onChange={(e) => handleDestinationChange(e.target.value)}
                                                                                />

                                                                                {showDestinationDropdown && (
                                                                                    <ul style={{
                                                                                        position: 'absolute',
                                                                                        top: '100%',
                                                                                        marginLeft: '-8px',
                                                                                        borderRadius: '3px',
                                                                                        backgroundColor: '#fff',
                                                                                        paddingLeft: '6px',
                                                                                        width: '100%',
                                                                                        border: '1px solid #e3e3e3',
                                                                                        listStyle: 'none',
                                                                                        width: '100%',
                                                                                        zIndex: '9999',
                                                                                        maxHeight: '150px',
                                                                                        minHeight: 'auto',
                                                                                        overflow: 'auto'
                                                                                    }}>
                                                                                        {destination.map((option) => (
                                                                                            <li style={{
                                                                                                cursor: 'pointer',
                                                                                                fontFamily: 'Montserrat',
                                                                                                color: '#4c4c4c',
                                                                                                fontSize: '10px',
                                                                                                paddingTop: '5px',
                                                                                                paddingBottom: '5px',
                                                                                                paddingRight: '5px'
                                                                                            }} key={option.value} onClick={() => handleDestination(option.value,option.airportName)}>
                                                                                                {option.label} ({option.value}) <br/>
                                                                                                {option.airportName}
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                )}

                                                                            </div>
                                                                            <div className="redestination" style={{
                                                                                color: 'red',
                                                                                fontsize: '10px',
                                                                                fontfamily: 'Raleway', display: 'none'
                                                                            }}>Please select Destination</div>
                                                                            <div className="redestination1" style={{
                                                                                color: 'red',
                                                                                fontsize: '10px',
                                                                                fontfamily: 'Raleway', display: 'none'
                                                                            }}>Please select valid Destination</div>
                                                                        </div>
                                                                        <div className="clear"></div>
                                                                    </div>

                                                                </div>

                                                                <div className="search-large-i">

                                                                    <div className="srch-tab-line no-margin-bottom">
                                                                        <div className="srch-tab-left">
                                                                            <label>Departure</label>
                                                                            <div className="input-a" onClick={() => setdepIsOpen(true)}>
                                                                            <DatePicker
                                                                                name="searchdeparture"
                                                                                selected={formData.departureDate}
                                                                                onChange={handleDepartureDateChange}
                                                                                dateFormat="dd/MM/yyyy"
                                                                                minDate={new Date()}
                                                                                value={formData.departureDate}
                                                                                open={isdepOpen}
                                                                                onClickOutside={() => setdepIsOpen(false)}
                                                                            />
                                                                            <span className="date-icon" onClick={(e) => {e.stopPropagation(); setdepIsOpen(true)}}></span>
                                                                            </div>
                                                                            <span id="errorDate" style={{
                                                                                color: 'red',
                                                                                fontsize: '12px',
                                                                                fontfamily: 'Raleway'
                                                                            }} className="error-message"></span>
                                                                            <div className="redsearchdeparture" style={{
                                                                                color: 'red',
                                                                                fontsize: '12px',
                                                                                fontfamily: 'Raleway'
                                                                            }}>Please select Departure Date</div>
                                                                            <div className="redsearchdeparture1" style={{
                                                                                display:'none',
                                                                                color: 'red',
                                                                                fontsize: '12px',
                                                                                fontfamily: 'Raleway'
                                                                            }}>Please select valid Departure Date</div>
                                                                        </div>
                                                                        
                                                                        <div className="srch-tab-right" id="departurereturn">
                                                                            <label>Return</label>
                                                                            <div className="input-a" onClick={formData.bookingType === "Return" ? () => setretIsOpen(true) : () => () => setretIsOpen(false)}>
                                                                                <DatePicker
                                                                                    name="searchreturnDate"
                                                                                    selected={formData.returnDate}
                                                                                    onChange={handleReturnDateChange}
                                                                                    dateFormat="dd/MM/yyyy"
                                                                                    minDate={formData.departureDate || new Date()}
                                                                                    placeholderText="Add Return Date"
                                                                                    disabled={!isReturnEnabled}
                                                                                    open={isretOpen}
                                                                                    onClickOutside={() => setretIsOpen(false)}
                                                                                />
                                                                                <span
                                                                                    className="date-icon"
                                                                                    onClick={(e) => {
                                                                                        if (formData.bookingType === "Return") {
                                                                                        e.stopPropagation();
                                                                                        setretIsOpen(true);
                                                                                        }
                                                                                    }}
                                                                                ></span>
                                                                                </div>
                                                                            <span id="errorDate1" style={{
                                                                                color: 'red',
                                                                                fontsize: '12px',
                                                                                fontfamily: 'Raleway'
                                                                            }} className="error-message"></span>
                                                                            <div className="redsearchreturn" style={{
                                                                                display:'none',
                                                                                color: 'red',
                                                                                fontsize: '12px',
                                                                                fontfamily: 'Raleway'
                                                                            }}>Please select Return Date</div>
                                                                            <div className="redsearchreturn1" style={{
                                                                                display:'none',
                                                                                color: 'red',
                                                                                fontsize: '12px',
                                                                                fontfamily: 'Raleway'
                                                                            }}>Please select valid Return Date</div>
                                                                        </div>
                                                                        <div className="clear"></div>
                                                                    </div>
                                                                    
                                                                </div>

                                                                <div className="search-large-i">
                                                                    <div className="srch-tab-line no-margin-bottom">
                                                                        <label>Passengers & Cabinclass</label>
                                                                        <div className="input-a">
                                                                            <input
                                                                                type="text"
                                                                                id="openpassengermodal"
                                                                                name="openpassengermodal"
                                                                                className="openpassengermodal srch-lbl"
                                                                                placeholder="Select all"
                                                                                value={`Adult: ${adultCount}, Child: ${childCount}, Infant: ${infantCount}, Cabinclass: ${cabinClass} class`}
                                                                                onClick={handleToggle}
                                                                                readOnly
                                                                            />
                                                                            
                                                                        </div>
                                                                        <div className="redpassenger" style={{
                                                                            color: 'red',
                                                                            fontsize: '12px',
                                                                            fontfamily: 'Raleway'
                                                                        }}>Please select maximum 9 passenger</div>
                                                                        <div className="infantmore" style={{
                                                                            color: 'red',
                                                                            fontsize: '12px',
                                                                            fontfamily: 'Raleway'
                                                                        }}>Number of infants cannot be more than adults</div>
                                                                    </div>
                                                                    <div className="clear"></div>
                                                                </div>

                                                                <div className="clear"></div>
                                                            
                                                                <div className="search-asvanced" style={{ display: isOpen ? 'block' : 'none' }}>
                                                                    {/* // */}
                                                                    <div className="search-large-i">
                                                                        {/* // */}
                                                                        <div className="srch-tab-line no-margin-bottom">
                                                                            <div className="srch-tab-line no-margin-bottom">
                                                                                <label>Adults (12y + : on the day of travel)</label>
                                                                                <div className="select-wrapper1">
                                                                                    {/* Radio buttons for adults */}
                                                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                                                                                        <React.Fragment key={value}>
                                                                                            <input
                                                                                                type="radio"
                                                                                                name="adult"
                                                                                                id={`adult${value}`}
                                                                                                value={value}
                                                                                                onChange={(e) => handleAdult(e.target.value)}
                                                                                                checked={Cookies.get('cookiesData') ? value.toString() === adultCount.toString() : value === 1}
                                                                                            />
                                                                                            <label htmlFor={`adult${value}`}>{value}</label>
                                                                                        </React.Fragment>
                                                                                    ))}
                                                                                    <input
                                                                                        type="radio"
                                                                                        name="adult"
                                                                                        id="adultgreater9"
                                                                                        value={10}
                                                                                        onChange={(e) => handleAdult(e.target.value)}
                                                                                    />
                                                                                    <label htmlFor="adultgreater9">&gt;9</label>
                                                                                </div>
                                                                                
                                                                            </div>
                                                                            <div className="clear" />
                                                                        </div>
                                                                        {/* \\ */}
                                                                    </div>
                                                                    {/* \\ */}
                                                                    {/* // */}
                                                                    <div className="search-large-i">
                                                                        <div className="srch-tab-line no-margin-bottom">
                                                                            <label>Children (2y - 12y : on the day of travel)</label>
                                                                            <div className="select-wrapper1">
                                                                                {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                                                                                    <React.Fragment key={value}>
                                                                                        <input
                                                                                            type="radio"
                                                                                            name="child"
                                                                                            id={`child${value}`}
                                                                                            value={value}
                                                                                            onChange={(e) => handleChild(e.target.value)}
                                                                                            checked={Cookies.get('cookiesData') ? value.toString() === childCount.toString() : value === 0}
                                                                                        />
                                                                                        <label htmlFor={`child${value}`}>{value}</label>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                                <input
                                                                                    type="radio"
                                                                                    name="child"
                                                                                    id="childgreater6"
                                                                                    value={7}
                                                                                    onChange={(e) => handleChild(e.target.value)}
                                                                                />
                                                                                <label htmlFor="childgreater6">&gt;6</label>
                                                                            </div>
                                                                            
                                                                        </div>
                                                                    </div>
                                                                    {/* \\ */}
                                                                    {/* // */}
                                                                    <div className="search-large-i">
                                                                        <div className="srch-tab-line no-margin-bottom">
                                                                            <label>Infants (below 2y : on the day of travel)</label>
                                                                            <div className="select-wrapper1">
                                                                                {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                                                                                    <React.Fragment key={value}>
                                                                                        <input
                                                                                            type="radio"
                                                                                            name="infant"
                                                                                            id={`infant${value}`}
                                                                                            value={value}
                                                                                            onChange={(e) => handleInfant(e.target.value)}
                                                                                            checked={Cookies.get('cookiesData') ? value.toString() === infantCount.toString() : value === 0}
                                                                                        />
                                                                                        <label htmlFor={`infant${value}`}>{value}</label>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                                <input
                                                                                    type="radio"
                                                                                    name="infant"
                                                                                    id="infantgreater6"
                                                                                    value={7}
                                                                                    onChange={(e) => handleInfant(e.target.value)}
                                                                                />
                                                                                <label htmlFor="infantgreater6">&gt;6</label>
                                                                            </div>
                                                                            
                                                                        </div>
                                                                    </div>
                                                                    {/* \\ */}
                                                                    <div className="clear" />
                                                                </div>

                                                                <div className="search-asvanced" style={{ display: isOpen ? 'block' : 'none' }}>
                                                                    {/* // */}
                                                                    <div className="search-large-i1">
                                                                        {/* // */}
                                                                        <div className="srch-tab-line no-margin-bottom">
                                                                            <label>Choose Travel Class</label>
                                                                            <div className="select-wrapper1 select-wrapper2">
                                                                                {['Economy/Premium Economy', 'Business', 'First'].map((value) => (
                                                                                    <React.Fragment key={value}>
                                                                                        <input
                                                                                            type="radio"
                                                                                            name="classtype"
                                                                                            id={`classtype${value}`}
                                                                                            value={value}
                                                                                            onChange={(e) => handleClasstype(e.target.value)}
                                                                                            checked={Cookies.get('cookiesData') ? value.toString() === cabinClass.toString() : value === "Economy/Premium Economy"}
                                                                                            
                                                                                        />
                                                                                        <label style={{lineHeight:'1.8'}} htmlFor={`classtype${value}`}>{value === "Economy/Premium Economy" ? value : `${value} class`}</label>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </div>
                                                                            
                                                                            <div className="clear" />
                                                                        </div>
                                                                        {/* \\ */}
                                                                    </div>
                                                                    {/* \\ */}
                                                                    <div className="clear" />
                                                                </div>
                                                                
                                                            
                                                            </div>
                                                            <div id="error-message1" style={{ color: 'red', marginleft: '2%', fontfamily: 'Raleway', fontsize: '13px' }}></div>
                                                            <div id="error-message2" style={{ color: 'red', marginleft: '2%', fontfamily: 'Raleway', fontsize: '13px' }}></div>
                                                            <footer className="search-footer">
                                                                {/* <Link to="/FonewayFrm"> */}
                                                                <button type="submit" className="srch-btn" id="btnSearch">Search</button>
                                                                {/* </Link> */}
                                                                {/* <span className="srch-lbl">Advanced Search options</span> */}
                                                                <div className="clear"></div>
                                                            </footer>
                                                        </form>