<div>
<!-- Titlebar
================================================== -->
<div class="single-page-header" data-background-image="images/single-task.jpg">
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<div class="single-page-header-inner">
					<div class="left-side">
						<div class="header-image"><a v-on:click.prevent="" href="single-company-profile.html"><img v-bind:src="'/images/c/' + offerObj.logo_path" alt=""></a></div>
						<div class="header-details">
							<div class="d-flex justify-content-between">
								<h3>{{offerObj.short_title}}</h3>
<!--								<span class="padding-top-10 margin-top-3 margin-bottom-12">{{moment(offerObj.activated_date).format('DD.MM.YYYY')}}</span>-->
							</div>
							<h5>{{offerObj.typeWords}}</h5>
							<ul>
								<li><a v-on:click.prevent="" href="single-company-profile.html"><i class="icon-material-outline-business"></i> {{offerObj.cityEnglishName}}</a></li>

								<li><img class="flag" v-bind:src="'/images/flags/'+offerObj.country_codeLow+'.svg'" alt=""> {{offerObj.country_name}}</li>
								<li><div title="<%=_lt.get('Offer rating')%>" v-if="(offerObj.calculatedRating && offerObj.calculatedRating > 0)" class="star-rating" v-bind:data-rating="offerObj.calculatedRating"></div><div v-else><%=_lt.get('This offer no ratings')%></div></li>
								<li v-show="offerObj.verifiedUserRate > 0"><div class="verified-badge-with-title"><%=_lt.get('Verified User')%></div></li>
							</ul>
						</div>
					</div>
					<div class="right-side">
						<div class="salary-box">
							<div class="salary-type">{{priceFormatted().title}}</div>
							<div id="priceOne" class="salary-amount">{{priceFormatted().price}}</div>
							<span style="font-size: 11px" v-if="offerObj.priceType === 'dynamic'"><%=_lt.get('updated every 10 min')%></span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


<!-- Page Content
================================================== -->
<div class="container">
	<div class="row">

		<!-- Content -->
		<div class="col-xl-8 col-lg-8 content-right-offset">
			<!-- Description -->
			<div class="single-page-section">
				<h3 class="margin-bottom-25"><%=_lt.get('Offer Description')%></h3>
                <p>{{offerObj.description}}</p>
			</div>

			<!-- Atachments -->
			<!--<div class="single-page-section">-->
				<!--<h3>About cryptocurrency</h3>-->
				<!--<div class="attachments-container">-->
					<!--<a href="#" class="attachment-box ripple-effect"><span>Project Brief</span><i>PDF</i></a>-->
				<!--</div>-->
			<!--</div>-->

			<!-- Skills -->
			<div class="single-page-section">
				<h3><%=_lt.get('Payment options')%></h3>
				<div class="task-tags" v-html="paymentOptions">
				</div>
			</div>
			<div class="clearfix"></div>

			<!-- Freelancers Bidding -->
			<div class="boxed-list margin-bottom-60">
				<div class="boxed-list-headline">
					<h3><i class="icon-material-outline-group"></i><%=_lt.get('Reviews about this seller')%></h3>
				</div>
				<ul class="boxed-list-ul">
					<li v-for="(oneReview, index) in reviewsArr" v-bind:key="index">
						<div class="bid">
							<!-- Avatar -->
							<div class="bids-avatar">
								<div class="freelancer-avatar">

									<a href="single-freelancer-profile.html"><img :src="oneReview.reviewerAvatar ? '/images/users/' + oneReview.reviewerAvatar : '/images/user-avatar-placeholder.png'" alt=""></a>
								</div>
							</div>

							<!-- Content -->
							<div class="bids-content">
								<!-- Name -->
								<div class="freelancer-name">
									<h4 style="display: block">
										<a href="single-freelancer-profile.html">
											{{oneReview.reviewerName}} {{oneReview.reviewerSurname}}
											<img class="flag" v-bind:src="'/images/flags/'+ (oneReview.countriesCountryCode ? oneReview.countriesCountryCode.toLowerCase() + '.svg' : 'unknown.png' )" alt="" v-bind:title="oneReview.countriesCountryName" data-tippy-placement="top">
										</a>
									</h4>
									<template v-if="(oneReview.deals_offerId === offerObj.offerId)">
										<div class="verified-badge" style="margin-top: 5px;
									margin-bottom: 10px;" title="<%=_lt.get('Review about this offer!')%>"></div>
										<div class="someBadgeOffer"><%=_lt.get('Review from this offer!')%></div>
									</template>
									<div class="star-rating" v-bind:data-rating="oneReview.stars"></div> <br />{{oneReview.text}}
								</div>
							</div>

							<!-- Bid -->
							<div class="bids-bid">
								<div class="bid-rate">Spent:
									<div class="rate">{{oneReview.amountSpend}} {{oneReview.spendCurrencyShortCode}}</div>
									<span>in {{getDaysAgo(oneReview)}}</span>
								</div>
							</div>
						</div>
					</li>

				</ul>
			</div>

		</div>


		<!-- Sidebar -->
		<div class="col-xl-4 col-lg-4">
			<div class="sidebar-container">
				<div class="countdown green margin-bottom-35"><%=_lt.get('Published')%>{{whenWasPosted}}</div>

				<div class="sidebar-widget">
					<div class="bidding-widget">
						<div class="bidding-headline"><h3><%=_lt.get('Seller deposite:')%> {{offerObj.max_deposite}} {{sellingCurrency}}</h3></div>
						<div class="bidding-inner" v-if="this.userObj.id !== this.offerObj.user_id">
							<span class="bidding-detail"><%=_lt.get('You')%> <strong><%=_lt.get('must pay')%></strong></span>
							<div class="bidding-value">{{currency}} {{calculatedDealPrice}}</div>

							<!-- Headline -->
							<span class="bidding-detail margin-top-30"><%=_lt.get('Set')%> <strong><%=_lt.get('needed amount')%></strong> <%=_lt.get('in')%> {{sellingCurrency}} <%=_lt.get('and')%> <strong><%=_lt.get('deal time')%></strong></span>

							<!-- Fields -->
							<div class="bidding-fields">
								<div class="bidding-field">
									<!-- Quantity Buttons -->
									<div class="qtyButtons">
										<div class="qtyDec" v-on:click="decreaseDeal()"></div>
										<input type="text" name="qtyInput" v-model.number="neededAmount">
										<div class="qtyInc" v-on:click="increaseDeal()"></div>
									</div>
								</div>
								<div class="bidding-field" style="min-width: 100px">
									<select id="dealDate" class="selectpicker default selectApplyOffer">
										<option selected><%=_lt.get('Today')%></option>
										<option><%=_lt.get('Tomorrow')%></option>
									</select>
								</div>
								<div class="bidding-field margin-top-15" style="min-width: 100px; position:relative">
									<select required id="paymentOptions" v-model="choosedPaymentOption" class="default selectpicker" style="margin-right: 29px;">
										<option disabled value=""><%=_lt.get('Choose payment option')%></option>
										<option v-for="onePayment in paymentOptionsArr" v-bind:value="onePayment.id">{{onePayment.text}}</option>
									</select>
									<i id="caret" class="caret" style="position: absolute; top: 25px; right: 20px;"></i>
								</div>
							</div>

							<!-- Button -->
							<button v-on:click="initiateOrder()" id="snackbar-place-bid" class="button ripple-effect move-on-hover full-width margin-top-30"><span><%=_lt.get('Initiate a deal')%></span></button>

						</div>
						<div v-if="this.userObj.id !== this.offerObj.user_id" v-show="!userObj || !userObj.uHash" class="bidding-signup"><%=_lt.get('Do not have an account')%> <a href="#sign-in-dialog" class="register-tab sign-in popup-with-zoom-anim"><%=_lt.get('Sign Up or Login')%></a></div>
						<div v-if="this.userObj.id !== this.offerObj.user_id" v-show="userObj && userObj.uHash" class="bidding-signup submit-field">
							<a style="font-size: 16px; font-weight: 600; color: #333;"><%=_lt.get('Apply offer from user:')%> {{userObj.name}} {{userObj.surname}}</a>
							<br>
							<a href="#sign-in-dialog" class="register-tab sign-in popup-with-zoom-anim" style="font-weight: 400;"><%=_lt.get('Apply offer another user?')%></a>
						</div>
						<div v-else class="margin-top-22 text-align-center">
							<%=_lt.get('It your offer')%>
						</div>
					</div>
				</div>

				<!-- Sidebar Widget -->
				<div class="sidebar-widget">
					<h3><%=_lt.get('Bookmark or Share')%></h3>

					<!-- Bookmark Button -->
					<button class="bookmark-button margin-bottom-25" @click="setInBookmark" v-bind:class="{ bookmarked: bookmarks.includes(offerObj.offerId) }">
						<span class="bookmark-icon"  v-bind:class="{ bookmarked: bookmarks.includes(offerObj.offerId) }"></span>
						<span class="bookmark-text"><%=_lt.get('Bookmark')%></span>
						<span class="bookmarked-text"><%=_lt.get('Bookmarked')%></span>
					</button>

					<!-- Copy URL -->
					<div class="copy-url">
						<input id="copy-url" type="text" value="" class="with-border">
						<button class="copy-url-button ripple-effect" data-clipboard-target="#copy-url" title="<%=_lt.get('Copy to Clipboard')%>" data-tippy-placement="top"><i class="icon-material-outline-file-copy"></i></button>
					</div>

					<!-- Share Buttons -->
					<div class="share-buttons margin-top-25">
						<div class="share-buttons-trigger"><i class="icon-feather-share-2"></i></div>
						<div class="share-buttons-content">
							<span><%=_lt.get('Interesting?')%> <strong><%=_lt.get('Share It!')%></strong></span>
							<ul class="share-buttons-icons">
								<li><a  @click="shareIt('facebook')" data-button-color="#3b5998" title="<%=_lt.get('Share on')%> Facebook" data-tippy-placement="top"><i class="icon-brand-facebook-f"></i></a></li>
								<li><a  @click="shareIt('twitter')" data-button-color="#1da1f2" title="<%=_lt.get('Share on')%> Twitter" data-tippy-placement="top"><i class="icon-brand-twitter"></i></a></li>
								<li><a  @click="shareIt('plus')" data-button-color="#dd4b39" title="<%=_lt.get('Share on')%> Google Plus" data-tippy-placement="top"><i class="icon-brand-google-plus-g"></i></a></li>
								<li><a  @click="shareIt('linkedin')" data-button-color="#0077b5" title="<%=_lt.get('Share on')%> LinkedIn" data-tippy-placement="top"><i class="icon-brand-linkedin-in"></i></a></li>
							</ul>
						</div>
					</div>
				</div>

			</div>
		</div>

	</div>
</div>
    </div>
