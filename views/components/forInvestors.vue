<div class="row">
    <div class="col div-align-horizontal-center max-width-66 margin-top-50 margin-bottom-70">
        <div class="row investor-slick box-shadow margin-bottom-40">
            <div class="d-flex flex-row" style="width: 100%;">
                <div class="width-50">
                    <img src="/images/girlWithCoin.jpg" alt="woman" class="investor-img">
                </div>
                <div class="width-50 div-align-center">
                    <div class="width-60">
                        <div class="font-color-2b44e9 font-72 font-weight-700 text-align-center line-height-1">
                            <span><%=_lt.get('GET 50%')%></span>
                        </div>
                        <div class="margin-top-50 margin-bottom-20">
                            <hr class="investor-headers">
                        </div>
                        <div class="text-align-center font-36 font-color-333 line-height-15">
                            <%=_lt.get('From income transaction')%>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row width-83 text-align-center font-weight-200 margin-0-auto margin-bottom-40 font-36 line-height-15" style="margin-top: 65px;">
            <span style="text-align: center; width: 100%;"><%=_lt.get('Choose your CityCoin')%> <strong><%=_lt.get('dividend payee period')%></strong> <%=_lt.get('of owning.')%></span>

        </div>
        <div class="row flex-row justify-content-between margin-bottom-40 spacing">
            <div class="width-31 white-bordered-box box-shadow border-bottom-blue min-height-360">
                <div class="font-24 text-align-center padding-18-5 line-height-15 font-color-333">
                    <img src="/images/investors/cardImage.svg" alt="be investor">
                    <div><%=_lt.get('Opportunity to buy sell')%> <br> <%=_lt.get('directly from our platform')%></div>
                </div>
            </div>
            <div class="width-31 white-bordered-box box-shadow border-bottom-blue min-height-360">
                <div class="font-24 text-align-center padding-18-5 line-height-15 font-color-333">
                    <img src="/images/mainEx.png" alt="buy coins">
                    <div><%=_lt.get('Hand over the job')%><br><%=_lt.get('to the professionals')%></div>
                </div>
            </div>
            <div class="width-31 white-bordered-box box-shadow border-bottom-blue min-height-360">
                <div class="font-24 text-align-center padding-18-5 line-height-15 font-color-333">
                    <img src="/images/peopleEx.png" alt="earn money">
                    <div><%=_lt.get('Thousands')%><br><%=_lt.get('of views daily')%></div>
                </div>
            </div>
        </div>


    <!--Market-->
        <div class="row margin-bottom-40">
            <div class="col">
                <div class="row margin-bottom-30">
                    <h1 class="font-36 font-weight-600"><%=_lt.get('Market')%></h1>
                </div>
                <div class="row">
                    <div class="col spacing d-flex justify-content-between">
                        <div class="width-653 white-bordered-box box-shadow">
                            <div class="row margin-left-0">
                                <div class="col padding-right-0">
                                    <div v-on:click="indexActivity === index ? indexActivity = -1 : indexActivity = index" v-for="(coin, index) in coinsToSell.slice(0,coinsToSell.length/2)"
                                         :class="{
                                         'investor-market-list-item-colored': index % 2 ===0,
                                         'investor-market-list-item': index % 2 ===1,
                                         'investor-market-list-item-color': index % 2 ===0}" class="investor-market-list-hover-item investor-market-coin-marker row margin-right-0 padding-bottom-15 padding-top-30">

                                        <div class="col" >
                                            <div class="row">
                                                <div class="custom-check col-8 d-flex padding-bottom-10">
                                                    <div class="checkbox">
                                                        <input type="checkbox" :id="index" v-model="coin.isChoosen">
                                                        <label :for="index"><span class="checkbox-icon"></span></label>
                                                    </div>

                                                    <div class="investor-market-coin-image">
                                                        <img src="/images/coinTemplate1.png" width="60px" alt="coin">
                                                    </div>
                                                    <div style="margin-left: 20px;">
                                                        <div  class="investor-market-flag-image">
                                                                                                            <img v-bind:src="'./images/flags/' + coin.country_code + '.svg'" width="20px" alt="coin">
                                                                                                        </div>
                                                        <h4 class="font-20" style="cursor: pointer">{{coin.name}}</h4></div>

                                                </div>
                                                <div class="col-4 padding-right-30" style="position: absolute; right: 10px;"><h3 class="font-weight-600 text-align-right" style="font-size: 20px">{{coin.price}} {{coin.currency === 'usd' ? '$' : '€'}}</h3></div>
                                            </div>
                                            <div class="row" v-if="indexActivity===index">
                                                <div class="div-align-horizontal-center">
                                                    <h5 class="font-16"><span class="font-weight-800"><i class="icon-material-outline-language"></i> <%=_lt.get('Population:')%></span> <span>{{coin.population}}</span></h5>
                                                    <h5 class="font-16"><span class="font-weight-800"><i class="icon-material-outline-language"></i> <%=_lt.get('Agglomeration:')%></span> <span>{{coin.aglomeration}}</span></h5>
                                                    <h5 class="font-16"><span class="font-weight-800"><i class="icon-material-outline-language"></i> <%=_lt.get('Basic income this country:')%></span> <span>{{coin.basicIncome}}{{coin.currency === 'usd' ? '$' : '€'}}</span></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col border-left-gray">
                                    <div v-on:click="indexActivity === index + 'ColumnTwo' ? indexActivity = -1 : indexActivity = index + 'ColumnTwo'" v-for="(coin, index) in coinsToSell.slice(coinsToSell.length/2)"
                                         :class="{
                                         'investor-market-list-item-colored': index % 2 ===0,
                                         'investor-market-list-item': index % 2 ===1,
                                         'investor-market-list-item-color': index % 2 ===0}" class="investor-market-list-hover-item investor-market-coin-marker row padding-top-30 padding-bottom-15 margin-right-0">
                                        <div class="col">
                                            <div class="row">
                                                <div class="custom-check col-8 d-flex padding-bottom-10">
                                                    <div class="checkbox">
                                                        <input type="checkbox" :id="index" v-model="coin.isChoosen">
                                                        <label :for="index"><span class="checkbox-icon"></span></label>
                                                    </div>

                                                    <div class="investor-market-coin-image">
                                                        <img src="/images/coinTemplate1.png" width="60px" alt="coin">
                                                    </div>
                                                    <div style="margin-left: 20px;">
                                                        <div  class="investor-market-flag-image">
                                                                                                            <img v-bind:src="'./images/flags/' + coin.country_code + '.svg'" width="20px" alt="coin">
                                                                                                        </div>
                                                        <h4 class="font-20" style="cursor: pointer">{{coin.name}}</h4></div>

                                                </div>
                                                <div class="col-4 padding-right-30" style="position: absolute; right: 10px;"><h3 class="font-weight-600 text-align-right" style="font-size: 20px">{{coin.price}} {{coin.currency === 'usd' ? '$' : '€'}}</h3></div>
                                            </div>
                                            <div class="row" v-if="indexActivity===index + 'ColumnTwo'">
                                                <div class="div-align-horizontal-center">
                                                    <h5 class="font-16"><span class="font-weight-800"><i class="icon-material-outline-language"></i> <%=_lt.get('Population:')%></span> <span>{{coin.population}}</span></h5>
                                                    <h5 class="font-16"><span class="font-weight-800"><i class="icon-material-outline-language"></i> <%=_lt.get('Agglomeration:')%></span> <span>{{coin.aglomeration}}</span></h5>
                                                    <h5 class="font-16"><span class="font-weight-800"><i class="icon-material-outline-language"></i> <%=_lt.get('Basic income this country:')%></span> <span>{{coin.basicIncome}}{{coin.currency === 'usd' ? '$' : '€'}}</span></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row margin-left-0 margin-right-0 padding-top-30 padding-bottom-20 top-horizontal-line">
                                <div class="col">
                                    <div class="row">
                                        <div class="col-12 padding-left-20">
                                            <div>
                                                <h4 class="d-inline font-20 font-weight-600">{{yourchosenactive}}</h4>
                                                <span class="font-20 font-weight-400 font-color-a0a0a0">{{yourchosen}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="row">
                                        <div class="col padding-right-30">
                                            <div class="text-align-right">
                                                <h3 class="d-inline font-weight-600 font-20"><%=_lt.get('Total')%>: </h3>
                                                <h3 class="d-inline font-weight-600 font-24">{{totalPrice}}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row margin-top-10">
                                        <div class="col padding-right-30">
                                            <button @click="buyCoins" class="button full-width button-color-green float-right width-40"><%=_lt.get('Buy')%></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="gray-bordered-box box-shadow width-31">
                            <div class="col margin-top-50 padding-right-30 padding-left-30">
                                <div class="row">
                                    <div class="col">
                                        <h4 class="padding-bottom-10 font-weight-600 font-20"><%=_lt.get('Region')%></h4>
                                        <button @click="sortByRegion('north america')" class="button regionB ripple-effect-dark padding-10-14" :class="{ gray:sortingBy !== 'north america'}"><%=_lt.get('North America')%></button>
                                        <button @click="sortByRegion('south america')" :class="{gray:sortingBy !== 'south america'}" class="button regionB ripple-effect-dark padding-10-14"><%=_lt.get('South America')%></button>
                                        <button @click="sortByRegion('india')" class="button regionB ripple-effect-dark padding-10-14" :class="{gray:sortingBy !== 'india'}"><%=_lt.get('India')%></button>
                                        <button @click="sortByRegion('europe')" :class="{gray:sortingBy !== 'europe'}" class="button ripple-effect-dark regionB padding-10-14"><%=_lt.get('Europe')%></button>
                                        <button @click="sortByRegion('southeast asia')" :class="{gray:sortingBy !== 'southeast asia'}" class="button regionB ripple-effect-dark padding-10-14"><%=_lt.get('Southeast Asia')%></button>
                                        <button @click="sortByRegion('australia')" :class="{gray:sortingBy !== 'australia'}" class="button ripple-effect-dark regionB padding-10-14"><%=_lt.get('Australia')%></button>
                                        <h4 class="padding-bottom-10 padding-top-15 font-weight-600 font-20"><%=_lt.get('Country')%></h4>
                                        <div class="position-relative">
                                            <button class="ripple-effect investor-market-right-button"><i class="icon-material-outline-search"></i></button>
                                            <input type="text" class="input-text" placeholder="<%=_lt.get('Country')%>">
                                        </div>
                                        <h4 class="padding-bottom-10 padding-top-10 font-weight-600 font-20"><%=_lt.get('Category')%></h4>
                                        <select
                                                class="with-border thisTry" data-size="7" title="<%=_lt.get('Want to buy')%>"
                                                required>
                                            <option value="1">
                                                <%=_lt.get('Sell')%>
                                            </option>
                                            <option value="2">
                                                <%=_lt.get('Buy')%>
                                            </option>
                                        </select>
                                        <h4 class="padding-bottom-15 padding-top-20 font-weight-600 font-20"><%=_lt.get('Price')%></h4>
                                        <div>
                                            <span class="investor-market-left-label"><%=_lt.get('From')%>:</span>
                                            <input type="text" class="input-text investor-input-label" placeholder="200$">
                                        </div>
                                        <div>
                                            <span class="investor-market-left-label"><%=_lt.get('Up to')%>:</span>
                                            <input type="text" class="input-text investor-input-label" placeholder="200$">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--Login/Registration-->
        <div class="row margin-bottom-60" style="display: none">
            <div class="col-4 padding-left-0 padding-right-30 border-right-gray">
                <div>
                <h3 class="margin-bottom-20 font-36 font-weight-600"><%=_lt.get('')%>Do you have an account?</h3>
                <input placeholder="<%=_lt.get('Login')%>" type="text">
                <input placeholder="<%=_lt.get('Password')%>" type="password">
                    <button class="width-100 button ripple-effect d-block margin-bottom-20"><%=_lt.get('Log in')%></button>
                    <button class="button-color-green width-100 button ripple-effect d-block"><%=_lt.get('Create new account')%></button>
                </div>
            </div>
            <div class="col-8">
                <div class="row">
                    <div class="col padding-left-30 padding-right-0">
                        <h3 class="margin-bottom-20 font-36 font-weight-600"><%=_lt.get('Registration')%></h3>
                    </div>
                </div>
                <div class="row margin-bottom-10">
                    <div class="col padding-left-30">
                        <div>
                            <div class="section-headline font-color-333 font-20 margin-bottom-5">
                                <span class="font-color-333 font-20"><%=_lt.get('Are you a company')%></span>
                            </div>
                            <div class="radio">
                                <input id="no" name="isLegalEntity" type="radio" checked="">
                                <label for="no" class="font-color-333 font-20"><span class="radio-label"></span><%=_lt.get('No.')%></label>
                            </div>
                            <div class="radio">
                                <input id="yes" name="isLegalEntity" type="radio">
                                <label for="yes" class="font-color-333 font-20"><span class="radio-label"></span><%=_lt.get('Yes.')%></label>
                            </div>
                        </div>
                    </div>
                    <div class="col padding-right-0">
                        <label for="companyId" class="font-color-333 font-20"><%=_lt.get('Company ID')%> *</label>
                        <input id="companyId" name="isLegalEntity" type="text" placeholder="1234567890">
                    </div>
                </div>
                <div class="row margin-bottom-10">
                    <div class="col padding-left-30">
                        <label for="companyName" class="font-color-333 font-20"><%=_lt.get('Company name')%> *</label>
                        <input id="companyName" name="isLegalEntity" type="text" placeholder="<%=_lt.get('Company name')%>">
                    </div>
                    <div class="col padding-right-0">
                        <label for="companyVatId" class="font-color-333 font-20"><%=_lt.get('Company VAT ID')%> *</label>
                        <input id="companyVatId" name="isLegalEntity" type="text" placeholder="1234567890">
                    </div>
                </div>
                <div class="row margin-bottom-10">
                    <div class="col padding-left-30">
                        <label for="mail" class="font-color-333 font-20"><%=_lt.get('Email')%> *</label>
                        <input id="mail" name="email" type="email" placeholder="<%=_lt.get('Email')%>">
                    </div>
                    <div class="col padding-right-0">
                        <label for="phone" class="font-color-333 font-20"><%=_lt.get('Phone')%></label>
                        <input id="phone" name="phone" type="phone" placeholder="1234567890">
                    </div>
                </div>
                <div class="row margin-bottom-10">
                    <div class="col padding-left-30">
                        <label for="firstName" class="font-color-333 font-20"><%=_lt.get('Name')%> *</label>
                        <input id="firstName" name="firstName" type="text" placeholder="<%=_lt.get('John Doe')%>">
                    </div>
                    <div class="col padding-right-0">
                        <label for="lastName" class="font-color-333 font-20"><%=_lt.get('Surname')%> *</label>
                        <input id="lastName" name="lastName" type="text" placeholder="<%=_lt.get('Surname')%>">
                    </div>
                </div>
                <div class="row">
                    <div class="col padding-left-30">
                        <h3 class="margin-bottom-20 font-36 font-weight-600"><%=_lt.get('Address')%></h3>
                    </div>
                </div>
                <div class="row margin-bottom-10">
                    <div class="col padding-left-30">
                        <label for="street" class="font-color-333 font-20"><%=_lt.get('Street')%> *</label>
                        <input id="street" name="street" type="text">
                    </div>
                    <div class="col padding-right-0">
                        <label for="city" class="font-color-333 font-20"><%=_lt.get('City')%> *</label>
                        <input id="city" name="city" type="text">
                    </div>
                </div>
                <div class="row margin-bottom-10">
                    <div class="col padding-left-30">
                        <label for="postCode" class="font-color-333 font-20"><%=_lt.get('Post code')%> *</label>
                        <input id="postCode" name="postCode" type="text">
                    </div>
                    <div class="col padding-right-0">
                        <label for="country" class="font-color-333 font-20"><%=_lt.get('Country')%> *</label>
                        <input id="country" name="country" type="text">
                    </div>
                </div>
                <div class="row margin-bottom-10">
                    <div class="col padding-left-30 padding-right-0">
                        <button class="button ripple-effect d-block font-24 width-100 button-color-green height-90got"><%=_lt.get('Submit')%></button>
                    </div>
                </div>
            </div>
        </div>

        <!--How it works-->
        <div class="row margin-bottom-40">
            <div class="col">
                <h3 class="margin-bottom-60 font-36 font-weight-600 text-align-center"><%=_lt.get('How it works?')%></h3>
                <div class="row">
                    <div class="col-6 text-right padding-right-100 border-right-gray text-align-right">
                        <div data-title="01" class="investor-steps text-right">
                            <img src="/images/investors/step1.svg" alt="card picture">
                        </div>
                    </div>
                    <div class="col-6 padding-left-100 text-align-left">
                        <div class="investor-headers-steps margin-bottom-15"><%=_lt.get('Buy the CityCoin')%></div>
                        <span class="font-20"><%=_lt.get('You can choose many')%><br><%=_lt.get('as you want.')%></span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 text-right padding-right-100 border-right-gray text-align-right">
                        <div data-title="02" class="investor-steps">
                            <div class="investor-headers-steps margin-bottom-15"><%=_lt.get('Make your coin city')%></div>
                            <span class="font-20"><%=_lt.get('Promote the coin')%><br><%=_lt.get('in your city')%></span>
                        </div>
                    </div>
                    <div class="col-6 padding-left-100 text-align-left">
                        <img src="/images/investors/step1.svg" alt="card picture">
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 text-right padding-right-100 border-right-gray text-align-right">
                        <div data-title="03" class="investor-steps text-right">
                            <img src="/images/investors/step1.svg" alt="card picture">
                        </div>
                    </div>
                    <div class="col-6 padding-left-100 text-align-left">
                        <div class="investor-headers-steps margin-bottom-15"><%=_lt.get('Create your passive')%></div>
                        <span class="font-20"><%=_lt.get('Earn while you')%><br><%=_lt.get('You will get 50%')%><br><%=_lt.get('transaction in this city')%><br><%=_lt.get('popularity in its city')%></span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 text-right padding-right-100 position-relative text-align-right">
                        <div data-title="04" class="investor-steps">
                            <div class="investor-headers-steps margin-bottom-15"><%=_lt.get('Opportunity to trade')%></div>
                            <span class="font-20"><%=_lt.get('You can sell your coin')%><br><%=_lt.get('Sell it on a particular')%><br><%=_lt.get('price you want to put!')%></span>
                        </div>
                    </div>
                    <div class="col-6 padding-left-100 text-align-left">
                        <img src="/images/investors/step1.svg" alt="card picture">
                    </div>
                </div>
            </div>
        </div>

        <!--My Market-->
        <div class="row margin-bottom-100">
            <div class="col">
                <div class="row padding-bottom-30">
                    <h1 class="investor-page-headers font-36 font-weight-600"><%=_lt.get('My market:')%></h1>
                </div>
                <div class="row d-flex justify-content-between spacing">
                    <div class="investor-my-market-coin-list white-bordered-box">
                        <div class="col">
                            <div class="row min-height-110" v-for="(value, index) in 7" :class="{'investor-my-market-list-coin-color': index % 2 === 1}">
                                <div class="d-flex justify-content-between col padding-left-30 padding-right-30 padding-top-30">
                                    <div class="d-flex justify-content-between padding-top-10">
                                        <div class="investor-market-coin-image padding-right-10">
                                            <img src="./images/cryptoImages/bitcoin.png" width="60px" alt="coin">
                                        </div>
                                        <div class="padding-right-10"><h4 class="font-20">MoscowCoin</h4></div>
                                        <div class="investor-flag-img">
                                            <img src="./images/flags/ru.svg" width="20px" alt="coin">
                                        </div>
                                    </div>
                                    <div class="position-relative width-150">
                                        <i class="icon-material-outline-monetization-on investor-market-right-label"></i>
                                        <span class="investor-market-left-label"><%=_lt.get('Price')%>:</span>
                                        <input type="text" class="input-text investor-input-label" placeholder="5000$">
                                    </div>
                                    <div class="position-relative width-150">
                                        <i class="icon-feather-calendar investor-market-right-label"></i>
                                        <span class="investor-market-left-label"><%=_lt.get('Date')%>:</span>
                                        <input type="text" class="input-text investor-input-label" placeholder="26/09">
                                    </div>
                                    <div class="position-relative width-150">
                                        <i class="icon-feather-user investor-market-right-label"></i>
                                        <input type="text" class="input-text" placeholder="<%=_lt.get('John Doe')%>">
                                    </div>
                                    <div class="padding-top-10 font-20">
                                            <i class="icon-feather-trash-2"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="row top-horizontal-line padding-top-30 padding-bottom-20">
                                <div class="col">
                                    <div class="row">
                                        <div class="col-12 padding-left-30">
                                            <div>
                                                <h4 class="d-inline font-20 font-weight-600"><%=_lt.get('You have chosen')%>: </h4>
                                                <span class="font-20 font-weight-400 font-color-a0a0a0">1 MoscowCoin</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="row">
                                        <div class="col padding-right-30">
                                            <div class="text-align-right">
                                                <h3 class="d-inline font-weight-600 font-20"><%=_lt.get('Total')%>: </h3>
                                                <h3 class="d-inline font-weight-600 font-24">500$</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row margin-top-10">
                                        <div class="col padding-right-30 text-align-right">
                                            <button class="button full-width button-color-green float-right width-40"><%=_lt.get('Sell')%></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="gray-bordered-box box-shadow width-31">
                        <div class="col">
                            <div class="row bottom-horizontal-line">
                                <div class="col padding-bottom-10 padding-top-30 padding-left-30 investor-headers-steps">
                                    <%=_lt.get('My coins')%>:
                                </div>
                            </div>
                            <div class="row padding-top-40 padding-bottom-20 investor-my-market-coin-item" v-for="(coin, i) in 4">
                                <div class="col padding-left-30 padding-right-30">
                                    <div class="d-flex justify-content-between position-relative">
                                        <div class="d-flex justify-content-between">
                                            <div class="investor-market-coin-image padding-right-10">
                                                <img src="./images/cryptoImages/bitcoin.png" width="60px" alt="coin">
                                            </div>
                                            <div class="padding-right-10"><h4 class="font-20">MoscowCoin</h4></div>
                                            <div class="investor-flag-img">
                                                <img src="./images/flags/ru.svg" width="20px" alt="coin">
                                            </div>
                                        </div>
                                        <div class="investor-my-market-coin-info">
                                            <i class="icon-line-awesome-info"></i>
                                        </div>
                                    </div>
                                    <div class="padding-top-10">
                                        <button class="button full-width button-sliding-icon  margin-top-10"><%=_lt.get('Choose')%></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--quote-->
        <div class="row white-bordered-box min-height-168 position-relative d-flex">
            <div class="gray-border white-bordered-box min-height-168 investor-quote-div">
                <div class="position-absolute div-align-vertical-center left-34">
                    <div class="font-20 font-color-333 text-align-center font-style-oblique"><q><%=_lt.get('Price is what you pay')%></q></div>
                    <div class="font-16 font-color-a0a0a0 text-align-center"><%=_lt.get('Warren Edward Buffett')%></div>
                </div>
            </div>
            <div class="position-absolute investor-quote-img-div">
                <img src="./images/investors/warrenEdward.jpg" alt="Warren Edward">
            </div>
        </div>
        <!--Footer-->
        <div class="row">
            <div class="col">
                <div class="row">
                    <div class="col margin-top-60">
                        <div class="font-36 font-color-333 font-weight-600 margin-bottom-20"><%=_lt.get('Address')%></div>
                        <div class="font-20 font-color-333 line-height-2">1001 New Street, 24 Park Fresh
                            Tree 23, 20000004242</div>
                    </div>
                    <div class="col margin-top-60">
                        <div class="font-36 font-color-333 font-weight-600 margin-bottom-20"><%=_lt.get('Phone')%></div>
                        <div class="line-height-2">
                            <a href="tel:+1 999 888 56 67" class="font-20 font-color-333"><i class="icon-feather-phone"></i>&nbsp;+1&nbsp;999&nbsp;888&nbsp;56&nbsp;67</a><br>
                            <a href="tel:+1 999 888 56 67" class="font-20 font-color-333"><i class="icon-feather-phone"></i>&nbsp;+1&nbsp;999&nbsp;888&nbsp;56&nbsp;67</a>
                        </div>
                    </div>
                </div>
                <div class="row margin-bottom-60">
                    <div class="col margin-top-60">
                        <div class="font-36 font-color-333 font-weight-600 margin-bottom-20"><%=_lt.get('Online service')%></div>
                        <div class="line-height-2">
                            <a class="font-20 font-color-333" href="https://localcrypto.cloud"><i class="icon-line-awesome-globe"></i>https://localcrypto.cloud</a><br>
                            <a href="mailto:z@localcrypto.cloud" class="font-20 font-color-333"><i class="icon-feather-mail"></i>&nbsp;z@localcrypto.cloud</a><br>
                            <span class="font-20 font-color-333"><i class="icon-feather-printer"></i>&nbsp;fax@localcrypto.com</span>
                        </div>
                    </div>
                    <div class="col margin-top-60">
                        <div class="font-36 font-color-333 font-weight-600 margin-bottom-20"><%=_lt.get('Licence')%></div>
                        <div class="font-20 font-color-333 line-height-2">1&nbsp;999&nbsp;888&nbsp;56&nbsp;67&nbsp;465&nbsp;3454</div>
                    </div>
                </div>
            </div>
            <div class="col white-bordered-box box-shadow margin-top-60">
                <div class="font-weight-600 font-color-333 font-48 padding-left-30 line-height-2 padding-top-30 padding-bottom-20"><%=_lt.get('Send us a message')%></div>
                <div class="padding-left-60 padding-right-40">
                    <div class="position-relative">
                        <i class="icon-feather-mail investor-market-right-label"></i>
                        <input type="email" class="input-text" placeholder="<%=_lt.get('Your email')%>" v-model="email">
                    </div>
                    <div class="position-relative">
                        <i class="icon-feather-user investor-market-right-label"></i>
                        <input type="text" class="input-text" placeholder="<%=_lt.get('Your name')%>" v-model="name">
                    </div>
                    <div class="position-relative">
                        <textarea type="text" class="input-text" placeholder="<%=_lt.get('Your message')%>" v-model="message"></textarea>
                    </div>
                    <div class="d-flex justify-content-between padding-bottom-80">
                        <button class="width-38 button full-width button-color-green font-20"><%=_lt.get('Submit')%></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
