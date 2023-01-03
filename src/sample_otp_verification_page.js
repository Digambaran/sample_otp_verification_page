import React, { useState } from "react";
import queryString from "query-string";
import "./assets/css/main.css";
import OtpInput from "./components/otpInput";
import { useInterval } from "./hooks";

export const Sample_otp_verification_page = () => {
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [disableBtn, setDisableBtn] = useState(true);
  const handleOnChange = (code) => {
    if (code.length === 6) {
      setCode(code);
      setDisableBtn(false);
      return;
    }
    setCode(code);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...queryString.parse(window.location.search),
      email_verification_code: code,
    };
    const _j = await fetch(
      `${
        process.env.BLOCK_FUNCTION_URL || "http://localhost:5000"
      }/sample_otp_verification_fn`,
      {
        body: JSON.stringify(data),
        method: "POST",
      }
    );
    console.log(_j.status);
    const d = await _j.json();
    console.log(d);
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
          <h1 className="text-lg text-light-black font-bold mb-6">
            Verify it's you!
          </h1>
          <div className="text-grey text-[13px] mt-4">
            Enter the 6-Digit code sent to your email
            <a
              className="text-primary cursor-pointer hover:underline underline-offset-4"
              href="/"
            ></a>
          </div>
          <div className="w-full float-left pb-4 mt-6">
            <form className="w-full float-left mb-0" onSubmit={handleSubmit}>
              <div className="flex flex-col mb-3 otp-container" id="otp-main">
                <label className="text-black font-almost-bold text-sm">
                  Verification Code*
                </label>
                <OtpInput
                  value={code}
                  onChange={handleOnChange}
                  placeholder="------"
                  numInputs={6}
                  isInputNum={true}
                  inputStyle="focus:outline-none bg-light-gray focus:placeholder-opacity-0"
                  containerStyle="flex gap-2 items-center w-full border border-light-gray rounded-sm bg-light-gray px-4 py-2 pr-12 relative"
                />

                <span className="error-msg-inner text-red-600 text-[11px] pt-2 font-medium">
                  Invalid verification code! try again or request for new!
                </span>
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
                  {seconds > 0 ? (
                    <a className="inline-block text-gray underline underline-offset-4">
                      &nbsp;Request new in {seconds}s
                    </a>
                  ) : (
                    <a
                      className="text-primary cursor-pointer underline focus:outline-none underline-offset-4"
                      href=""
                    >
                      &nbsp;Request new
                    </a>
                  )}
                </p>
                <a
                  className="text-primary text-sm font-heavy cursor-pointer underline underline-offset-4 mt-6"
                  href="http://localhost:4009"
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
