<!-- Spacer -->
    <!-- Spacer / End-->
<!-- Page Content
================================================== -->
<div class="container"> <div class="margin-top-90"></div>
	<div class="row">
		<div id="leftEntryDiv" class="col-xl-3 col-lg-4">
			<div class="sidebar-container">

				<!-- Location -->
				<div class="sidebar-widget">
					<h3><%=_lt.get('Location')%></h3>
					<div class="input-with-icon">
						<div id="autocomplete-container">
							<input id="autocomplete-listing-offer" type="text" placeholder="<%=_lt.get('Location')%>">
						</div>
						<i class="icon-material-outline-location-on"></i>
					</div>
				</div>

				<!-- Keywords -->
				<div class="sidebar-widget">
					<h3><%=_lt.get('Choose cryptocurrency')%></h3>
					<div class="keywords-container">
						<div class="keyword-input-container">
							<input v-model="cryptoSearch" id="inputSearchCrypto" type="text" class="keyword-input" placeholder="<%=_lt.get('e.g. Ethereum')%>"/>
							<button class="keyword-input-button ripple-effect"><i class="icon-material-outline-search"></i></button>
                            <ul v-show="showCurrencyAutocomplete" id="preselectCrypto">
                                <li v-for="(oneCurrency, index) in currencySearchArr" @click="insertCurrencyInTag(oneCurrency)" :key="oneCurrency.id"><span>{{oneCurrency.name}} ({{oneCurrency.short_code}})</span></li>
                            </ul>
						</div>
						<div id="listingSelected" class="keywords-list"><!-- keywords go here -->
                        </div>


						<div class="clearfix"></div>
					</div>
				</div>

				<!-- Category -->
				<div class="sidebar-widget">
					<h3><%=_lt.get('Category')%></h3>
					<select v-on:change="changeOffersType($event)" autocomplete="off" class="selectpicker selectListingOff" data-selected-text-format="count" data-size="7" title="<%=_lt.get('All Categories')%>">
						<option value="wts" selected><%=_lt.get('Want to sell')%></option>
						<option value="wtb"><%=_lt.get('Want to buy')%></option>
						<option value="exch"><%=_lt.get('Want to exchange')%></option>
					</select>
				</div>

				<!-- Job Types -->
				<div class="sidebar-widget">
					<h3><%=_lt.get('Payment method')%></h3>

					<div class="switches-list">
						<div class="switch-container">
							<label class="switch"><input type="checkbox" v-model="checkedPayments" value="bank" @change="readAnotherOffers()"><span class="switch-button"></span> <%=_lt.get('Via Bank')%></label>
						</div>

						<div class="switch-container">
							<label class="switch"><input type="checkbox" v-model="checkedPayments" @change="readAnotherOffers()" value="personal"><span class="switch-button"></span> <%=_lt.get('Personal meeting')%></label>
						</div>

						<div class="switch-container">
							<label class="switch"><input type="checkbox" v-model="checkedPayments" @change="readAnotherOffers()" value="digital"><span class="switch-button"></span> <%=_lt.get('Electronic')%></label>
						</div>

						<div class="switch-container" v-if="this.offersType === 'exch'">
							<label class="switch"><input type="checkbox" v-model="checkedPayments" @change="readAnotherOffers()" value="internal"><span class="switch-button"></span> <%=_lt.get('Through localcrypto')%></label>
						</div>
					</div>
				</div>

				<!-- Salary -->
				<div class="sidebar-widget">
					<h3><%=_lt.get('Price')%></h3>
					<div class="margin-top-55"></div>
<div id="sliderContainer">
					<!-- Range Slider -->

	</div>
				</div>

				<!-- Tags -->
				<!--
				<div class="sidebar-widget">
					<h3>Tags</h3>

					<div class="tags-container">
						<div class="tag">
							<input type="checkbox" id="tag1"/>
							<label for="tag1">front-end dev</label>
						</div>
						<div class="tag">
							<input type="checkbox" id="tag2"/>
							<label for="tag2">angular</label>
						</div>
						<div class="tag">
							<input type="checkbox" id="tag3"/>
							<label for="tag3">react</label>
						</div>
						<div class="tag">
							<input type="checkbox" id="tag4"/>
							<label for="tag4">vue js</label>
						</div>
						<div class="tag">
							<input type="checkbox" id="tag5"/>
							<label for="tag5">web apps</label>
						</div>
						<div class="tag">
							<input v-on:click="lol()" type="checkbox" id="tag6"/>
							<label for="tag6">design</label>
						</div>
						<div class="tag">
							<input type="checkbox" id="tag7"/>
							<label for="tag7">wordpress</label>
						</div>
					</div>
					<div class="clearfix"></div>
				</div>
				-->

			</div>
		</div>
		<div id="centerDiv" class="col-xl-9 col-lg-8 content-left-offset">

			<h3 class="page-title"><span v-for="(oneCurrency, index) in selectedCurrencies"><span><span v-if="index !=0"><%=_lt.get('and')%> </span> {{oneCurrency.name}} </span></span> <%=_lt.get('Sell Offers')%> <template v-if="onlyYourCity"><%=_lt.get('in')%> {{city}}</template> </h3>

			<div class="notify-box margin-top-15">
				<div class="switch-container">
					<div class="loading">
    					<div class="loading_ball_outside"><div class="loading_inside"></div></div>
    				</div>
					<label class="switch"><input v-model="onlyYourCity" v-on:change="onlyYourCitySwitch()" type="checkbox"><span class="switch-button"></span><span class="switch-text"><%=_lt.get('Show only your city')%></span></label>
				</div>

				<div class="sort-by">
					<span><%=_lt.get('Sort by:')%></span>
					<select v-model="sortedBy" @change="changeOffersSorting()" class="selectpicker hide-tick selectListingOff">
						<option><%=_lt.get('Date')%></option>
						<option><%=_lt.get('Price descending')%></option>
						<option><%=_lt.get('Price ascending')%></option>
						<option><%=_lt.get('Bookmarked')%></option>
					</select>
				</div>
			</div>

			<div class="listings-container compact-list-layout margin-top-35">
				<div id="city-not-found" class="city-not-found city-not-found-hide"> <h3><%=_lt.get('No offers in city.')%></h3> <br> <h3><%=_lt.get('The offers of country')%></h3> </div>
				<div id="country-not-found" class="city-not-found city-not-found-hide"> <h3><%=_lt.get('No offers city country.')%></h3> <br> <h3><%=_lt.get('All offers are')%></h3> </div>
				<div id="no-offers" class="city-not-found city-not-found-hide"> <h3><%=_lt.get('There are no offers')%></h3></div>


				<div style="cursor: pointer;" v-for="(offer, index) in offers"  @click="goToOffer($event, '#apply-offer/'+offer.offerId)" class="job-listing" :key="index"  >
  					<!-- Job Listing Details -->
					<div class="job-listing-details">

						<!-- Logo -->

						<div class="job-listing-company-logo">
							<img alt="" :src="'/images/c/' + offer.logo_path" >
						</div>
                        <div v-bind:href="'#apply-offer/'+offer.offerId" @click="$parent.goToPage('apply-offer/'+offer.offerId)" >

						<!-- Details -->
						<div class="job-listing-description">
                            <div class="d-flex justify-content-between flex-wrap">
    							<h3 class="job-listing-title footer-column d-flex justify-content-between">
    								<div>{{ offer.short_title }}</div>
    							</h3>
    							<h4>
                                    <div class="margin-right-60" v-if="offer.offerActivatedDate">&nbsp;</div>
    							</h4>
                            </div>
							<!-- Job Listing Footer -->
							<div class="job-listing-footer">
								<ul class="footer-column">
									<li><i class="icon-material-outline-fingerprint"></i> {{ offer.userName?offer.userName:'Deleted user' }} <div v-show="offer.verifiedRate > 0" class="verified-badge" title="<%=_lt.get('Verified Seller')%>" data-tippy-placement="top"></div></li>
									<li><i class="icon-material-outline-location-on"></i> {{ offer.country_name }}</li>
									<li title="<%=_lt.get('Exchange rate')%>"><i class="icon-material-outline-monetization-on"></i> 1 {{offer.cryptoShortCode}} = {{ getPriceFormatted(offer)}} {{ offer.fiatName}}</li>
									<li title="<%=_lt.get('Offer deposite')%>"><i class="icon-material-outline-account-balance"></i> {{ offer.max_deposite}} {{ offer.cryptoName}}</li>
								</ul>
							</div>
						</div>
                        </div>
						<!-- Bookmark -->
						<span v-bind:class="{ bookmarked: bookmarkedOffers.includes(offer.offerId) }" class="bookmark-icon" v-on:click="setBookmark($event,   offer.offerId)"></span>
					</div>

			</div>


			<!-- Pagination -->
			<div class="clearfix"></div>
			<div class="row margin-bottom-40">
				<div class="col-md-12">
					<!-- Pagination -->
					<div class="pagination-container margin-top-60 margin-bottom-30">
						<nav class="pagination">
							<ul>
								<li class="pagination-arrow"><a href="#" v-on:click='goToPagination(currentOffersPage-1)'><i class="icon-material-outline-keyboard-arrow-left"></i></a></li>
								<li v-for="pageNum in offersPaginationArray"><a href="#" v-on:click='goToPagination(pageNum)' v-bind:class="{ 'current-page': pageNum === currentOffersPage}">{{pageNum}}</a></li>
								<li class="pagination-arrow"><a href="#" v-on:click='goToPagination(currentOffersPage+1)'><i class="icon-material-outline-keyboard-arrow-right"></i></a></li>
							</ul>
						</nav>
					</div>
				</div>
			</div>
			<!-- Pagination / End -->

		</div>

	</div>



</div>
</div>