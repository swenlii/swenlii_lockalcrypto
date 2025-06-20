<div class="dashboard-content-container" data-simplebar>
    <div class="dashboard-content-inner" style="min-height: 547px;">

        <!-- Row -->
        <div class="dashboard-headline">
            <h3 v-if="userObj"><%=_lt.get('Manage Offers')%></h3>
            <h3 v-else><%=_lt.get('To see offers login')%></h3>
        </div>

        <!-- Row -->
        <div class="row">

            <!-- Dashboard Box -->
            <div class="col-xl-12">
                <div class="dashboard-box margin-top-0">

                    <!-- Headline -->
                    <div class="headline" style="display: flex; justify-content: space-between">
                        <h3><i class="icon-material-outline-redo"></i> <%=_lt.get('Offers for Buy')%></h3>
                        <h5>{{this.yourchosen('wtb', true)}} <%=_lt.get('Offers')%></h5>
                    </div>

                    <div class="content">
                        <ul class="dashboard-box-list">
                            <li v-for="(offer, index) in this.offers" v-if="offer.offerType === 'wtb'">
                                <!-- Job Listing -->
                                <div class="job-listing width-adjustment">

                                    <!-- Job Listing Details -->
                                    <div class="job-listing-details">
                                        <div class="checkbox">
                                            <input type="checkbox" :id="'checkSell' + index" v-model="offer.isChoosen">
                                            <label :for="'checkSell' + index"><span class="checkbox-icon"></span></label>
                                        </div>

                                        <!-- Logo -->
                                        <a v-bind:href="'#apply-offer/'+offer.id" class="job-listing-company-logo">
                                            <img :src="'/images/c/' + offer.logo_path" alt="">
                                        </a>

                                        <!-- Details -->
                                        <div class="job-listing-description">

                                            <h3 class="job-listing-title"><a v-bind:href="'#apply-offer/'+offer.id">{{offer.short_title}}</a> <span v-if="offer.activated_date" class="verified-badge" title="Actively" data-tippy-placement="top"></span> </h3>

                                            <!-- Job Listing Footer -->
                                            <div class="job-listing-footer">
                                                <ul>
                                                    <li v-if="offer.name"><i class="icon-material-outline-monetization-on"></i>{{offer.name}}</li>
                                                    <li v-if="offer.englishName"><i class="icon-material-outline-location-on"></i> {{offer.englishName}}, {{offer.country_name}}</li>
                                                    <li v-if="offer.activated_date"><i class="icon-material-outline-access-time"></i> {{offer.activated_date}}</li>
                                                </ul>
                                            </div>

                                            <div>{{offer.description}}</div>

                                        </div>
                                    </div>
                                </div>

                                <!-- Task Details -->
                                <ul class="dashboard-task-info">
                                    <li><strong>{{offer.max_deposite}}</strong><span>{{offer.short_code}}</span></li>
                                    <li><strong>{{priceFormatted(offer).priceUp}}</strong><span>{{priceFormatted(offer).priceDown}}</span></li>
                                    <li><strong>{{offer.priceType === 'dynamic' ? priceFormatted(offer).percent: ''}}</strong><span>{{priceFormatted(offer).title}}</span></li>
                                </ul>



                                <!-- Buttons -->
                                <div class="buttons-to-right">
                                    <a @click = "editOffer(offer)" href="#edit-offer-dialog" class="popup-with-zoom-anim button dark ripple-effect ico" title="<%=_lt.get('Edit')%>" data-tippy-placement="top"><i class="icon-feather-edit"></i></a>
                                    <a href="#" @click="deleteOneOffer(offer.id, !offer.closedDeal)" class="button red ripple-effect ico" title="<%=_lt.get('Delete')%>" data-tippy-placement="top"><i class="icon-feather-trash-2"></i></a>
                                </div>

                            </li>

                        </ul>
                    </div>

                </div>
                <div style="margin-top: 35px; margin-bottom: 55px">
                    <div v-if="this.yourchosen('wtb', false)"><!-- keywords go here -->
                        <span class="button button-sliding-icon ripple-effect" v-on:click="showOnTV('wtb')"><%=_lt.get('Show on TV')%><i class="icon-material-outline-arrow-right-alt"></i></span>
                        <a @click="deleteOffers()" class="button ripple-effect ico" style="background-color: #dc3139; color: white" title="Delete Offer" data-tippy-placement="top"><i class="icon-feather-trash-2"></i>   <%=_lt.get('Delete')%></a>
                    </div>
                    <div id="link-wtb"  v-if="this.linkOnMonitor !== ''">
                        <h5><%=_lt.get('Here is your link to the monitor')%></h5>
                        <textarea v-model="this.linkOnMonitor" cols="30" rows="5" class="with-border"></textarea>
                    </div>
                </div>
            </div>

            <div class="col-xl-12">
                <div class="dashboard-box margin-top-0">

                    <!-- Headline -->
                    <div class="headline" style="display: flex; justify-content: space-between">
                        <h3><i class="icon-material-outline-undo"></i> <%=_lt.get('Offers for Sell')%></h3>
                        <h5>{{this.yourchosen('wts', true)}} <%=_lt.get('Offers')%></h5>
                    </div>

                    <div class="content">
                        <ul class="dashboard-box-list">
                            <li v-for="(offer, index) in this.offers" v-if="offer.offerType === 'wts'">
                                <!-- Job Listing -->
                                <div class="job-listing width-adjustment">

                                    <!-- Job Listing Details -->
                                    <div class="job-listing-details">
                                        <div class="checkbox">
                                            <input type="checkbox" :id="'checkSell' + index" v-model="offer.isChoosen">
                                            <label :for="'checkSell' + index"><span class="checkbox-icon"></span></label>
                                        </div>

                                        <!-- Logo -->
                                        <a v-bind:href="'#apply-offer/'+offer.id" class="job-listing-company-logo">
                                            <img :src="'/images/c/' + offer.logo_path" alt="">
                                        </a>

                                        <!-- Details -->
                                        <div class="job-listing-description">

                                            <h3 class="job-listing-title"><a v-bind:href="'#apply-offer/'+offer.id">{{offer.short_title}}</a> <span v-if="offer.activated_date" class="verified-badge" title="Actively" data-tippy-placement="top"></span> </h3>

                                            <!-- Job Listing Footer -->
                                            <div class="job-listing-footer">
                                                <ul>
                                                    <li v-if="offer.name"><i class="icon-material-outline-monetization-on"></i>{{offer.name}}</li>
                                                    <li v-if="offer.englishName"><i class="icon-material-outline-location-on"></i> {{offer.englishName}}, {{offer.country_name}}</li>
                                                    <li v-if="offer.activated_date"><i class="icon-material-outline-access-time"></i> {{offer.activated_date}}</li>
                                                </ul>
                                            </div>

                                            <div>{{offer.description}}</div>

                                        </div>
                                    </div>
                                </div>

                                <!-- Task Details -->
                                <ul class="dashboard-task-info">
                                    <li><strong>{{offer.max_deposite}}</strong><span>{{offer.short_code}}</span></li>
                                    <li><strong>{{priceFormatted(offer).priceUp}}</strong><span>{{priceFormatted(offer).priceDown}}</span></li>
                                    <li><strong>{{offer.priceType === 'dynamic' ? priceFormatted(offer).percent: ''}}</strong><span>{{priceFormatted(offer).title}}</span></li>
                                </ul>



                                <!-- Buttons -->
                                <div class="buttons-to-right">
                                    <a @click = "editOffer(offer)" href="#edit-offer-dialog" class="popup-with-zoom-anim button dark ripple-effect ico" title="<%=_lt.get('Edit')%>" data-tippy-placement="top"><i class="icon-feather-edit"></i></a>
                                    <a href="#" @click="deleteOneOffer(offer.id, !offer.closedDeal)" class="button red ripple-effect ico" title="<%=_lt.get('Delete')%>" data-tippy-placement="top"><i class="icon-feather-trash-2"></i></a>
                                </div>

                            </li>

                        </ul>
                    </div>

                </div>
                <div style="margin-top: 35px; margin-bottom: 55px">
                    <div v-if="this.yourchosen('wts', false)"><!-- keywords go here -->
                        <span class="button button-sliding-icon ripple-effect" v-on:click="showOnTV('wts')"><%=_lt.get('Show on TV')%><i class="icon-material-outline-arrow-right-alt"></i></span>
                        <a @click="deleteOffers()" class="button ripple-effect ico" style="background-color: #dc3139; color: white" title="Delete Offer" data-tippy-placement="top"><i class="icon-feather-trash-2"></i><%=_lt.get('Delete')%></a>
                    </div>
                    <div id="link-wts" v-if="this.yourchosen('wts', false) && this.linkOnMonitor !== ''">
                        <h5><%=_lt.get('Here is your link to the monitor')%></h5>
                        <textarea v-model="this.linkOnMonitor" cols="30" rows="5" class="with-border"></textarea>
                    </div>
                </div>
            </div>

            <div class="col-xl-12">
                <div class="dashboard-box margin-top-0">

                    <!-- Headline -->
                    <div class="headline" style="display: flex; justify-content: space-between">
                        <h3><i class="icon-feather-refresh-cw"></i> <%=_lt.get('Offers for Exchange')%></h3>
                        <h5>{{this.yourchosen('exch', true)}} <%=_lt.get('Offers')%></h5>
                    </div>

                    <div class="content">
                        <ul class="dashboard-box-list">
                            <li v-for="(offer, index) in this.offers" v-if="offer.offerType === 'exch'">
                                <!-- Job Listing -->
                                <div class="job-listing width-adjustment">

                                    <!-- Job Listing Details -->
                                    <div class="job-listing-details">
                                        <div class="checkbox">
                                            <input type="checkbox" :id="'checkSell' + index" v-model="offer.isChoosen">
                                            <label :for="'checkSell' + index"><span class="checkbox-icon"></span></label>
                                        </div>

                                        <!-- Logo -->
                                        <a v-bind:href="'#apply-offer/'+offer.id" class="job-listing-company-logo">
                                            <img :src="'/images/c/' + offer.logo_path" alt="">
                                        </a>

                                        <!-- Details -->
                                        <div class="job-listing-description">

                                            <h3 class="job-listing-title"><a v-bind:href="'#apply-offer/'+offer.id">{{offer.short_title}}</a> <span v-if="offer.activated_date" class="verified-badge" title="Actively" data-tippy-placement="top"></span> </h3>

                                            <!-- Job Listing Footer -->
                                            <div class="job-listing-footer">
                                                <ul>
                                                    <li v-if="offer.name"><i class="icon-material-outline-monetization-on"></i>{{offer.name}}</li>
                                                    <li v-if="offer.englishName"><i class="icon-material-outline-location-on"></i> {{offer.englishName}}, {{offer.country_name}}</li>
                                                    <li v-if="offer.activated_date"><i class="icon-material-outline-access-time"></i> {{offer.activated_date}}</li>
                                                </ul>
                                            </div>

                                            <div>{{offer.description}}</div>

                                        </div>
                                    </div>
                                </div>

                                <!-- Task Details -->
                                <ul class="dashboard-task-info">
                                    <li><strong>{{offer.max_deposite}}</strong><span>{{offer.short_code}}</span></li>
                                    <li><strong>{{priceFormatted(offer).priceUp}}</strong><span>{{priceFormatted(offer).priceDown}}</span></li>
                                    <li><strong>{{offer.priceType === 'dynamic' ? priceFormatted(offer).percent: ''}}</strong><span>{{priceFormatted(offer).title}}</span></li>
                                </ul>



                                <!-- Buttons -->
                                <div class="buttons-to-right">
                                    <a @click = "editOffer(offer)" href="#edit-offer-dialog" class="popup-with-zoom-anim button dark ripple-effect ico" title="<%=_lt.get('Edit')%>" data-tippy-placement="top"><i class="icon-feather-edit"></i></a>
                                    <a href="#" @click="deleteOneOffer(offer.id, !offer.closedDeal)" class="button red ripple-effect ico" title="<%=_lt.get('Delete')%>" data-tippy-placement="top"><i class="icon-feather-trash-2"></i></a>
                                </div>

                            </li>

                        </ul>
                    </div>

                </div>
                <div style="margin-top: 35px; margin-bottom: 55px">
                    <div v-if="this.yourchosen('exch', false)"><!-- keywords go here -->
                        <span class="button button-sliding-icon ripple-effect"  v-on:click="showOnTV('wte')"><%=_lt.get('Show on TV')%><i class="icon-material-outline-arrow-right-alt"></i></span>
                        <a @click="deleteOffers()" class="button ripple-effect ico" style="background-color: #dc3139; color: white" title="Delete Offer" data-tippy-placement="top"><i class="icon-feather-trash-2"></i><%=_lt.get('Delete')%></a>
                    </div>
                    <div id="link-wte"  v-if="this.yourchosen('exch', false) || this.linkOnMonitor">
                        <h5><%=_lt.get('Here is your link to the monitor')%></h5>
                        <textarea v-model="this.linkOnMonitor" cols="30" rows="5" class="with-border"></textarea>
                    </div>
                </div>
            </div>

            <div id="edit-offer-dialog" name="edit-offer-dialog" class="zoom-anim-dialog mfp-hide dialog-with-tabs">
                <div class="padding-top-20">
                    <h3 style="margin-bottom: 20px"><%=_lt.get('Edit offer')%></h3>
                    <form id="edit-offer-form" method="post" autocomplete="off" v-on:submit="changeOffer($event)">
                        <div class="inputErrorMessage invisible">
                            <h4><%=_lt.get('Email address not registered')%></h4>
                        </div>
                        <%=_lt.get('Title')%>
                        <input
                                id="title-offer"
                                type="text"
                                class="with-border"
                                :value="this.offerEdit.short_title"
                        >
                        <%=_lt.get('Description')%>
                        <textarea id="description-offer" cols="30" rows="5" class="with-border">{{offerEdit.description}}</textarea>
                        <%=_lt.get('Deposite')%>
                        <input
                                id="deposite-offer"
                                type="text"
                                class="with-border"
                                :value="this.offerEdit.max_deposite"
                        >
                        <div class="checkbox">
                            <input type="checkbox" id="can_buy_only_all" :checked="this.offerEdit.can_buy_only_all === '1'">
                            <label for="can_buy_only_all"><span class="checkbox-icon"></span> <%=_lt.get('Allow to sell less')%></label>
                        </div>
                        <div><%=_lt.get('Price')%></div>
                        <div v-show="(this.offerEdit.priceType === 'dynamic' && this.offerEdit.offerType !== 'exch')">
                            <div class="submit-field">
                                <select
                                        class="selectpicker with-border thisTry" data-size="7" id="dynamic-percent"
                                        v-model="this.dynamicPer"
                                >
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
                        <br>
                        <div style="margin-bottom: 12px" v-show="(this.offerEdit.priceType === 'fixed' || this.offerEdit.offerType === 'exch')">
                            <div class="input-with-icon red">
                                <input id="exchange_rate-offer" class="with-border red" type="text" placeholder="Only numbers" :value="this.offerEdit.exchange_rate">
                                <i class="currency">{{this.offerEdit.symbol}}</i>
                            </div>

                        </div>
                        <br>
                        <%=_lt.get('Payment options')%>
                        <br>
                        <div class="checkbox">
                            <input :checked="this.offerEdit.payments_bank === '1'" type="checkbox" id="paymentBankEdit" >
                            <label for="paymentBankEdit">
                                <span class="checkbox-icon"></span>
                                <%=_lt.get('Bank transfer')%>
                            </label>
                        </div>
                        <i class="help-icon margin-right-15">
                            <p class="tooltip-center"><%=_lt.get('Make a payment by bank trans')%></p>
                        </i>
                        <br>
                        <div class="checkbox">
                            <input :checked="this.offerEdit.payments_personal === '1'" type="checkbox" id="paymentMeetEdit" >
                            <label for="paymentMeetEdit">
                                <span class="checkbox-icon"></span>
                                <%=_lt.get('Personal meeting')%>
                            </label>
                        </div>
                        <i class="help-icon margin-right-15">
                            <p class="tooltip-left"><%=_lt.get('Make a payment at a personal')%></p>
                        </i>
                        <br>
                        <div class="checkbox">
                            <input :checked="this.offerEdit.payments_paypal_etc === '1'" type="checkbox" id="paymentDigitalEdit" >
                            <label for="paymentDigitalEdit">
                                <span class="checkbox-icon"></span>
                                <%=_lt.get('Paypal Stripe etc')%>
                            </label>
                        </div>
                        <i class="help-icon margin-right-15">
                            <p class="tooltip-left"><%=_lt.get('Make a payment via')%></p>
                        </i>
                        <div v-show="this.offerEdit.offerType === 'exch'" class="checkbox">
                            <input :checked="this.offerEdit.payments_internal === '1'" type="checkbox" id="paymentInternalEdit">
                            <label for="paymentInternalEdit">
                                <span class="checkbox-icon"></span>
                                <%=_lt.get('Internal transfers')%>
                            </label>
                        </div>

                        <i class="help-icon margin-right-15" v-show="this.offerEdit.offerType === 'exch'">
                            <p class="tooltip-left"><%=_lt.get('Up to 5 skills that')%></p>
                        </i>

                        <button
                                class="margin-top-20 button full-width button-sliding-icon ripple-effect"
                                type="submit"
                                form="edit-offer-form"
                        ><%=_lt.get('Change')%><i class="icon-material-outline-arrow-right-alt"></i>
                        </button>
                    </form>
                </div>

            </div>

        </div>
    </div>
</div>