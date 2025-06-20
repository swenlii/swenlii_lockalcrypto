<div>
<!-- Titlebar
================================================== -->
<div class="simplebar-scrollbar" style="visibility: visible; top: 0px; height: 263px;"></div><div class="simplebar-track horizontal" style="visibility: visible;"><div class="simplebar-scrollbar" style="visibility: visible; left: 0px; width: 25px;"></div></div><div class="simplebar-scroll-content" style="padding-right: 15px; margin-bottom: -30px;"><div class="simplebar-content" style="padding-bottom: 15px; margin-right: -15px;">
	<div class="dashboard-content-inner" style="min-height: 547px;">
		<div class="dashboard-headline">
		<!-- Hedaline -->
			<h3 v-if="userObj"><%=_lt.get("Your comissions")%></h3>
			<h3 v-else><%=_lt.get("To see your comission login")%></h3>
		</div>
	<div class=" container">
	<div v-if="userObj" class="row">
		<div class="col-xl-8 col-lg-8 content-right-offset">
			
		<!-- Summary -->
		<div class="boxed-widget summary margin-top-30">
			<div class="boxed-widget-headline">
				<h3 class="commissionL"><%=_lt.get("Summary")%></h3>
				<p class="commissionR"><%=_lt.get("Commision 1%")%><span class="rateOk"><%=_lt.get("by CoinGecko actual")%></span></p>
			</div>
			<div class="boxed-widget-inner">
				<ul>
					<li class="margin-bottom-7" v-for="(oneDeal, key) in successDeals" v-bind:key="key" v-bind:class="getDealClass(oneDeal)">
						<%=_lt.get("Deal id")%> {{oneDeal.dealId}} <%=_lt.get("with")%> {{oneDeal.buyerName}} {{oneDeal.buyerSurname}}, {{oneDeal.amountNeeded}} {{oneDeal.sellingCurrencyObj.name}}
						-> {{oneDeal.amountSpend}} {{oneDeal.buyingCurrencyObj.short_code}}
						<span>{{((oneDeal.amountNeeded*oneDeal.sellingCurrencyObj.rateToEur)/100).trimNum(2)}} EUR</span>
					</li>
					<li v-if="paymentMethod === 'pltc'"><%=_lt.get("Discount for payment")%> <span>15%</span></li>
					<li class="total-costs"><%=_lt.get("Final Comission")%> <span><template v-if="isWaitingPayments()"><s>{{getFinalComission(true)}} EUR</s>, </template>{{getFinalComission()}} EUR</span></li>
				</ul>
			</div>
		</div>
		<!-- Summary / End -->
			<transition
					   name="custom-classes-transition"
					   enter-active-class="animated fadeInLeft"
					   leave-active-class="animated fadeOutLeft"
					 >
	<div v-if="coinBaseSecondStep === false && pltcSecondStep === false">
			<h3 class="margin-top-50"><%=_lt.get("Payment methods")%></h3>

			<!-- Payment Methods Accordion -->
			<div class="payment margin-top-30">

				<div class="payment-tab payment-tab-active">
					<div class="payment-tab-trigger">
						<input checked id="paypal" name="cardType" type="radio" value="coinbase" v-model="paymentMethod">
						<label for="paypal">BitCoin, Ethereum, BitCoin Cash, LiteCoin, USD Coin</label>
						<img class="payment-logo paypal" src="/images/logoCoinbase.png" alt="">
					</div>

					<div class="payment-tab-content">
						<p><%=_lt.get("You will be redirected")%></p>
					</div>
				</div>


				<div class="payment-tab">
					<div class="payment-tab-trigger">
						<input type="radio" name="cardType" id="creditCart" value="PlatonCoin" v-model="paymentMethod">
						<label for="creditCart">PlatonCoin (10% discount, <s>{{this.getFinalComission()}}EUR</s> {{(this.getFinalComission()*0.9).trimNum(4)}}EUR), 0.23EUR : 1PLTC</label>
						<img class="payment-logo" src="/images/c/platoncoin.png" alt="">
					</div>

					<div class="payment-tab-content">
						<p><%=_lt.get("Pay at")%> <strong>0x0714Fc7861c3038cBff1e1618b21e06A86b268Bb</strong> <br /><%=_lt.get("the discounted amount")%> {{getFinalComissionInPltc()}} <%=_lt.get("PLTC. Then..")%></p>

						<div class="row payment-form-row">

							<div class="col-md-10">
								<div class="card-label">
									<input id="txHash" v-model="txHash" name="txHash" required type="text" placeholder="<%=_lt.get('Transaction hash')%>">
								</div>
							</div>

							<div class="col-md-10">
								<div class="card-label">
									<input id="walletAddr" v-model="walletPaidFrom" name="walletAddr" placeholder="<%=_lt.get('Optional, address')%>" type="text">
								</div>
							</div>



						</div>
					</div>
				</div>
                <!-- Checkbox -->

			</div>
			<!-- Payment Methods Accordion / End -->

            <div class="checkbox margin-top-30">
         				<input type="checkbox" id="two-step" v-model="agreementPayments">
         				<label for="two-step"><span class="checkbox-icon"></span>  <%=_lt.get("You agree")%></label>
         			</div>
            <Br />
			<a href="#" v-on:click.prevent="sealPayment()" class="button big ripple-effect margin-top-40 margin-bottom-65"><%=_lt.get("Initialize Payment")%></a>
	</div>
			</transition>

			<transition
					   name="custom-classes-transition"
					   enter-active-class="animated bounceInRight"
					   leave-active-class="animated zoomOutLeft"
					 >
			<div class="checkbox margin-top-30" v-if="coinBaseSecondStep === true">
				<div><%=_lt.get("Now you go coinbase")%></div>
				<a style="margin-top: 20px !important;" id="coinbaseGo" target="_blank" v-bind:href="'https://commerce.coinbase.com/checkout/'+vsCoinBase" class="button big ripple-effect margin-top-40 margin-bottom-65 greenButton"><%=_lt.get("Go to coinbase")%></a>

			</div>
			</transition>

			<transition
					   name="custom-classes-transition"
					   enter-active-class="animated bounceInRight"
					   leave-active-class="animated zoomOutLeft"
					 >
			<div class="checkbox margin-top-30" v-if="pltcSecondStep === true">
				<div style="margin-bottom: 90px;"><%=_lt.get("Every 5 seconds")%></div>
			</div>
			</transition>

		</div>



		<div class="col-xl-4 col-lg-4 margin-top-0 margin-bottom-60">
			<div class="section-headline border-top padding-top-45 margin-bottom-25">
								<h4><%=_lt.get("Last payments")%></h4>
							</div>

								<div class="numbered">
									<ol>
										<transition-group
												   name="custom-classes-transition"
												   enter-active-class="animated fadeInDownBig"
												   leave-active-class="animated zoomOutLeft"
												 >
											<li class="relativeLi" v-for="onePayment in lastPayments" v-bind:key="onePayment.id">
												<span class="dateTimeSm">{{onePayment.weInitiatedF}}</span>
												     <%=_lt.get("Payment in the amount of")%> {{onePayment.amount}} {{getCurrencyInfoPaidComission(onePayment)}} <%=_lt.get("through")%> {{onePayment.paymentMethod}}.
												<template v-if="onePayment.paymentMethod === 'coinbase'">
													<span v-bind:class="getPaymentCssClass(onePayment)">
														{{showPaymentStatusCoinbase(onePayment)}}
														<a v-if="!onePayment.paid && !onePayment.coinbaseExpired" v-bind:href="'https://commerce.coinbase.com/checkout/'+onePayment.coinbaseiD" target="_blank"><%=_lt.get("Lost payment link?")%></a>
													</span>
												</template>
												<template v-else>
													<span v-bind:class="getPaymentCssClassPltc(onePayment)">{{showPaymentStatusPltc(onePayment)}}</span>
												</template>
											</li>
										</transition-group>
									</ol>
								</div>



		</div>

	</div>

</div>

	</div>
		<!-- Summary -->
</div>

</div>
</div>