import { Toast } from "./types";
import "./styles.css";

const FeedbackToast = (props: { text: string }) => {
  return <div className="toast">{props.text}</div>;
};

export default FeedbackToast;
