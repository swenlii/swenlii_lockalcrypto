<div>
    <div class="simplebar-scrollbar" style="visibility: visible; top: 0px; height: 263px;"></div><div class="simplebar-track horizontal" style="visibility: visible;"><div class="simplebar-scrollbar" style="visibility: visible; left: 0px; width: 25px;"></div></div><div class="simplebar-scroll-content" style="padding-right: 15px; margin-bottom: -30px;"><div class="simplebar-content" style="padding-bottom: 15px; margin-right: -15px;">
    <div class="dashboard-content-inner" style="min-height: 547px;">

        <div v-if="userObj" class="row">
            <div class="col-1"></div>
            <div class="col-10">
                <div class="dashboard-headline margin-bottom-30">
                    <h3 v-if="userObj"><%=_lt.get('Your Offers')%></h3>
                    <h3 v-else><%=_lt.get('To see offers login')%></h3>
                </div>
                <div v-bind:key="offer.id" v-for="(offer, index) in offersArr" class="margin-bottom-30 offer-card">
                    <div class="row margin-top-10">
                            <div class="col d-flex margin-left-20 cancel-transform">
                                    <div class="job-listing-company-logo offer-info">
                                        <a v-bind:href="'#apply-offer/'+offer.id"><img :src="'/images/c/' + offer.logo_path" v-bind:alt="offer.logo_path"></a>
                                    </div>
                                    <div class="job-listing-description margin-top-20 margin-left-20">
                                        <h3 class="job-listing-company"><a v-bind:href="'#apply-offer/'+offer.id">{{offer.short_title}}</a>
                                            <span class="verified-badge" data-tippy-placement="top" data-tippy="" data-original-title="<%=_lt.get('Verified Employer')%>" v-if="offer.approve_status"></span>
                                        </h3>
                                        <h4 class="job-listing-title"><span class="description-text">{{offer.description}}</span></h4>
                                    </div>
                            </div>
                            <div class="col user-offers-inputs align-items-center margin-top-5 margin-left-20 margin-right-20">
                                    <div class="">
                                        <div class="input-with-icon d-block margin-top-15" style="min-width: 150px">
                                            <input v-bind:id="'deposit'+offer.id"
                                                   v-bind:value="offer.max_deposite"
                                                   type="text"
                                                   placeholder="<%=_lt.get('Change my deposite:')%>"
                                                   v-on:keypress="typeSymbol($event)">
                                            <i class="currency">{{offer.short_code}}</i>
                                        </div>
                                    </div>
                                <div class="user-offers-buttons">
                                    <div style="flex:1;" class="margin-right-10" :class="{'custom-title': offer.closedDeal === 0}" data-title="<%=_lt.get('Impossible to change amount')%>">
                                        <button
                                                class="user-offers-button-send button big bg-primary text-white ripple-effect-dark button-text"
                                                v-on:click="saveNewDeposit(index, offer.id)"
                                                :class="{'block': offer.closedDeal === 0}">Save</button>
                                    </div>
                                    <div>
                                        <button v-on:click="offer.sharing = !offer.sharing"
                                                class="big white-button">
                                            <i class="icon-feather-share-2"></i>
                                            <div v-if="offer.sharing">
                                                <social-sharing :url="pathName+'#apply-offer/'+offer.id"
                                                                :title="offer.short_title"
                                                                :description="offer.description"
                                                                class="position-absolute"
                                                                inline-template>
                                                    <div
                                                            class="share-box-item box-shadow text-align-left font-color-a0a0a0 white-bordered-box font-16 text-align-left">
                                                        <network network="email">
                                                            <i class="icon-material-outline-email"></i>&nbsp;<%=_lt.get('Email')%>
                                                        </network>
                                                        <network network="sms">
                                                            <i class="icon-material-outline-textsms"></i>&nbsp;<%=_lt.get('SMS')%>
                                                        </network>
                                                        <network network="telegram">
                                                            <i class="icon-brand-telegram-plane"></i>&nbsp;Telegram
                                                        </network>
                                                        <network network="whatsapp">
                                                            <i class="icon-brand-whatsapp"></i>&nbsp;Whatsapp
                                                        </network>
                                                    </div>
                                                </social-sharing>
                                            </div>
                                        </button>
                                    </div>
                                    <div class="margin-left-10" :class="{'custom-title': offer.closedDeal === 0}" data-title="<%=_lt.get('Removal is not possible')%>">
                                        <button
                                                class="big white-button"
                                                :class="{'blocked-white-button': offer.closedDeal === 0}"><i class="icon-line-awesome-trash-o"
                                                @click="deleteOffer(offer.id, offer.closedDeal)"></i></button>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <hr class="hr-style">
                    <div class="row">
                        <div class="col user-offers-date justify-content-between margin-bottom-5 margin-left-40 margin-right-40">
                            <div>
                                <span v-if="offer.name">
                                <i class="icon-material-outline-monetization-on"></i>
                                &nbsp;{{offer.name}}&nbsp;&nbsp;
                                </span>
                                    <span  v-if="offer.englishName && offer.country_name">
                                    <i class="icon-material-outline-location-on"></i>&nbsp;{{offer.englishName}},&nbsp;{{offer.country_name}}&nbsp;&nbsp;
                                </span>
                                    <span v-if="offer.englishName && !offer.country_name">
                                    <i class="icon-material-outline-location-on"></i>&nbsp;{{offer.englishName}}&nbsp;&nbsp;
                                </span>
                                    <span v-if="!offer.englishName && offer.country_name">
                                    <i class="icon-material-outline-location-on"></i>&nbsp;{{offer.country_name}}&nbsp;&nbsp;
                                </span>
                            </div>
                            <div>
                                <span v-if="offer.activated_date">{{moment(offer.activated_date).format('hh:mm') }} </span>&nbsp;&nbsp;
                                <span v-if="offer.activated_date">{{moment(offer.activated_date).subtract(0, 'days').calendar()}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-1"></div>
        </div>
</div>
</div>
</div>
</div>