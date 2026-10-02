import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "assettransaction";

export const createAssetTransaction = async (data: any) => {
    try {
        const response = await axiosInstance.post(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
            data
        );
        return response;
    } catch (error: ErrorType | any) {
        console.error("Error updating Asset transfer:", error);
        throw new Error();
    }
}