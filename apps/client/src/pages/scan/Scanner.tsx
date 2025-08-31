import React from "react";
import { useNavigate } from "react-router-dom";
import Layout, { Footer, Header } from "@/components/layout";
import Loader from "@/components/loader";
import cn from "classnames";
import { IDetectedBarcode, Scanner as YScanner } from "@yudiel/react-qr-scanner";
import Icon from "@/components/icon";
import { ItemDetail } from "../items";
import { Item } from "@/types";
import { request } from "@/utils/fetch";
import "./scanner.css";

let timeoutId: number;
export const Scanner = () => {
  const [detected, setDetected] = React.useState<Partial<Item> & { outside?: boolean }>({
    outside: false,
  });
  const [point, setPoint] = React.useState<any>({});
  const detectedRef = React.useRef(false);
  const onClear = () => {
    setDetected({});
    detectedRef.current = false;
  };

  const viewfinderRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const onCodeDetection = React.useCallback(
    (code: string) => {
      clearTimeout(timeoutId);
      detectedRef.current = true;
      request<Item>("/products/".concat(code)).then(setDetected);
    },
    [navigate, setDetected, detectedRef],
  );

  const onOutsideDetection = React.useCallback(() => {
    setDetected({ outside: true });
    // createToast("Center the barcode inside the box");
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => setDetected({}), 1000);
  }, [setDetected]);

  const onCapture = React.useCallback(
    (results: IDetectedBarcode[]) => {
      if (!results?.length) return;
      const { boundingBox, rawValue } = results[0];
      const video = document.querySelector("video");
      const viewfinder = viewfinderRef.current;
      if (!video || !viewfinder) return;

      // Get video and display sizes
      const { videoWidth, videoHeight, clientWidth: displayWidth, clientHeight: displayHeight } = video;
      const aspectVideo = videoWidth / videoHeight;
      const aspectDisplay = displayWidth / displayHeight;

      // Calculate scaling and offset
      let scaleX,
        scaleY,
        offsetX = 0,
        offsetY = 0;
      if (aspectVideo > aspectDisplay) {
        const trueHeight = displayWidth / aspectVideo;
        offsetY = (displayHeight - trueHeight) / 2;
        scaleX = displayWidth / videoWidth;
        scaleY = trueHeight / videoHeight;
      } else {
        const trueWidth = displayHeight * aspectVideo;
        offsetX = (displayWidth - trueWidth) / 2;
        scaleX = trueWidth / videoWidth;
        scaleY = displayHeight / videoHeight;
      }

      // Map detection box to viewport coordinates
      const box = {
        left: boundingBox.x * scaleX + offsetX,
        top: boundingBox.y * scaleY + offsetY,
        width: boundingBox.width * scaleX,
        height: boundingBox.height * scaleY,
      };
      const videoRect = video.getBoundingClientRect();
      const boxViewport = {
        left: box.left + videoRect.left,
        top: box.top + videoRect.top,
        right: box.left + videoRect.left + box.width,
        bottom: box.top + videoRect.top + box.height,
      };

      // Check if box is fully inside the viewfinder
      const vfRect = viewfinder.getBoundingClientRect();
      const isInside =
        boxViewport.left >= vfRect.left &&
        boxViewport.top >= vfRect.top &&
        boxViewport.right <= vfRect.right &&
        boxViewport.bottom <= vfRect.bottom;

      if (!isInside) return onOutsideDetection();
      onCodeDetection(rawValue);
    },
    [setPoint],
  );

  return (
    <Layout
      header={<Header title="Scan" startSlot={<Icon name="close" onClick={() => navigate("/")} />} />}
      className="scanner-layout"
    >
      <div className="video-feed-wrapper">
        <YScanner
          onScan={onCapture}
          styles={{ video: { objectFit: "contain" } }}
          components={{ finder: false }}
          formats={[
            "databar",
            "databar_expanded",
            "codabar",
            "code_39",
            "code_93",
            "code_128",
            "ean_8",
            "ean_13",
            "itf",
            "linear_codes",
            "upc_a",
            "upc_e",
          ]}
          allowMultiple={true}
          paused={detectedRef.current}
        />
        <div className={cn("viewfinder", { result: detected.code, outside: detected.outside })} ref={viewfinderRef} />
      </div>
      {detected.code && <Loader />}
      <ItemDetail {...(detected as Item)} visible={!!detected.code} onClose={onClear} />
    </Layout>
  );
};
