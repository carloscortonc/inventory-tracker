import { ComponentWrapper } from "@/providers/components-provider";
import { Props as LayoutProps } from "@/components/layout";
import cn from "classnames";
import Layout from "../layout";
import "./sidebar.scss";

type Props = {
  visible: boolean;
  onClose: () => void;
  height: string | number;
  className?: string;
  children: React.ReactNode;
} & LayoutProps;
const Sidebar = (props: Props) => {
  return (
    <ComponentWrapper>
      <div className={cn("cmp-sidebar", props.className, { visible: props.visible })} onClick={props.onClose}>
        <div onClick={(e) => e.stopPropagation()} className="cmp-sidebar__content" style={{ height: props.height }}>
          <Layout {...props}>{props.children}</Layout>
        </div>
      </div>
    </ComponentWrapper>
  );
};

export default Sidebar;
