import { FaCheckCircle, FaMinusCircle, FaCircle } from "react-icons/fa";

interface CheckBoxIconProps {
    variant: 'all' | 'none' | 'some';
    onClick?: (e: any) => void;
    className?: string;
    color?: string;
    size?: number;
  }
  
  const CheckBoxIcon: React.FC<CheckBoxIconProps> = ({ variant, color = "#070e4d",  size = 20, ...rest }) => {
    switch (variant) {
      case "all":
        return <FaCheckCircle {...rest} color={color} size={size} />;
      case "none":
        return <FaCircle {...rest} color={color} size={size} />;
      case "some":
        return <FaMinusCircle {...rest} color={color} size={size} />;
      default:
        return null;
    }
  };

  export default CheckBoxIcon;