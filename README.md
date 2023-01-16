# sample_otp_verification_page

Gets email from query param, and sends it along with user entered OTP to process.env.OTP_VERIFICATION_URL

## env

`RESEND_OTP_URL` api to request for new otp

`OTP_VERIFICATION_URL` api to hit with code and email for verification

`REDIRECT_ON_VERIFIED_TO` where to redirect after successful verification

`RESEND_WAIT_TIME` time to wait before making "resend OTP" link available (after mount) in seconds. (default is 30s)

`SIGNUP_PAGE_URL` where to redirect when user clicks "Change Email"
