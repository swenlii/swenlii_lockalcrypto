<div>
    <div v-show="show ==='form'" id="reset-password-container" class="dashboard-box">
        <h3><%=_lt.get('Enter new password')%></h3>
        <form v-on:submit="resetPassword" class="margin-top-20" id="reset-password-form">
            <div class="inputErrorMessage invisible" id="password-not-match-restore">
                <h4><%=_lt.get('Passwords do not match!')%></h4>
            </div>
            <input
                v-model="password"
                id="password-restore"
                type="password"
                class="margin-top-20 with-border"
                placeholder="<%=_lt.get('Password')%>"
                required
            >
            <input
                v-model="repeatPassword"
                id="repeat-password-restore"
                type="password"
                class="margin-top-20 with-border"
                placeholder="<%=_lt.get('Repeat Password')%>"
                required
            >
            <button
                class="margin-top-20 button full-width"
                type="submit"
                form="reset-password-form"
            ><%=_lt.get('Save New Password')%></button>
        </form>
    </div>
    <div v-show="show ==='BadLinkError'" id="reset-password-error" class="dashboard-box">
        <h4><%=_lt.get('This link is invalid.')%></h4>
        <p> <%=_lt.get('To set new password')%> <a href="#restore-password-dialog" class="popup-with-zoom-anim forgot-password"><%=_lt.get('click here')%>.</a></p>
    </div>
</div>



