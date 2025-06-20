<div class="dashboard-content-container">
    <div class="dashboard-content-inner">
        <div class="col div-align-horizontal-center max-width-66 margin-bottom-20">

        <div class="row">
            <div class="col-xl-12">
                <div class="section-headline margin-top-55 margin-bottom-24">
                    <h2><%=_lt.get('Contact us')%></h2>
                </div>
            </div>
        </div>

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
</div>