import axios from "axios";
import { getSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

interface ErrorResponse {
  title: string;
  status: number;
  detail?: string;
}

const unhandledError: ErrorResponse = {
  title: "Something Went Wrong, Please Contact Technical Team.",
  status: 500,
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      let errorResp = { ...unhandledError };

      switch (status) {
        case 400:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || data.details[0].message || "Bad Request",
          };
          break;
        case 401:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || "Unauthorized",
          };
          break;
        case 402:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || "Payment Required",
          };
          break;
        case 403:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || "Forbidden",
          };
          break;
        case 404:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || "Not Found",
          };
          break;
        case 405:
          errorResp = {
            ...errorResp,
            detail: data.data.details[0].description || "Method Not Allowed",
          };
          break;
        case 408:
          errorResp = {
            ...errorResp,
            detail: data.data.details[0].description || "Request Timeout",
          };
          break;
        case 409:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || "Conflict",
          };
          break;
        case 429:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || "Too Many Requests",
          };
          break;
        case 500:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || "Internal Server Error",
          };
          break;
        case 502:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || "Bad Gateway",
          };
          break;
        case 503:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || "Service Unavailable",
          };
          break;
        case 504:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || "Gateway Timeout",
          };
          break;
        default:
          errorResp = {
            ...errorResp,
            detail: data.details[0].description || data || "An error occurred",
          };
          break;
      }

      enqueueSnackbar(errorResp.detail, { variant: "error" });
      throw errorResp;
    } else {
      enqueueSnackbar(unhandledError.title, { variant: "error" });
      throw error;
    }
  }
);

axiosInstance.interceptors.request.use(
  async (request) => {
    const session = await getSession();

    if (session) {
      request.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const post = async (url: string, data: any, auth = false) => {
  const options: any = {
    data,
    url,
    method: "post",
    responseType: "json",
  };

  return axiosInstance(options);
};

export const put = async (url: string, data: any) => {
  const options: any = {
    data,
    url,
    method: "put",
    responseType: "json",
  };

  return axiosInstance(options);
};

export const deleteReq = async (url: string, data: any) => {
  const options: any = {
    data,
    url,
    method: "delete",
    responseType: "json",
  };

  return axiosInstance(options);
};

export const patch = async (url: string, data: any) => {
  const options: any = {
    data,
    url,
    method: "patch",
    responseType: "json",
  };

  return axiosInstance(options);
};

export const get = async (url: string, auth = false) => {
  const options: any = {
    url,
    method: "get",
    responseType: "json",
  };

  return axiosInstance(options);
};

export const remove = async (url: string) => {
  const options: any = {
    url,
    method: "delete",
    responseType: "json",
  };

  return axiosInstance(options);
};

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (
//       error.response &&
//       (error.response.status === 401 || error.response.status === 400)
//     ) {
//       const errorResp = {
//         ...unhandledError,
//         detail: error.response.data.error_description,
//       }
//       throw errorResp
//     } else if (error.response && error.response.status === 500) {
//       const errorResp = {
//         ...unhandledError,
//         detail: error.response.data,
//       }
//       throw errorResp
//     } else {
//       throw error.response ? error.response.data : error
//     }
//   }
// )

export default axiosInstance;
