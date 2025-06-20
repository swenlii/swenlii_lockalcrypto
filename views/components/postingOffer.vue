<!-- Dashboard Content
================================================== -->
<div class="dashboard-content-container">
	<div class="dashboard-content-inner" style="overflow-y: hidden">
		
		<!-- Dashboard Headline -->
		<div class="dashboard-headline">
			<h3><%=_lt.get('Post an Offer')%></h3>
		</div>
		
		<!-- Row -->
		<div class="row">
			<form id="postOffForm" name="postForm">
				<!-- Dashboard Box -->
				<div class="col-xl-12">
					<div class="dashboard-box margin-top-0">
						
						<!-- Headline -->
						<div class="headline">
							<h3><i class="icon-feather-folder-plus"></i> <%=_lt.get('Offer Publication Form')%></h3>
							<p style="margin-bottom: 0"><%=_lt.get('The Commission is 1%')%></p>
						</div>
						
						<div class="content with-padding padding-bottom-10">
							<div class="row">
								<div class="col-xl-9">
									<!-- Account Type -->
									<div class="submit-field">
										<h5><%=_lt.get('Offer Type')%></h5>
										<div class="account-type">
											<div>
												<input
														type="radio" name="offer-type-radio" value="wts"
														v-model="offerType"
														id="wts-radio" class="account-type-radio" checked=""
												>
												<label for="wts-radio" class="ripple-effect-dark" style="height: auto"><i
														class="icon-material-outline-account-circle"
												></i> <%=_lt.get('Want to Sell')%></label>
											</div>
											
											<div>
												<input
														type="radio" name="offer-type-radio" value="wtb"
														v-model="offerType"
														id="wtb-radio" class="account-type-radio"
												>
												<label for="wtb-radio" class="ripple-effect-dark" style="height: auto"><i
														class="icon-material-outline-business-center"
												></i> <%=_lt.get('Want to Buy')%></label>
											</div>
											
											<div>
												<input
														type="radio" name="offer-type-radio" value="exch"
														v-model="offerType"
														id="exch-radio" class="account-type-radio"
												>
												<label for="exch-radio" class="ripple-effect-dark" style="height: auto"><i
														class="icon-material-outline-business-center"
												></i> <%=_lt.get('Want to Exchange')%></label>
											</div>

										</div>
									</div>
								</div>

								<div class="col-xl-3">
									<!-- Account Type -->
									<div v-show="(offerType === 'wts' || offerType === 'wtb')" class="submit-field fiatCurrency">
										<h5><%=_lt.get('Fiat Currency')%></h5>
										<select
												class="with-border thisTry" data-size="7" title="<%=_lt.get('Choose cryptocurrency')%>"
												required v-model="choosedFiatId" autofocus
										>
											<!--<option selected disabled></option>-->
											<option v-for="oneFiat in fiatCurrencies" v-bind:value="oneFiat.id">
												{{oneFiat.name}} ({{oneFiat.short_name}})
											</option>
										</select>
									</div>
									
									<div v-show="offerType === 'exch'" class="submit-field">
										<h5><%=_lt.get('Your cryptocurrency')%></h5>
										<select
												id="chooseCryptocurrencyExch"
												class="with-border"
												data-live-search="true"
												data-size="7" autofocus
												title="<%=_lt.get('Choose cryptocurrency')%>"
												required v-model="yourCrypto"
												onchange="app.$refs.postOffer.yourCrypto = parseInt(this.value)"
										>
											<!--<option selected disabled></option>-->
											<option v-for="oneCrypto in cryptoCurrencies" :data-tokens="oneCrypto.name + ' ' + oneCrypto.short_code" v-bind:value="oneCrypto.id" v-bind:key="oneCrypto.id">
												{{oneCrypto.name}} ({{oneCrypto.short_code}})
											</option>
										</select>
									</div>
								</div>
								
								
								<div class="col-xl-4">
									<div class="submit-field">
										<h5><%=_lt.get('Offer short title')%></h5>
										<input
												type="text" class="with-border offerShortTitle"
												v-bind:placeholder="sloganVariation.offerTitle" v-model="offerTitle"
												v-bind:class="{warningInput : validationFields.includes('offerTitle')}"
												autocomplete="off" autofocus
										>
									</div>
								</div>
								
								<div class="col-xl-4">
									<div class="submit-field">
										<h5>{{sloganVariation.cryptoHeading}}</h5>
										<select
												id="chooseCryptocurrency"
												class="with-border "
												data-live-search="true" autofocus
												data-size="7" title="<%=_lt.get('Choose cryptocurrency')%>"
												required v-model="choosedCryptoId" onchange="app.$refs.postOffer.choosedCryptoId = parseInt(this.value)"
										>
											<option disabled value="">Choose cryptocurrency</option>
											<option v-for="oneCrypto in cryptoCurrencies" :data-tokens="oneCrypto.name + ' ' + oneCrypto.short_code" v-bind:value="oneCrypto.id" v-bind:key="oneCrypto.id">
												{{oneCrypto.name}} ({{oneCrypto.short_code}})
											</option>
										</select>
									</div>
								</div>

								<div class="col-xl-4">
									<div class="submit-field">
										<h5><%=_lt.get('Location, city')%> <i class="help-icon">
											<p class="tooltip-center"> <%=_lt.get('Location is always indicated')%></p>
										</i></h5>
										<div class="input-with-icon">
											<div id="autocomplete-container">
												<input
														id="autocomplete-post-offer"
														autocomplete="off" autofocus
														class="googlemaps-autocomplete with-border"
														type="text"
														placeholder="Anywhere"
												>
											</div>
											<i class="icon-material-outline-location-on"></i>
										</div>
									</div>
								</div>

								<div class="col-xl-5">
									<div class="submit-field price">
										<h5><%=_lt.get('Price')%>
										<i
											v-show="priceExplantation === 'Estimated price for one coin?'"
											class="help-icon"
										>
											<p class="tooltip-right"><%=_lt.get('Estimated price for one coin?')%></p>
										</i>
										<i
											v-show="priceExplantation === 'Price. Choose e.g. 1% more than on the coingecko in selling time'"
											class="help-icon"
										>
											<p class="tooltip-right"><%=_lt.get('Choose e.g. 1% more')%></p>
										</i>
										</h5>
										<div class="row">
											<div
													class="col-xl-6"
													v-show="(priceType === 'dynamic' && offerType !== 'exch')"
											>
												<div class="submit-field">
													<select
															class="selectpicker with-border thisTry" data-size="7" autofocus
															title="<%=_lt.get('Choose percent')%>" required v-model="possiblePercent"
													>
														<!--<option selected disabled></option>-->
														<option value="m10">-10%</option>
														<option value="m9">-9%</option>
														<option value="m8">-8%</option>
														<option value="m7">-7%</option>
														<option value="m6">-6%</option>
														<option value="m5">-5%</option>
														<option value="m4">-4%</option>
														<option value="m3">-3%</option>
														<option value="m2">-2%</option>
														<option value="m1">-1% <%=_lt.get('of the price on coingecko')%></option>
														<option value="zero">0%. <%=_lt.get('Same price as on coingecko')%></option>
														<option value="p1">+1% <%=_lt.get('of the price on coingecko')%></option>
														<option value="p2">+2%</option>
														<option value="p3">+3%</option>
														<option value="p4">+4%</option>
														<option value="p5">+5%</option>
														<option value="p6">+6%</option>
														<option value="p7">+7%</option>
														<option value="p8">+8%</option>
														<option value="p9">+9%</option>
														<option value="p10">+10%</option>

													</select>
												</div>
											</div>

											<div
													v-bind:class="wideRowClass()"
													style="margin-bottom: 12px"
													v-show="(priceType === 'fixed' || offerType === 'exch')"
											>
												<div class="input-with-icon red">
													<input
															class="with-border red" type="number" autofocus
															placeholder="Only numbers" v-model.number="price"
															v-bind:disabled="(priceType === 'dynamic' && offerType !== 'exch')"
															v-bind:class="{warningInput : validationFields.includes('price')}"
													>
													<i class="currency">{{choosedFiatShortCode}}</i>
												</div>

											</div>

											<div class="col-xl-6" v-show="(offerType !== 'exch' && choosedCryptoId !== '' && choosedFiatId !== '')">
												<div
														class="notification success closeable" style="padding-bottom: 10px; padding-top: 10px;
padding-right: 1px;"
												>
													<p style="font-size: 12px">{{placeholderPrice}}
													 	{{choosedFiatShortCode}} </p>

												</div>

											</div>

										</div>
										<div v-show="offerType !== 'exch'" class="feedback-yes-no margin-top-0">
											<div class="radio">
												<input
														v-model="priceType" id="radio-2" name="radio" type="radio"
														value="dynamic" @change="changePriceType" autofocus
												>
												<label for="radio-2"><span class="radio-label"></span> <%=_lt.get('Dynamic price via coingecko')%></label>
											</div>

											<div class="radio">
												<input
														v-model="priceType" id="radio-1" name="radio" type="radio"
														value="fixed" @change="changePriceType" checked autofocus
												>
												<label for="radio-1"><span class="radio-label"></span> <%=_lt.get('Fixed Price Offer')%></label>
											</div>
										</div>
									</div>
								</div>
								<div class="col-xl-4">
									<div class="submit-field">
										<h5>{{sloganVariation.deposite}} <i class="help-icon">
											<p class="tooltip-center"><%=_lt.get('The maximal amount!')%></p>
										</i>
										</h5>
										<div class="keywords-container">
											<div class="keyword-input-container">
												<input
														type="number" class="keyword-input with-border deposite"
														v-bind:placeholder="sloganVariation.depositePlace"
														v-model="deposite" autofocus
														v-bind:class="{warningInput : validationFields.includes('deposite')}"
														autocomplete="off"
												/>
											</div>
											<div class="clearfix"></div>
										</div>

									</div>
								</div>

								<div class="col-xl-3">
									<div class="submit-field" v-show="(offerType === 'wts' || offerType === 'exch')">
										<h5><%=_lt.get('Allow to sell less')%></h5>
										<div class="checkbox">
											<input v-model="canDivide" type="checkbox" id="canDivide" checked="">
											<label for="canDivide"><span class="checkbox-icon"></span> <%=_lt.get('Yes.')%></label>
										</div>
										<i class="help-icon">
											<p class="tooltip-center"><%=_lt.get('For example, you sell 0.5 BTC')%></p>
										</i>

									</div>
								</div>

								<div class="col-xl-12">
									<div class="submit-field">
										<h5><%=_lt.get('Describe Your Offer')%></h5>
										<textarea v-model="descr" cols="30" rows="5" class="with-border descr" v-bind:class="{warningInput : validationFields.includes('descr')}" autofocus></textarea>
										<!--<div class="uploadButton margin-top-30">-->
										<!--<input class="uploadButton-input" type="file" accept="image/*, application/pdf"-->
										<!--id="upload" multiple/>-->
										<!--<label class="uploadButton-button ripple-effect" for="upload">Upload-->
										<!--Files</label>-->
										<!--<span class="uploadButton-file-name">Images or documents that might be helpful in describing your project</span>-->
										<!--</div>-->
									</div>
								</div>

								<div class="col-xl-12">
									<div class="submit-field">
										<h5><%=_lt.get('Payment options')%></h5>
										<div class="checkbox">
											<input v-model="paymentBank" type="checkbox" id="paymentBank" checked="">
											<label for="paymentBank">
												<span class="checkbox-icon"></span>
												<%=_lt.get('Bank transfer')%>
											</label>
										</div>
										<i class="help-icon margin-right-15">
											<p class="tooltip-center"><%=_lt.get('Make a payment by bank trans')%></p>
										</i>

										<div class="checkbox">
											<input v-model="paymentMeet" type="checkbox" id="paymentMeet" checked="">
											<label for="paymentMeet">
												<span class="checkbox-icon"></span>
												<%=_lt.get('Personal meeting')%>
											</label>
										</div>
										<i class="help-icon margin-right-15">
											<p class="tooltip-left"><%=_lt.get('Make a payment at a personal')%></p>
										</i>

										<div class="checkbox">
											<input v-model="paymentDigital" type="checkbox" id="paymentDigital" checked="">
											<label for="paymentDigital">
												<span class="checkbox-icon"></span>
												<%=_lt.get('Paypal Stripe etc')%>
											</label>
										</div>
										<i class="help-icon margin-right-15">
											<p class="tooltip-left"><%=_lt.get('Make a payment via')%></p>
										</i>
										

										<div v-show="offerType === 'exch'" class="checkbox">
											<input v-model="paymentInternal" type="checkbox" id="paymentInternal" checked="">
											<label for="paymentInternal">
												<span class="checkbox-icon"></span>
												<%=_lt.get('Internal transfers')%>
											</label>
										</div>

										<i class="help-icon margin-right-15" v-show="offerType === 'exch'">
											<p class="tooltip-left"><%=_lt.get('Up to 5 skills that')%></p>
										</i>


									</div>
								</div>
							</div>
						</div>
					</div>
				</div>


				<div class="col-xl-12">
					<div class="dashboard-box">

						<!-- Headline -->
						<div class="headline">
							<h3><i class="icon-material-outline-account-circle"></i> <%=_lt.get('My Account')%></h3>
						</div>

						<div class="content with-padding padding-bottom-0">

							<div v-if="!userObj.uHash" class="row">

								<div class="col-auto">
									<div
											class="avatar-wrapper custom-avatar-wrapper"
											data-tippy-placement="bottom"
											data-tippy-theme="light"
											data-original-title="<%=_lt.get('Change Avatar')%>"
											data-tippy-content="<%=_lt.get('Change Avatar')%>"
									>
										<img class="profile-pic" src="./images/user-avatar-placeholder.png" alt="">
										<div id="upload-button-post-offer" class="upload-button"></div>
										<input id="file-upload-post-offer" class="file-upload" type="file" accept="image/*">
									</div>
								</div>

								<div class="col">
									<div class="row">

										<div v-if="alreadyRegistered === 'no'" class="col-xl-6">
											<div class="submit-field">
												<h5><%=_lt.get('First Name')%></h5>
												<input
														v-model="firstName" type="text" class="with-border"
														placeholder="Name"
														v-bind:class="{warningInput : validationFields.includes('firstName')}"
												>
											</div>
										</div>

										<div v-if="alreadyRegistered === 'no'" class="col-xl-6">
											<div class="submit-field">
												<h5><%=_lt.get('Last Name')%></h5>
												<input
														v-model="lastName" type="text" class="with-border"
														placeholder="Last Name"
														v-bind:class="{warningInput : validationFields.includes('lastName')}"
												>
											</div>
										</div>

										<div class="col-xl-6">
											<!-- Account Type -->
											<div class="submit-field">
												<h5><%=_lt.get('Registration Status')%></h5>
												<div class="account-type">
													<div>
														<input
																type="radio" name="account-type-radio"
																id="registered-radio" class="account-type-radio"
																value="no" v-model="alreadyRegistered"
														>
														<label for="registered-radio" class="ripple-effect-dark" style="height: auto"><i
																class="icon-material-outline-account-circle"
														></i> <%=_lt.get('New registration')%></label>
													</div>

													<div>
														<input
																type="radio" name="account-type-radio" id="login-radio"
																class="account-type-radio" value="yes"
																v-model="alreadyRegistered"
														>
														<label for="login-radio" class="ripple-effect-dark" style="height: auto"><i
																class="icon-material-outline-business-center"
														></i>
															<%=_lt.get('Already registered')%></label>
													</div>
												</div>
											</div>
										</div>
										<div class="col-xl-6" v-show="alreadyRegistered === 'yes'"></div>

										<div class="col-xl-6">
											<div class="submit-field">
												<h5><%=_lt.get('Email')%></h5>
												<input
														v-model="email" type="email" class="with-border"
														placeholder="Email" autocomplete="email"
														v-bind:class="{warningInput : validationFields.includes('email')}"
												>
											</div>
										</div>

										<div class="col-xl-6" v-show="alreadyRegistered === 'yes'">
											<div class="submit-field account-type">
												<h5><%=_lt.get('Password')%></h5>
												<input
														v-model="password" type="password" class="with-border"
														placeholder="Password" min="6"
														v-bind:class="{warningInput : validationFields.includes('password')}"
												>
												<a
                                                        href="#restore-password-dialog"
                                                        class="popup-with-zoom-anim forgot-password"
												><%=_lt.get('Forgot Password?')%></a>
											</div>
										</div>

									</div>
								</div>
							</div>
<div v-else class="row">



								<div class="col">
									<div class="row">

										<div class="col-xl-6">
											<!-- Account Type -->
											<div class="submit-field">
												<h5><%=_lt.get('Post this offer from user:')%> {{userObj.name}} {{userObj.surname}}</h5>
												<div class="account-type">
													<div>
													<small><a v-on:click.prevent="deleteUserObj()" href="#"><%=_lt.get('Post as another user?')%></a></small>
													</div>


												</div>
											</div>
										</div>




									</div>
								</div>
							</div>

						</div>


					</div>
				</div>

				<div class="col-xl-12">
					<a @click.prevent="postOfferForm($event)" href="#" :class="{'block': isPosting}" class="button ripple-effect big margin-top-30"><i
							class="icon-feather-plus"
					></i> <%=_lt.get('Post the Offer')%></a>
				</div>
			</form>
		</div>
		<!-- Row / End -->

		<!-- Footer -->
		<div class="dashboard-footer-spacer"></div>


	</div>
</div>
<!-- Dashboard Content / End -->
