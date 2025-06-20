<div>
<div class="simplebar-scrollbar" style="visibility: visible; top: 0px; height: 263px;"></div><div class="simplebar-track horizontal" style="visibility: visible;"><div class="simplebar-scrollbar" style="visibility: visible; left: 0px; width: 25px;"></div></div><div class="simplebar-scroll-content" style="padding-right: 15px; margin-bottom: -30px;"><div class="simplebar-content" style="padding-bottom: 15px; margin-right: -15px;">
		<div class="dashboard-content-inner" style="min-height: 547px;">

			<!-- Dashboard Headline -->
			<div class="dashboard-headline">
				<h3 v-if="userObj"><%=_lt.get('Your deals')%>"</h3>
				<h3 v-else><%=_lt.get('To see deals login.')%></h3>


				<!-- Breadcrumbs -->

			</div>

				<div class="messages-container margin-top-0" v-if="userObj">

					<div class="messages-container-inner">

						<!-- Messages -->
						<div class="messages-inbox">
							<ul>
								<li v-bind:class="{leftLineInDeal: (choosedDeal && oneDeal.id === choosedDeal.id), dealNotViewedByOwner: dealNotifications.includes(oneDeal.id)}" v-for="oneDeal in userDeals" :key="oneDeal.id" >
									<a href="" v-on:click.prevent="setDealObj(oneDeal)">
										<div class="message-avatar"><i class="status-icon status-online"></i><img :src="'images/' + (oneDeal.buyerAvatar ? ('users/' + oneDeal.buyerAvatar) : 'user-avatar-placeholder.png')" alt=""></div>

										<div class="message-by">
											<div class="message-by-headline">
												<h5><%=_lt.get('Deal id')%> {{oneDeal.dealId}} <%=_lt.get('with')%> {{oneDeal.buyerName}} {{oneDeal.buyerSurname}} <%=_lt.get('on')%> {{oneDeal.amountNeeded}} {{oneDeal.sellingCurrencyObj.short_code}} ({{oneDeal.buyerName}} <%=_lt.get('spend')%> {{oneDeal.amountSpend}} {{oneDeal.buyingCurrencyObj.short_code}})</h5>

											</div>
											<p>
												<span><%=_lt.get('Started time:')%> {{oneDeal.generatedDateF}}. <br />
												<%=_lt.get('Is active:')%> <strong v-bind:class="(oneDeal.paidDate || oneDeal.closedDeal === 1)? 'dealIsInActive':'dealIsActive'">{{(oneDeal.paidDate  || oneDeal.closedDeal === 1)? "<%=_lt.get('No.')%>":"<%=_lt.get('Yes.')%>"}}</strong>
												</span>
												<span v-if="oneDeal.paidDate" class="successColor" style="font-size: 11px;"><%=_lt.get('Paid:')%> {{oneDeal.paidDateF}}</span>
											</p>
										</div>
									</a>
								</li>

							</ul>
						</div>
						<!-- Messages / End -->

						<!-- Message Content -->
						<div class="message-content">

							<div class="messages-headline goCenter">
								<template v-if="choosedDeal !== null">
								<h4>{{choosedDeal.buyerId === userObj.id ? 'You' : choosedDeal.buyerName + ' ' + choosedDeal.buyerSurname}}  <%=_lt.get('buying')%> {{choosedDeal.amountNeeded}} {{choosedDeal.sellingCurrencyObj.short_code}} {{choosedDeal.buyerId === userObj.id ? 'from ' + choosedDeal.buyerName + ' ' + choosedDeal.buyerSurname + ' for' : 'from you for'}} {{choosedDeal.amountSpend}} {{choosedDeal.buyingCurrencyObj.short_code}}</h4>
									<h4 style="display: block"><%=_lt.get('Rate')%>: {{(choosedDeal.sPriceType === 'fixed') ? "<%=_lt.get('Fixed')%>" : "<%=_lt.get('Dynamic')%>"}} 1 {{choosedDeal.sellingCurrencyObj.short_code}} : <span id="priceOne">{{(choosedDeal.sPriceType === 'fixed') ? choosedDeal.sExchangeRate : dynamicExchangeRate}} {{choosedDeal.buyingCurrencyObj.short_code}}</span> </h4>
								<a href="#" class="message-action" style="display: none;"><i class="icon-feather-trash-2"></i> <%=_lt.get('Delete Conversation')%></a>
								</template>
								<template v-else>
									<h4><%=_lt.get('Please, choose deal')%></h4>
								</template>
							</div>

							<!-- Message Content Inner -->
							<div class="message-content-inner" v-if="reviewObj.isOpen === false">

<!--									&lt;!&ndash; Time Sign &ndash;&gt;-->
<!--									<div class="message-time-sign">-->
<!--										<span>28 June, 2018</span>-->
<!--									</div>-->

									<div class="message-bubble" v-bind:class="(oneMessage.userId === userObj.id) ? 'me' : ''" v-for="(oneMessage, index) in messagesArr" v-bind:key="index">
										<div class="message-bubble-inner">
											<div class="message-avatar"><img :src="oneMessage.avatarPath ? ('/images/users/' + oneMessage.avatarPath) : '/images/user-avatar-placeholder.png'" alt=""></div>
											<div class="message-text"><p>{{oneMessage.message}}</p></div>
										</div>
										<div class="clearfix"></div>
									</div>




									<!-- Time Sign -->
									<div class="message-time-sign" v-if="messagesArr.length <= 0 && choosedDeal">
										<span><%=_lt.get('No messages yet')%></span>
									</div>


							</div>
							<div v-else style="position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; z-index: 999">
							<div  id="small-dialog-2" style="position: absolute" class="zoom-anim-dialog dialog-with-tabs">

											<!--Tabs -->
											<div class="sign-in-form">

												<ul class="popup-tabs-nav" style="pointer-events: none;">
												</ul>

												<div class="popup-tabs-container">

													<!-- Tab -->
													<div class="popup-tab-content" id="tab2" style="">

														<!-- Welcome Text -->
														<div class="welcome-text">
															<h3><%=_lt.get('Leave a Review')%></h3>
															<span><%=_lt.get('Rate')%> <a href="#">{{choosedDeal.buyerName}} {{choosedDeal.buyerSurname}}</a> <%=_lt.get('for the deal id')%> {{choosedDeal.id}} ({{choosedDeal.amountNeeded}} {{choosedDeal.sellingCurrencyObj.short_code}} <%=_lt.get('for')%> {{choosedDeal.amountSpend}} {{choosedDeal.buyingCurrencyObj.short_code}})</span>
														</div>

														<!-- Form -->

<!--															<div class="feedback-yes-no">-->
<!--																<strong>Was this delivered on budget?</strong>-->
<!--																<div class="radio">-->
<!--																	<input id="radio-1" name="radio" type="radio" required="">-->
<!--																	<label for="radio-1"><span class="radio-label"></span> Yes</label>-->
<!--																</div>-->

<!--																<div class="radio">-->
<!--																	<input id="radio-2" name="radio" type="radio" required="">-->
<!--																	<label for="radio-2"><span class="radio-label"></span> No</label>-->
<!--																</div>-->
<!--															</div>-->

<!--															<div class="feedback-yes-no">-->
<!--																<strong>Was this delivered on time?</strong>-->
<!--																<div class="radio">-->
<!--																	<input id="radio-3" name="radio2" type="radio" required="">-->
<!--																	<label for="radio-3"><span class="radio-label"></span> Yes</label>-->
<!--																</div>-->

<!--																<div class="radio">-->
<!--																	<input id="radio-4" name="radio2" type="radio" required="">-->
<!--																	<label for="radio-4"><span class="radio-label"></span> No</label>-->
<!--																</div>-->
<!--															</div>-->

															<div class="feedback-yes-no">
																<strong><%=_lt.get('You rate')%> {{choosedDeal.buyerName}} {{choosedDeal.buyerSurname}} (<%=_lt.get('from 1 to 10')%>)</strong>
																<div class="leave-rating">




																	<input type="radio" name="rating" id="rating-radio-10" value="10" required="" v-model.number="reviewObj.stars">
																																		<label for="rating-radio-10" class="icon-material-outline-star"></label>

																	<input type="radio" name="rating" id="rating-radio-9" value="9" required="" v-model.number="reviewObj.stars">
																																																		<label for="rating-radio-9" class="icon-material-outline-star"></label>


																	<input type="radio" name="rating" id="rating-radio-8" value="8" required="" v-model.number="reviewObj.stars">
																																		<label for="rating-radio-8" class="icon-material-outline-star"></label>



																	<input type="radio" name="rating" id="rating-radio-7" value="7" required="" v-model.number="reviewObj.stars">
																																																		<label for="rating-radio-7" class="icon-material-outline-star"></label>


																	<input type="radio" name="rating" id="rating-radio-6" value="6" required="" v-model.number="reviewObj.stars">
																																																		<label for="rating-radio-6" class="icon-material-outline-star"></label>

																	<input type="radio" name="rating" id="rating-radio-5" value="5" required="" v-model.number="reviewObj.stars">
																	<label for="rating-radio-5" class="icon-material-outline-star"></label>


																	<input type="radio" name="rating" id="rating-radio-4" value="4" required="" v-model.number="reviewObj.stars">
																	<label for="rating-radio-4" class="icon-material-outline-star"></label>

																	<input type="radio" name="rating" id="rating-radio-3" value="3" required="" v-model.number="reviewObj.stars">
																																<label for="rating-radio-3" class="icon-material-outline-star"></label>

																	<input type="radio" name="rating" id="rating-radio-2" value="2" required="" v-model.number="reviewObj.stars">
																																	<label for="rating-radio-2" class="icon-material-outline-star"></label>


																	<input type="radio" name="rating" id="rating-radio-1" value="1" required="" v-model.number="reviewObj.stars">
																	<label for="rating-radio-1" class="icon-material-outline-star"></label>









																</div><div class="clearfix"></div>
															</div>

															<textarea v-model="reviewObj.comment" class="with-border" placeholder="<%=_lt.get('Comment')%>" name="message2" id="message2" cols="7" required=""></textarea>


														<!-- Button -->
														<button class="button full-width button-sliding-icon ripple-effect" v-on:click="submitReview()" ><%=_lt.get('Leave a Review')%> <i class="icon-material-outline-arrow-right-alt"></i></button>

													</div>

												</div>
											</div>
								<button title="<%=_lt.get('Close (Esc)')%>" type="button" class="mfp-close" v-on:click="reviewObj.isOpen = false"></button>
										</div>
							</div><!-- Message Content Inner / End -->

							<!-- Reply Area -->
							<div class="message-reply" v-if="(choosedDeal && choosedDeal.id && choosedDeal.closedDeal !== 1 && !choosedDeal.paidDate)">
								<textarea v-on:keyup.enter.exact="sendMessage()" cols="1" rows="1" placeholder="<%=_lt.get('Your Message')%>" v-model="actualText"></textarea>
								<button class="button ripple-effect" v-on:click="sendMessage()"><%=_lt.get('Send message')%></button>

							</div>
							<div class="m1" v-if="choosedDeal !== null">
								<button v-if="(!choosedDeal.paidDate && choosedDeal.closedDeal === 0)" class="button m3" v-on:click="cancelDeal()"><%=_lt.get('Cancel deal')%></button>
								<button v-if="(!choosedDeal.paidDate && choosedDeal.closedDeal === 0)" class="button ripple-effect" v-on:click="setDealAsComplete()"><%=_lt.get('Set as complete')%></button>
								<span v-if="(!choosedDeal.paidDate && choosedDeal.closedDeal === 1)" class="ripple-effect infoText"><%=_lt.get('Deal was canceled by')%> {{choosedDeal.closedByWhoRole}}.</span>
								<span v-if="(choosedDeal.paidDate)" class="ripple-effect infoTextSuccess"><%=_lt.get('Deal was paid:')%> {{choosedDeal.paidDateF}}.</span>
								<span v-if="(choosedDeal.reviewComment && choosedDeal.reviewComment.length > 0)"><br /><%=_lt.get('You rated:')%> {{choosedDeal.reviewComment}}</span>

<div style="display: block; margin-top: 20px">&nbsp;</div>
								<a v-bind:href="'mailto:support@localcrypto.cloud?subject=Problem%20with%20deal%20id%20'+choosedDeal.id+'%20from%20user%20'+userObj.id+'&body=Describe-the-problem-in-detail.'" class="button ripple-effect m3"><%=_lt.get('Report a problem')%></a>
								<a href="" v-if="((choosedDeal.paidDate || choosedDeal.closedDeal === 1) && userObj.id !== choosedDeal.authorId)" v-on:click.prevent="writeReview($event)" class="button ripple-effect-dark margin-top-20"><%=_lt.get('Write a review')%></a>
							</div>

						</div>
						<!-- Message Content -->

					</div>
				</div>
			<!-- Messages Container / End -->





			<!-- Footer -->
			<div class="dashboard-footer-spacer" style="padding-top: 125px;"></div>
			<!-- Footer / End -->

		</div>
	</div>
</div>
</div>
