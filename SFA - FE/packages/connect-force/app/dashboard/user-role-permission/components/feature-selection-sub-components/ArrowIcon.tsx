import { FiChevronRight } from "react-icons/fi";
import cx from "classnames";

interface ArrowIconProps {
    isOpen?: boolean;
    className? : string;
    color?: string;
    size?: number;
  }
  
  const ArrowIcon : React.FC<ArrowIconProps> = ({ isOpen, className, color = "#070e4dc7",  size = 20 }) => {
    const baseClass = "arrow";
    const classes = cx(
      baseClass,
      { [`${baseClass}--closed`]: !isOpen },
      { [`${baseClass}--open`]: isOpen },
      className
    );
    return <FiChevronRight className={classes} color={color} size={size} />;
  };

  export default ArrowIcon;
