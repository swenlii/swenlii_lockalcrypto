<div class="container margin-top-90">
    <div class="row">
        <div id="leftEntryDiv" class="col-xl-3 col-lg-4">
            <div class="sidebar-container">

                <!-- Location -->
                <div class="sidebar-widget">
                    <h3><%=_lt.get('Location')%></h3>
                    <div class="input-with-icon">
                        <div id="autocomplete-container">
                            <input
                                    id="autocomplete-listing-companies"
                                    autocomplete="off"
                                    class="googlemaps-autocomplete with-border"
                                    type="text"
                                    placeholder="<%=_lt.get('Location')%>"
                            >
                        </div>
                        <i class="icon-material-outline-location-on"></i>
                    </div>
                    <div class="switches-list margin-top-20">
                        <div class="switch-container">
                            <label class="switch"><input type="checkbox" v-model="onlyRegistered" v-on:change="readCompanies()"><span class="switch-button"></span> <%=_lt.get('Only registered')%></label>
                        </div>
                    </div>
                </div>

                <!-- Job Types -->
                <div class="sidebar-widget">
                    <h3><%=_lt.get('Business Time')%></h3>

                    <div class="margin-bottom-25">
                        <!-- Range Slider -->
                        <div id="sliderContainer"></div>
                        <input id="sliderHoursWork" class="range-slider range-slider-single" type="text"/>

                    </div>

                    <span id="buttonHourWork" class="button grey ripple-effect col-lg-4 text-align-center margin-bottom-20" v-on:click="sliderChange()" style="background-color: #333333;display: none">Show</span>

                    <div class="switches-list">
                        <div class="switch-container">
                            <label class="switch"><input type="checkbox" v-model="workOnSaturday" v-on:change="readCompanies()"><span class="switch-button"></span> <%=_lt.get('Work on Saturday')%></label>
                        </div>
                        <div class="switch-container">
                            <label class="switch"><input type="checkbox" v-model="workOnSunday" v-on:change="readCompanies()"><span class="switch-button"></span> <%=_lt.get('Work on Sunday')%></label>
                        </div>
                    </div>

                </div>

                <div class="sidebar-widget">
                    <span class="button button-sliding-icon ripple-effect" style="min-width: 150px" v-on:click="readByDefault()">Show All<i class="icon-material-outline-arrow-right-alt"></i></span>
                </div>

            </div>
        </div>
        <div class="col-xl-9 col-lg-8 content-left-offset">

            <h3 class="page-title"><%=_lt.get('Search Results')%></h3>

            <div class="notify-box margin-top-15">
                <div class="switch-container">
                    <div class="loading">
                        <div class="loading_ball_outside"><div class="loading_inside"></div></div>
                    </div>
                    <label class="switch"><input v-model="onlyYourCity" v-on:change="onlyYourCitySwitch()" type="checkbox"><span class="switch-button"></span><span class="switch-text"><%=_lt.get('Show only your city')%></span></label>
                </div>

                <div class="sort-by">
                    <span><%=_lt.get('Sort by:')%></span>
                    <select class="selectpicker hide-tick selectListingOff" v-model="this.sortBy" @change="changeCompanySorting()">
                        <option value="countryAZ">By country A-Z</option>
                        <option value="countryZA">By country Z-A</option>
                        <option value="sort3"><%=_lt.get('Oldest')%></option>
                        <option value="sort4"><%=_lt.get('Bookmark')%></option>
                    </select>
                </div>
            </div>

            <div class="listings-container margin-top-35">
                <div id="city-not-found-c" class="city-not-found city-not-found-hide"> <h3><%=_lt.get('No companies in city')%></h3> <br> <h3><%=_lt.get('Show companies in country')%></h3> </div>
                <div id="country-not-found-c" class="city-not-found city-not-found-hide"> <h3><%=_lt.get('No companies in your country')%></h3> <br> <h3><%=_lt.get('Show all companies')%></h3> </div>
                <div id="no-companies" class="city-not-found city-not-found-hide"> <h3><%=_lt.get('No companies in our catalog')%></h3></div>
                <div id="no-companies-by-filter" class="city-not-found city-not-found-hide"> <h3><%=_lt.get('No companies by filter')%></h3></div>

                <div v-for="country in companies">
                <!-- Headline -->
                <div class="dashboard-box margin-top-35 margin-bottom-35" v-if="country.exchanges.length > 0">
                    <div class="headline" style="display: flex; justify-content: space-between">
                        <h3><i class="icon-material-outline-location-on"></i> {{country.country_name}}</h3>
                        <h4>{{country.exchanges.length}} <%=_lt.get('Companies')%></h4>
                    </div>
                </div>

                <!-- Job Listing -->
                <div v-for="company in country.exchanges" class="job-listing" style="cursor: pointer" @click="goToProfile(company)">

                    <!-- Job Listing Details -->
                    <div class="job-listing-details">
                        <!-- Logo -->
                        <div class="job-listing-company-logo">
                            <img :src="'images/users/' + company.logoPath" alt="">
                        </div>

                        <!-- Details -->
                        <div class="job-listing-description">
                            <h3 class="job-listing-title">{{company.name}} <span v-if="company.userId" class="verified-badge" title="Registered on localcrypto" data-tippy-placement="top"></span></h3>
                            <p class="job-listing-text">{{company.info}}</p>
                        </div>

                        <!-- Bookmark -->
                        <span class="bookmark-icon"></span>
                    </div>

                    <!-- Job Listing Footer -->
                    <div class="job-listing-footer">
                        <ul>
                            <li v-if="company.city"><i class="icon-material-outline-business"></i> {{company.city}}</li>
                            <li v-if="company.webSite"><i class="icon-material-outline-language"></i> {{company.webSite}}</li>
                            <li v-if="company.email"><i class="icon-feather-mail"></i> {{company.email}}</li>
                            <li v-if="company.phone"><i class="icon-feather-phone"></i> {{company.phone}}</li>
                            <li v-if="company.businessHours"><i class="icon-material-outline-access-time"></i>{{company.workHourStart}}:00 - {{company.workHourEnd}}:00</li>
                        </ul>
                    </div>
                </div>
                </div>

            <!-- Pagination -->
                <!-- Pagination -->
                <div class="clearfix"></div>
                <div class="row margin-bottom-40">
                    <div class="col-md-12">
                        <!-- Pagination -->
                        <div class="pagination-container margin-top-60 margin-bottom-30">
                            <nav class="pagination">
                                <ul>
                                    <li class="pagination-arrow"><a href="#" v-on:click='goToPagination(catalogCompaniesPage-1)'><i class="icon-material-outline-keyboard-arrow-left"></i></a></li>
                                    <li v-for="pageNum in companiesPaginationArray"><a href="#" v-on:click='goToPagination(pageNum)' v-bind:class="{ 'current-page': pageNum === catalogCompaniesPage}">{{pageNum}}</a></li>
                                    <li class="pagination-arrow"><a href="#" v-on:click='goToPagination(catalogCompaniesPage+1)'><i class="icon-material-outline-keyboard-arrow-right"></i></a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <!-- Pagination / End -->
            <!-- Pagination / End -->

        </div>
    </div>
</div>
</div>
