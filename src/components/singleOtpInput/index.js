/**
 * COPY OF https://www.npmjs.com/package/react-otp-input
 */
import React from "react";

class SingleOtpInput extends PureComponent {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  // Focus on first render
  // Only when shouldAutoFocus is true
  componentDidMount() {
    const { focus, shouldAutoFocus } = this.props;
    const { current: inputEl } = this.input;

    if (inputEl && focus && shouldAutoFocus) {
      inputEl.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const { focus } = this.props;
    const { current: inputEl } = this.input;

    // Check if focusedInput changed
    // Prevent calling function if input already in focus
    if (prevProps.focus !== focus && inputEl && focus) {
      inputEl.focus();
      inputEl.select();
    }
  }

  getClasses = (...classes) =>
    classes.filter((c) => !isStyleObject(c) && c !== false).join(" ");

  getType = () => {
    const { isInputSecure, isInputNum } = this.props;

    if (isInputSecure) {
      return "password";
    }

    if (isInputNum) {
      return "tel";
    }

    return "text";
  };

  render() {
    const {
      placeholder,
      separator,
      isLastChild,
      inputStyle,
      focus,
      isDisabled,
      hasErrored,
      errorStyle,
      focusStyle,
      disabledStyle,
      shouldAutoFocus,
      isInputNum,
      index,
      value,
      className,
      isInputSecure,
      ...rest
    } = this.props;

    return (
      <div
        className={className}
        style={{ display: "flex", alignItems: "center" }}
      >
        <input
          aria-label={`${
            index === 0 ? "Please enter verification code. " : ""
          }${isInputNum ? "Digit" : "Character"} ${index + 1}`}
          autoComplete="off"
          style={Object.assign(
            { width: "1em", textAlign: "center" },
            isStyleObject(inputStyle) && inputStyle,
            focus && isStyleObject(focusStyle) && focusStyle,
            isDisabled && isStyleObject(disabledStyle) && disabledStyle,
            hasErrored && isStyleObject(errorStyle) && errorStyle
          )}
          placeholder={placeholder}
          className={this.getClasses(
            inputStyle,
            focus && focusStyle,
            isDisabled && disabledStyle,
            hasErrored && errorStyle
          )}
          type={this.getType()}
          maxLength="1"
          ref={this.input}
          disabled={isDisabled}
          value={value ? value : ""}
          {...rest}
        />
        {!isLastChild && separator}
      </div>
    );
  }
}
