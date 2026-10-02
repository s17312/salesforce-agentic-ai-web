
import { IconButton, Tooltip } from "@mui/material";
import { LinkGreenIcon } from "@/assets/icons/distributor-mapper/link-green";
import { useRouter } from "next/navigation";
import { capitalizeWords } from "@/utils/capitalizeWords";

interface MappingCellActiveProps {
    row: any;
    columnName: string;
    routePath: string;
}

const MappingCellActive: React.FC<MappingCellActiveProps> = ({ row, columnName, routePath }) => {
    const route = useRouter();
    const onClick = () => {
        route.push(routePath);
    };
    
    return (
        <>
            <Tooltip title={`Assign ${capitalizeWords(columnName)}`}>
                <IconButton onClick={onClick}>
                    <LinkGreenIcon />
                </IconButton>
            </Tooltip>
        </>
    );
};

export default MappingCellActive;
