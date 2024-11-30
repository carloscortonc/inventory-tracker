import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useZxing } from "react-zxing";
import "./scanner.css";

export const Scanner = () => {
  const [code, setCode] = useState<string>();
  const { ref } = useZxing({
    onDecodeResult: (r) => setCode(r.getText()),
  });

  if (code) {
    return <Navigate to={"./".concat(code)} />;
  }

  return (
    <>
      <div className="video-feed-wrapper">
        <video ref={ref} className="video-feed" />
        <div className="video-feed-box" />
      </div>
      <div>scanner</div>
    </>
  );
};
