import React, { useState } from "react";
import queryString from "query-string";
import classnames from "classnames";
import "./assets/css/main.css";
import OtpInput from "./components/otpInput";
import { useInterval } from "./hooks";
import GreenTick from "./components/greenTick";
import ErrorCross from "./components/cross";

/**
 *
 * @param {{msg:string}} param0
 * @returns
 */
const ErrorMsg = ({ msg }) => <span className="text-error text-[11px] pt-2 font-medium ">{msg}</span>;

// const BLOCK_NAME = "SAMPLE_OTP_VERIFICATION_PAGE";
const currentProcess = { env: process.env };
const getFromBlockEnv = (name) => currentProcess.env[name];

export const Sample_otp_verification_page = () => {
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(process.env.RESEND_WAIT_TIME || 30);
  const [disableBtn, setDisableBtn] = useState(true);
  const [errored, setErrored] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const handleOnChange = (code) => {
    if (code.length === 6) {
      setCode(code);
      setDisableBtn(false);
      return;
    }
    setErrorMsg("");
    setErrored(false);
    setCode(code);
  };
  const handleResendOtpClick = async (e) => {
    e.preventDefault();
    const data = {
      ...queryString.parse(window.location.search),
    };
    setSeconds(process.env.RESEND_WAIT_TIME || 30);
    try {
      const _j = await fetch(getFromBlockEnv("RESEND_OTP_URL"), {
        body: JSON.stringify(data),
        method: "POST",
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...queryString.parse(window.location.search),
      email_verification_code: code,
    };
    try {
      const _j = await fetch(getFromBlockEnv("OTP_VERIFICATION_URL"), {
        body: JSON.stringify(data),
        method: "POST",
      });
      if (_j.status === 500) {
        setOtpVerified(false);
        setErrored(true);
        setErrorMsg("Something went wrong at our end!");
        return;
      }
      const d = await _j.json();
      if (_j.status === 200 && d.err) {
        setOtpVerified(false);
        setErrored(true);
        setErrorMsg(d.msg);
        console.log(d);
        return;
      }

      setErrored(false);
      setOtpVerified(true);
      window.location = process.env.REDIRECT_ON_VERIFIED_TO || window.location;
    } catch (err) {
      setOtpVerified(false);
      setErrored(true);
      setErrorMsg("Something went wrong, check console.");
      console.log(err);
    }
  };

  useInterval(
    () => {
      setSeconds(seconds - 1);
    },
    seconds > 0 ? 1000 : null
  );

  return (
    <div className="w-full min-h-screen float-left flex sm:block bg-white">
      <div className="w-full flex flex-col min-h-screen items-center sm:justify-center pt-16 sm:p-2">
        <div className="w-full sm:max-w-[420px] bg-white sm:border sm:border-mid-gray sm:rounded-sm sm:min-h-0 p-8 sm:p-16 sm:shadow-lg min-h-screen">
          <h1 className="text-lg text-light-black font-bold mb-6">Verify it is you!</h1>
          <div className="text-grey text-[13px] mt-4">
            Enter the 6-Digit code sent to your email
            <a className="text-primary cursor-pointer hover:underline underline-offset-4" href="/"></a>
          </div>
          <div className="w-full float-left pb-4 mt-6">
            <form className="w-full float-left mb-0" onSubmit={handleSubmit}>
              <div className="flex flex-col mb-3 otp-container" id="otp-main">
                <label className="text-black font-almost-bold text-sm">Verification Code*</label>
                <OtpInput
                  value={code}
                  onChange={handleOnChange}
                  placeholder="------"
                  numInputs={6}
                  isInputNum={true}
                  inputStyle="focus:outline-none bg-light-gray focus:placeholder-opacity-0"
                  containerStyle={classnames(
                    "flex gap-2 items-center w-full mt-2.5 px-4 py-3 relative bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black",
                    {
                      "border-light-gray": !errored,
                      "focus:border-primary": !errored,
                    },
                    {
                      "border-error": errored,
                      "focus:border-error": errored,
                    }
                  )}
                >
                  {otpVerified && (
                    <div className={`absolute w-8 h-full right-1 top-3`}>
                      <GreenTick />
                    </div>
                  )}
                  {!otpVerified && errored && (
                    <div className={`absolute w-8 h-full right-1 top-3`}>
                      <ErrorCross />
                    </div>
                  )}
                </OtpInput>
                {errored && <ErrorMsg msg={errorMsg} />}
              </div>
              <div className="flex flex-col button-wrapper w-full mt-6">
                <button
                  className="w-full rounded-sm py-3 focus:outline-none font-heavy text-white text-md  bg-primary disabled:bg-gray transition-all"
                  type="submit"
                  disabled={disableBtn}
                >
                  Verify
                </button>
                <p className="w-full text-sm text-grey mt-6">
                  Didn't get code?
                  {seconds > 0 && !otpVerified ? (
                    <a className="inline-block text-gray underline underline-offset-4">
                      &nbsp;Request new in {seconds}s
                    </a>
                  ) : (
                    <a
                      className="text-primary cursor-pointer underline focus:outline-none underline-offset-4"
                      href=""
                      onClick={handleResendOtpClick}
                    >
                      &nbsp;Request new
                    </a>
                  )}
                </p>
                <a
                  className="text-primary text-sm font-heavy cursor-pointer underline underline-offset-4 mt-6"
                  href={process.env.SIGNUP_PAGE_URL}
                >
                  Change E-mail
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sample_otp_verification_page;
