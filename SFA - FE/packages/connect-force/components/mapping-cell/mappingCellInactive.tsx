
import { IconButton, Tooltip } from "@mui/material";
import { LinkGrayIcon } from "@/assets/icons/distributor-mapper/link-gray";
import { useRouter } from "next/navigation";
import { capitalizeWords } from "@/utils/capitalizeWords";

interface MappingCellActiveProps {
    row: any;
    columnName: string;
    routePath: string;
}

const MappingCellInactive : React.FC<MappingCellActiveProps> = ({ row, columnName, routePath }) => {
    const route = useRouter();
    const onClick = () => {
        route.push(routePath);
    };

    return (
        <>
            <Tooltip title={`Assign ${capitalizeWords(columnName)}`}>
                <IconButton onClick={onClick}>
                    <LinkGrayIcon />
                </IconButton>
            </Tooltip>
        </>
    );
};

export default MappingCellInactive;
