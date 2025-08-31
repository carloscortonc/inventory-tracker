import cn from "classnames";
import "./loader.scss";

type Props = { backdrop?: boolean };
const Loader = (props: Props) => {
  return (
    <div className={cn("cpm-loader-wrapper", { backdrop: props.backdrop })}>
      <div className="cmp-loader" />
    </div>
  );
};

export default Loader;
