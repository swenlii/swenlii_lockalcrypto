<div>
<!-- Titlebar
================================================== -->
<div class="single-page-header" data-background-image="images/single-task.jpg">
	<div class="container" style="min-height: 537px;">

		<div class="dashboard-headline">
			<h3 v-if="userObj"><%=_lt.get('Settings')%></h3>
			<h3 v-else><%=_lt.get('To see settings login')%></h3>
		</div>

		<div class="row" v-if="userObj">
			<form action="" id="settings">
				<!-- Dashboard Box -->
				<div class="col-xl-12">
					<div class="dashboard-box margin-top-0">

						<!-- Headline -->
						<div class="headline">
							<h3><i class="icon-material-outline-account-circle"></i> <%=_lt.get('My Account')%></h3>
						</div>

						<div class="content with-padding padding-bottom-0">

							<div class="row">

								<div class="col-auto">
									<div class="avatar-wrapper custom-avatar-wrapper"
										 data-tippy-placement="bottom"
										 data-tippy-theme="light"
										 data-original-title="<%=_lt.get('Change Avatar')%>"
										 data-tippy-content="<%=_lt.get('Change Avatar')%>">
										<img class="profile-pic" :src="'./images/' + (userObj.avatarPath ? ('users/' + userObj.avatarPath) : 'user-avatar-placeholder.png')" alt="">
										<div id="upload-button-settings" class="upload-button"></div>
										<input id="file-upload-settings" class="file-upload" type="file" accept="image/*" ref="avatarFile" @change="uploadAvatar">
									</div>
								</div>

								<div class="col">
									<div class="row">

										<div class="col-xl-6">
											<div class="submit-field">
												<h5><%=_lt.get('First Name')%></h5>
												<input
                                                        type="text"
                                                        class="with-border margin-bottom-0"
                                                        id="firstName"
														v-model="firstName">
												<div>&nbsp;</div>
											</div>
										</div>

										<div class="col-xl-6">
											<div class="submit-field">
												<h5><%=_lt.get('Last Name')%></h5>
												<input
                                                        type="text"
                                                        class="with-border margin-bottom-0"
                                                        id="lastName"
														v-model="lastName">
												<div>&nbsp;</div>
											</div>
										</div>



										<div class="col-xl-6">
											<div class="submit-field">
												<h5><%=_lt.get('Email')%></h5>
												<input
														name="email"
														type="email"
														id="email"
														autocomplete="on"
														class="with-border margin-bottom-0"
														v-model="email">
												<div>&nbsp;</div>
											</div>
										</div>


										<div class="col-xl-6">
											<div class="submit-field">
												<h5><%=_lt.get('Phone number')%></h5>
												<input
														type="tel"
														id="phone"
														autocomplete="on"
														class="with-border margin-bottom-0"
														v-model="phone">
												<div style="color:red" v-if="!isValidPhone"><%=_lt.get('The phone number invalid')%></div>
												<div v-else>&nbsp;</div>
											</div>
										</div>
									</div>
								</div>
							</div>
								<button
                                        type="submit"
                                        class="button ripple-effect big margin-bottom-30"
										:class="{block: isSettingsChanging}"
                                        v-on:click.prevent="updateUserInfo"><%=_lt.get('Save Changes')%></button>
						</div>
					</div>
				</div>
    </form>


				<!-- Dashboard Box -->
				<div class="col-xl-12">
					<div id="test1" class="dashboard-box">

						<!-- Headline -->
						<div class="headline">
							<h3><i class="icon-material-outline-lock"></i> <%=_lt.get('Password Security')%></h3>
						</div>
						<div class="content with-padding">
							<div class="row">
								<div class="col-xl-4">
									<div class="submit-field">
										<h5><%=_lt.get('Current Password')%></h5>
										<input type="password" class="with-border" autocomplete="off" v-model="currentPassword">
									</div>
								</div>

								<div class="col-xl-4">
									<div class="submit-field">
										<h5><%=_lt.get('New Password')%></h5>
										<input type="password" class="with-border" v-model="newPassword">
									</div>
								</div>

								<div class="col-xl-4">
									<div class="submit-field">
										<h5><%=_lt.get('Repeat New Password')%></h5>
										<input type="password" class="with-border" v-model="repeatNewPassword">
									</div>
								</div>

								<div class="col-xl-12">
									<div class="checkbox">
										<input type="checkbox" id="two-step" checked="">
										<label for="two-step"><span class="checkbox-icon"></span> <%=_lt.get('Enable Two-Step')%></label>
									</div>
								</div>
								<div class="col-xl-12">
										<button type="submit" class="button ripple-effect big margin-top-30" v-on:click.prevent="changeUserPassword"><%=_lt.get('Save Changes')%></button>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-xl-12">
							<button class="button ripple-effect big margin-top-30" v-on:click.prevent="deleteUserAccount"><%=_lt.get('Delete my account')%></button>
						</div>
					</div>
				</div>
			</div>
    </div>
</div>
</div>
