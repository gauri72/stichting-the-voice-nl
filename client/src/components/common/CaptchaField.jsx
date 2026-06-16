import TurnstileWidget from "./TurnstileWidget.jsx";

export default function CaptchaField({ captcha, className = "" }) {
  if (!captcha?.required) return null;

  return (
    <div className={`captcha-field ${className}`.trim()}>
      <TurnstileWidget
        resetKey={captcha.resetKey}
        onVerify={captcha.setToken}
        onExpire={captcha.clearToken}
        onError={captcha.clearToken}
      />
    </div>
  );
}
