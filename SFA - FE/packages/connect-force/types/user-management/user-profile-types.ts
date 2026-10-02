export type UserProfileState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  userProfileDetails: UserProfileResponse[];
  isActive: true;
  userProfile: UserProfileResponse | null;
  newPage: number;
  newRowsPerPage: number;
  message: string | null;
};

export type Pagination = {
  pageNo: number;
  pageSize: null;
  results: number;
  total: number;
};

export type UserProfilePayload = {
  userDetailsUId?: number;
  firstName: string;
  lastName: string;
  dob: string | null;
  nic: string;
  address: string;
  addressLine2: string | null;
  mobileNumber: string;
  email: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  employeeID: string;
  designation: string;
  epF_ETF_Number: string;
  appointedDate: string | null;
  userName: string;
};

export type CreateUserProfilePayload = UserProfilePayload & {
  password: string;
};

export type UserProfileResponse = {
  userDetailsUId?: number;
  userName: string;
  totalRecordCount?: number;
  active?: boolean;
  isArchive?: boolean;
  profile: UserProfilePayload & {
    userProfileUId?: number;
  };
};
