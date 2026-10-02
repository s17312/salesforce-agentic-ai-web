/// <reference types="react" />
import * as React$1 from 'react';
import React__default, { ReactNode, ReactElement, SyntheticEvent, ElementType, PropsWithChildren, FC } from 'react';
import { BoxProps, AvatarProps, BadgeProps, AvatarGroupProps, SxProps, TypographyProps, BreadcrumbsProps, LinkProps, ButtonProps, PaperProps, Theme as Theme$1, AppBarProps as AppBarProps$1, FilledInputProps, CardProps } from '@mui/material';
import { LazyLoadImageProps } from 'react-lazy-load-image-component';
import { Theme } from '@mui/material/styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { GridColDef, DataGridProps } from '@mui/x-data-grid';
export { useConfirm } from 'material-ui-confirm';

interface LogoProps extends BoxProps {
    disabledLink?: boolean;
}
declare const Logo: React__default.ForwardRefExoticComponent<Omit<LogoProps, "ref"> & React__default.RefAttributes<HTMLDivElement>>;

type BadgeStatusValue = 'away' | 'busy' | 'unread' | 'online' | 'offline' | 'invisible' | string;
type BadgeSizeValue = 'small' | 'medium' | 'large';
interface BadgeStatusProps extends BoxProps {
    size?: BadgeSizeValue;
    status?: BadgeStatusValue;
}

declare function BadgeStatus({ size, status, sx }: BadgeStatusProps): React__default.JSX.Element;

interface CustomAvatarProps extends AvatarProps {
    color?: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
    name?: string;
    BadgeProps?: BadgeProps;
}
interface CustomAvatarGroupProps extends AvatarGroupProps {
    size?: 'tiny' | 'small' | 'medium' | 'large';
    compact?: boolean;
}

declare const CustomAvatar: React__default.ForwardRefExoticComponent<Omit<CustomAvatarProps, "ref"> & React__default.RefAttributes<HTMLDivElement>>;

declare const CustomAvatarGroup: React__default.ForwardRefExoticComponent<Omit<CustomAvatarGroupProps, "ref"> & React__default.RefAttributes<HTMLDivElement>>;

type IProps = BoxProps & LazyLoadImageProps;
type ImageRatio = '4/3' | '3/4' | '6/4' | '4/6' | '16/9' | '9/16' | '21/9' | '9/21' | '1/1';
interface ImageProps extends IProps {
    ratio?: ImageRatio;
    disabledEffect?: boolean;
}

declare const Image: React__default.ForwardRefExoticComponent<Omit<ImageProps, "ref"> & React__default.RefAttributes<HTMLSpanElement>>;

interface TitleBreadcrumbProps {
    title: string;
    path?: string;
    ctaText: string;
    handleOnClick?: () => void;
    sx?: SxProps<Theme>;
    slotProps?: {
        titleProps?: TypographyProps;
        breadcrumbProps?: BreadcrumbsProps;
        CTAProps?: CTAButtonProps;
    };
}
interface BreadcrumbProps$1 {
    path?: string;
    separator?: React.ReactNode;
    disabled?: boolean;
    sx?: SxProps<Theme>;
    slotProps?: {
        breadcrumbLinkProps?: LinkProps;
    };
}
interface CTAButtonProps {
    ctaText?: string;
    handleOnClick?: () => void;
    sx?: SxProps<Theme>;
    slotProps?: {
        buttonProps?: ButtonProps;
    };
}

declare function TitleBreadcrumb({ title, path, ctaText, handleOnClick, sx, slotProps, }: TitleBreadcrumbProps): React__default.JSX.Element;

declare function Breadcrumb({ path, separator, sx, slotProps, }: BreadcrumbProps$1): React__default.JSX.Element;

declare function CTAButton({ ctaText, handleOnClick, sx, slotProps, }: CTAButtonProps): React__default.JSX.Element;

type UserInfoProps = PaperProps & {
    profileUrl?: string;
    title?: string;
    primaryText?: string;
    secondaryText?: string;
    buttonText?: string;
    avatarSize?: "sm" | "md" | "lg";
    backgroundColor?: string;
    variant?: "elevation" | "outlined";
    width?: number;
    showCta?: boolean;
    onSubmit?: () => void;
    img?: string;
    textMaxWidth?: number;
    primaryTextIcon?: {
        iconSize?: number;
        icon: React.ElementType<any>;
        iconColor?: string;
        iconOpacity?: number;
    };
    secondaryTextIcon?: {
        iconSize?: number;
        icon: React.ElementType<any>;
        iconColor?: string;
        iconOpacity?: number;
    };
    slotProps?: UserInfoProps;
};

type NavItem = {
    title: string;
    path: string;
    icon?: ReactNode | ReactElement | OverridableComponent<any>;
    children?: NavItem[];
    disabled?: boolean;
};
type NavSection = {
    subheader: string;
    items: NavItem[];
};
type NavConfig = NavSection[];
type SideNavProps = {
    navItems: NavConfig;
    username?: string;
    userEmail?: string;
    role?: string;
    logoUrl?: string;
    onPress?: (path: string) => void;
    onSidebarToggle?: (event: SyntheticEvent) => void;
    select?: NavItem;
    useInfoProps?: Partial<UserInfoProps>;
    currentPath?: string;
};
type ItemType = {
    title: string;
    path: string;
    children?: ItemType[];
};
type SideBarItemProps = ItemType & {
    onSelected?: (path: string) => void;
    isSelected?: boolean;
};
type SideBarListProps = {
    item: NavItem;
    selected?: string;
    onSelected?: (path: string) => void;
};

declare const SideBar: ({ navItems, logoUrl, onPress, select, userEmail, username, onSidebarToggle, currentPath, ...props }: SideNavProps) => React$1.JSX.Element;

declare const UserInfo: (props: UserInfoProps) => React__default.JSX.Element;

type Order = "asc" | "desc";
interface IData {
    [key: string]: any;
}
interface IHeadCell {
    [key: string]: any;
}
interface IDefaultTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IData) => void;
    isSelectableRow: boolean;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    columns?: IHeadCell[];
}
interface IDefaultTableToolbarProps {
    numSelected: number;
}
interface IMenuItem {
    col: string;
    items: string[];
}
interface IDataTableProps {
    title?: string;
    columns: GridColDef<IHeadCell>[];
    data: IData[];
    getRowId?: (row: any) => string;
    rowsPerPageOptions?: number[];
    menuItems?: IMenuItem;
    isSearch?: boolean;
    isFilter?: boolean;
    isSelectableRows?: boolean;
    handleView?: (name: string) => void;
    handleEdit?: (name: string) => void;
    handleDelete?: (name: string) => void;
    rowComponent?: ElementType;
    tableTopComponent?: React.ReactNode;
    showToolbar?: boolean;
    onPaginationChange?: (pagination: {
        page: number;
        pageSize: number;
    }) => void;
    contentHeight?: number;
    density?: "compact" | "standard" | "comfortable";
    sx?: SxProps;
    filterByColumn?: boolean;
    handleAdd?: () => void;
    rowCount?: number;
    handleTableBtnClick?: () => void;
    isTableBtnDisabled?: boolean;
    tableBtnText?: string;
    tableBtnIcon?: React.ReactNode;
}
interface IActionButtonsProps {
    name: string;
    handleView: (name: string) => void;
    handleEdit: (name: string) => void;
    handleDelete: (name: string) => void;
}
interface ISearchBoxProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: () => void;
}
interface IGenericTableRowProps<T> {
    row: T;
}

declare function DataTable(props: IDataTableProps & DataGridProps): React__default.JSX.Element;

interface IFallbackProps {
    variant: "400" | "401" | "403" | "404" | "500" | "503";
    helpText?: string;
    ctaLabel?: string;
    route: string;
    handleCta?: (event: object) => void;
    title?: string;
    description?: string;
    image?: string;
}

declare function Fallback(props: PropsWithChildren<IFallbackProps>): React__default.JSX.Element;

type ConfirmDialogProps = {
    title: string;
    description: string;
    variant: "error" | "warning" | "info" | "success";
    confirmationText?: string;
    cancellationText?: string;
    allowClose?: boolean;
    buttonOrder?: string[];
    hideCancelButton?: boolean;
    children?: ReactNode;
    content?: ReactNode;
    buttonText: string;
    onCancel: () => void;
    onConfirm: () => void;
};

declare const BaseConfirmDialog: (props: ConfirmDialogProps) => React__default.JSX.Element;
declare const ConfirmDialog: (props: ConfirmDialogProps) => React__default.JSX.Element;

interface CopyrightComponentProps {
    titleText?: string;
    companyName?: string;
    reservedText?: string;
    sx?: SxProps<Theme$1>;
    slotProps?: {
        titleTextProps?: TypographyProps;
        companyNameProps?: TypographyProps;
        reservedTextProps?: TypographyProps;
        yearTextProps?: TypographyProps;
    };
}

declare function Copyright({ sx, titleText, companyName, reservedText, slotProps }: CopyrightComponentProps): ReactNode;

type AppBarProps = AppBarProps$1 & {
    onSearch?: (event: React.ChangeEvent) => void;
    messages?: number;
    onMessageClick?: (event: SyntheticEvent) => void;
    notifications?: number;
    onNotificationClick?: (event: SyntheticEvent) => void;
    onAccountClick?: (event: SyntheticEvent) => void;
    isMessage?: boolean;
    isNotification?: boolean;
    isAccount?: boolean;
    isFlag?: boolean;
    countryCode?: string;
    onToggleDrawerClick?: (event: SyntheticEvent) => void;
    isDrawerOpen?: boolean;
    onLogoutClick?: (event: object) => void;
};

declare function AppBar({ messages, notifications, onAccountClick, onMessageClick, onNotificationClick, onSearch, isDrawerOpen, onToggleDrawerClick, onLogoutClick, ...props }: AppBarProps): React__default.ReactNode;

type BasePageProps = {
    sideNavProps?: Partial<SideNavProps>;
    sideBarNavItems: Pick<SideNavProps, "navItems">;
    appBarProps?: Partial<AppBarProps>;
    profileUrl?: string;
    isCopyrightVisible?: boolean;
    ismessage?: boolean;
    isnotification?: boolean;
    isaccount?: boolean;
};

declare const BaseLayout: {
    ({ children }: PropsWithChildren): React__default.JSX.Element;
    LeftSidePane: React__default.MemoExoticComponent<({ children, isOpen }: {
        children?: React__default.ReactNode;
    } & {
        isOpen: boolean;
    }) => React__default.JSX.Element>;
    AppBar: ({ children, isOpen }: {
        children?: React__default.ReactNode;
    } & {
        isOpen: boolean;
    }) => React__default.JSX.Element;
    Content: ({ children, isOpen }: {
        children?: React__default.ReactNode;
    } & {
        isOpen: boolean;
    }) => React__default.JSX.Element;
    RightSidePane: ({ children }: PropsWithChildren) => React__default.JSX.Element;
    Footer: ({ children }: PropsWithChildren) => React__default.JSX.Element;
};
declare function BasePage(props: PropsWithChildren<BasePageProps>): React__default.JSX.Element;

type LoginFromSlotProps = {
    socialLoginToolTips?: {
        facebook: string;
        google: string;
        twitter: string;
    };
    emailFieldProps?: Partial<FilledInputProps>;
    passwordFieldProps?: Partial<FilledInputProps>;
    passwordFieldIconProps?: Partial<FilledInputProps>;
};
type LoginFormSlots = {
    passwordFieldIcon: React.ElementType;
};
type ErrorContract = {
    code: 'username' | 'password' | 'other';
    message: string;
};
type LoginFormProps = {
    title?: string;
    header?: string;
    emailLabel?: string;
    passwordLabel?: string;
    forgotPasswordLabel?: string;
    loginButtonLabel?: string;
    socialLoginProviders?: string[] | string;
    showRegister?: boolean;
    onRegisterClick?: (event: object) => void;
    onLoginClick?: (event: object) => Promise<void>;
    errors?: ErrorContract[];
    showForgotPassword?: boolean;
    onForgotPasswordClick?: (event: object) => void;
    onSocialProviderClick?: (provider: string, event: object) => void;
    slotProps?: LoginFromSlotProps;
    slots?: LoginFormSlots;
};
type ILoginFormState = {
    email: string;
    password: string;
};
type LoginFromEvent = ILoginFormState;

declare function LoginForm({ emailLabel, forgotPasswordLabel, loginButtonLabel, passwordLabel, title, showRegister, showForgotPassword, socialLoginProviders, errors, ...props }: LoginFormProps): ReactNode;

interface VerifyOTPProps {
    icon?: string;
    otpValues: (...props: any) => any;
    HeaderText?: string;
    contentText?: string;
    resendText?: {
        text?: {
            value: string;
            color?: string;
            size?: number;
        };
        subText?: {
            value: string;
            color?: string;
            size?: number;
        };
        resendTextOnClick?: (...props: any) => void;
    };
    bottomAction?: {
        label: string;
        onClickBottomAction: (...props: any) => any;
    };
    submitButton?: SubmitButton;
    inputs: string[];
}
interface SubmitButton {
    label?: string;
    color?: string;
    backgroundColor?: string;
}

declare const VerifyOtp: ({ icon, otpValues, HeaderText, contentText, resendText, bottomAction, submitButton, inputs, }: VerifyOTPProps) => React__default.JSX.Element;

type ForgotPasswordPageProps = {
    title?: string;
    description?: string;
    inputPlaceholderText?: string;
    primaryBtnText?: string;
    secondaryBtnText?: string;
    image?: string | ReactNode;
    onPrimaryBtnClick?: (event: object) => void;
    onSecondaryBtnClick?: (event: object) => void;
    slotProps?: ForgotPasswordPageSlotProps;
    variant?: "elevation" | "outlined" | "soft";
    linkAs?: any;
};
type ForgotPasswordPageSlotProps = {
    inputFieldProps?: IInputFieldProps;
    primaryBtnProps?: IButtonProps;
    secondaryBtnProps?: IButtonProps;
};
type IInputFieldProps = {
    defaultEmail?: string;
};
type IButtonProps = {
    email: string;
};

declare const ForgotPasswordPage: FC<ForgotPasswordPageProps>;

type NavigationSubItem = {
    id: number;
    label: string;
    path: string;
};
type NavigationItem = {
    id: number;
    label: string;
    icon: ReactNode;
    path: string;
    subItems?: NavigationSubItem[];
};
type NavigationSection = {
    id: number;
    subheader: string;
    items: NavigationItem[];
};
type SideBarProps = {
    items: NavigationSection[] | undefined;
    onItemClick?: (index: number, path?: string) => void;
    onSubItemClick?: (index: number, parentIndex: number, path?: string, subPath?: string) => void;
    useInfoProps?: Partial<UserInfoProps>;
};
interface BreadcrumbPaths {
    pageName?: string | undefined;
    path?: string | undefined;
}
type BreadcrumbProps = {
    pageTitle: string | undefined;
    pageNavigation?: BreadcrumbPaths[] | undefined;
    onAddClick?: () => void;
    onFullScreenClick?: () => void;
    onLinkClick?: (path: string | undefined) => void;
    icon?: ReactNode;
};
type IslandLayoutProps = {
    sideBarProps?: Partial<SideBarProps>;
    breadcrumbProps?: Partial<BreadcrumbProps>;
    crystalAppbarProps?: Partial<CrystalAppbarProps>;
};
type CrystalAppbarProps = {
    onProfileClick?: () => void;
    onSettingsClick?: () => void;
    onLogoutClick?: () => void;
    username?: string;
    userImage?: string;
    userRole?: string;
};
type IslandLayoutWithBreadscrumbProps = {
    breadcrumbsProps: BreadcrumbProps;
    islandLayoutProps: IslandLayoutProps;
    crystalAppbarProps: CrystalAppbarProps;
};

declare function BreadcrumbNavigation(props: BreadcrumbProps): React__default.JSX.Element;
declare function Sidebar(props: SideBarProps): React__default.JSX.Element;
declare const IslandLayout: React__default.ForwardRefExoticComponent<IslandLayoutProps & {
    children?: React__default.ReactNode;
} & React__default.RefAttributes<Element>>;
declare function IslandLayoutWithBreadscrumb(props: PropsWithChildren<IslandLayoutWithBreadscrumbProps>): React__default.JSX.Element;

interface LoginLayoutComponentProps {
    titleText?: string;
    companyLogo?: string;
    LoginComponent?: ReactNode;
}

declare function LoginLayout({ titleText, companyLogo, LoginComponent }: LoginLayoutComponentProps): ReactNode;

type DataCardTypes = CardProps & {
    title: string;
    value: string;
    titleColor?: string;
    valueColor?: string;
    backgroundColor?: string;
    sx?: SxProps;
    onClickFun?: () => void;
};
declare const DataCard: (props: DataCardTypes) => React__default.JSX.Element;

type GaugeChartTypes = CardProps & {
    title?: string;
    value?: number;
    percentage?: number;
    titleColor?: string;
    valueColor?: string;
    backgroundColor?: string;
    textColor?: string;
    gaugeSize?: GaugeSize;
    onClickFun?: () => void;
};
type GaugeSize = {
    height?: number;
    width?: number;
};
declare const GaugeChart: (props: GaugeChartTypes) => React__default.JSX.Element;

type LineChartTypes = CardProps & {
    title?: string;
    titleColor?: string;
    amount?: string;
    percentage?: number;
    height?: number;
    width?: number;
    lineColor?: string;
    chartData?: ChartData[];
};
interface ChartData {
    label: string;
    xLabels: string[];
    yData: number[];
}
declare const LineChartComponent: (props: LineChartTypes) => React__default.JSX.Element;

export { AppBar, type BadgeSizeValue, BadgeStatus, type BadgeStatusProps, type BadgeStatusValue, BaseConfirmDialog, BaseLayout, BasePage, Breadcrumb, BreadcrumbNavigation, type BreadcrumbProps$1 as BreadcrumbProps, CTAButton, type CTAButtonProps, ConfirmDialog, Copyright, type CopyrightComponentProps, CustomAvatar, CustomAvatarGroup, type CustomAvatarGroupProps, type CustomAvatarProps, DataCard, DataTable, type ErrorContract, Fallback, ForgotPasswordPage, GaugeChart, type IActionButtonsProps, type IData, type IDataTableProps, type IDefaultTableProps, type IDefaultTableToolbarProps, type IFallbackProps, type IGenericTableRowProps, type IHeadCell, type ILoginFormState, type ISearchBoxProps, Image, type ImageProps, type ImageRatio, IslandLayout, IslandLayoutWithBreadscrumb, type ItemType, LineChartComponent, LoginForm, type LoginFormProps, type LoginFormSlots, type LoginFromEvent, type LoginFromSlotProps, LoginLayout, type LoginLayoutComponentProps, Logo, type LogoProps, type NavConfig, type NavItem, type NavSection, type Order, SideBar, type SideBarItemProps, type SideBarListProps, type SideNavProps, Sidebar, TitleBreadcrumb, type TitleBreadcrumbProps, UserInfo, VerifyOtp };
