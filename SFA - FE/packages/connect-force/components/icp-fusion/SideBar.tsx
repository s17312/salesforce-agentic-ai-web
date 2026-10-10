import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useRouter, usePathname } from 'next/navigation';
import { alpha } from '@mui/material/styles';
import { useThemeContext } from '@/context/ThemeContext';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { PATH_DASHBOARD } from '@/routes/paths';

export interface SideBarProps {
  navItems?: any[];
  items?: any[];
  username?: string;
  userEmail?: string;
  role?: string;
  logoUrl?: string;
  isCollapsed?: boolean;
  onPress?: (path: string) => void;
  onItemClick?: (index: number, path?: string) => void;
  onSubItemClick?: (index: number, parentIdx: number, path: string, subPathpath: string) => void;
  onSidebarToggle?: (event: any) => void;
  currentPath?: string;
  [key: string]: any;
}

const getSidebarIcon = (title: string, customIcon?: any, googleIcon?: string) => {
  if (googleIcon) return <GoogleIcon name={googleIcon} size={22} />;
  const name = (title || '').toLowerCase();
  if (name.includes('home') || name.includes('dashboard')) return <GoogleIcon name="dashboard" size={22} />;
  if (name.includes('business category')) return <GoogleIcon name="category" size={22} />;
  if (name.includes('company mapping') || (name.includes('company') && name.includes('map'))) return <GoogleIcon name="dataset_linked" size={22} />;
  if (name.includes('distributor mapping')) return <GoogleIcon name="local_shipping" size={22} />;
  if (name.includes('representative mapping')) return <GoogleIcon name="badge" size={22} />;
  if (name.includes('route mapping')) return <GoogleIcon name="alt_route" size={22} />;
  if (name.includes('product mapping')) return <GoogleIcon name="inventory_2" size={22} />;
  if (name.includes('discount mapping')) return <GoogleIcon name="percent" size={22} />;
  if (name.includes('mapping')) return <GoogleIcon name="dataset_linked" size={22} />;
  if (name.includes('distributor')) return <GoogleIcon name="local_shipping" size={22} />;
  if (name.includes('outlet')) return <GoogleIcon name="storefront" size={22} />;
  if (name.includes('product')) return <GoogleIcon name="inventory_2" size={22} />;
  if (name.includes('warehouse')) return <GoogleIcon name="warehouse" size={22} />;
  if (name.includes('vehicle')) return <GoogleIcon name="directions_car" size={22} />;
  if (name.includes('company')) return <GoogleIcon name="business" size={22} />;
  if (name.includes('route')) return <GoogleIcon name="alt_route" size={22} />;
  if (name.includes('unit') || name.includes('sales')) return <GoogleIcon name="format_list_bulleted" size={22} />;
  if (name.includes('grn') || name.includes('type')) return <GoogleIcon name="list_alt" size={22} />;
  if (name.includes('account')) return <GoogleIcon name="account_box" size={22} />;
  if (name.includes('report')) return <GoogleIcon name="bar_chart" size={22} />;
  if (name.includes('discount')) return <GoogleIcon name="percent" size={22} />;
  if (name.includes('setting') || name.includes('config')) return <GoogleIcon name="settings" size={22} />;
  if (customIcon) return customIcon;
  return <GoogleIcon name="dashboard" size={22} />;
};

export function SideBar({
  navItems = [],
  items = [],
  isCollapsed = false,
  onPress,
  onItemClick,
  onSubItemClick,
  currentPath,
}: SideBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activePath = currentPath || pathname;
  const { currentTheme } = useThemeContext();

  const sections = navItems.length > 0 ? navItems : items;

  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({
    '1-0-Distributor': true,
  });

  // Anchor for popover sub-menu in collapsed mini mode
  const [popoverAnchor, setPopoverAnchor] = useState<{
    el: HTMLElement;
    item: any;
    sIdx: number;
    iIdx: number;
  } | null>(null);

  const handleToggleSubMenu = (key: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleItemClick = (
    item: any,
    itemIdx: number,
    sectionIdx: number,
    event?: React.MouseEvent<HTMLElement>
  ) => {
    if (item.subItems && item.subItems.length > 0) {
      if (isCollapsed && event) {
        setPopoverAnchor({
          el: event.currentTarget,
          item,
          sIdx: sectionIdx,
          iIdx: itemIdx,
        });
      } else {
        handleToggleSubMenu(`${sectionIdx}-${itemIdx}-${item.title || item.label}`);
      }
    } else if (item.path) {
      if (onItemClick) {
        onItemClick(itemIdx, item.path);
      } else if (onPress) {
        onPress(item.path);
      } else {
        router.push(item.path);
      }
    }
  };

  const handleSubItemClick = (
    subItem: any,
    subIdx: number,
    parentIdx: number,
    itemPath?: string
  ) => {
    const path = subItem.path || itemPath;
    if (path) {
      if (onSubItemClick) {
        onSubItemClick(subIdx, parentIdx, itemPath || '', path);
      } else if (onPress) {
        onPress(path);
      } else {
        router.push(path);
      }
    }
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const clean = (p?: string) => (p || '').replace(/\/+$/, '');
  const cActive = clean(activePath);

  return (
    <Box
      sx={{
        width: '100%',
        flexShrink: 0,
        bgcolor: currentTheme?.sidebarBg || '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 'inherit',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
      }}
    >
      {/* Scrollable Nav List Section */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: isCollapsed ? 0 : 0.5,
          pt: 1,
          pb: 1,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
            borderRadius: '2px',
          },
        }}
      >
        <List disablePadding>
          {sections.map((section, sIdx) => (
            <React.Fragment key={sIdx}>
              {section.subheader && (
                isCollapsed ? (
                  <Box sx={{ my: 1, display: 'flex', justifyContent: 'center' }}>
                    <Box
                      sx={{
                        width: 32,
                        height: '1px',
                        bgcolor: alpha(currentTheme?.primaryMain || '#6366f1', 0.15),
                      }}
                    />
                  </Box>
                ) : (
                  <Typography
                    variant="overline"
                    sx={{
                      px: 2.5,
                      pt: 2,
                      pb: 0.8,
                      display: 'block',
                      color: currentTheme?.textSecondary || '#64748b',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      letterSpacing: '0.5px',
                      textTransform: 'none',
                    }}
                  >
                    {section.subheader}
                  </Typography>
                )
              )}
              {(section.items || []).map((item: any, iIdx: number) => {
                const itemTitle = item.title || item.label || '';
                const menuKey = `${sIdx}-${iIdx}-${itemTitle}`;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isSubOpen =
                  openSubMenus[menuKey] !== undefined
                    ? !!openSubMenus[menuKey]
                    : hasSubItems && itemTitle.toLowerCase().includes('distributor');

                const cItem = clean(item.path);
                const isHomeItem =
                  cItem === '/dashboard' ||
                  itemTitle.toLowerCase() === 'home';

                const isSelected = isHomeItem
                  ? cActive === '/dashboard' || cActive === '/dashboard/home' || cActive === clean(PATH_DASHBOARD.root)
                  : Boolean(cItem) && (cActive === cItem || cActive.startsWith(cItem + '/'));

                return (
                  <React.Fragment key={iIdx}>
                    <ListItem
                      disablePadding
                      sx={{
                        mb: 0.6,
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        px: 0,
                      }}
                    >
                      <Tooltip
                        title={isCollapsed ? itemTitle : ''}
                        placement="right"
                        arrow
                        disableHoverListener={!isCollapsed}
                      >
                        <ListItemButton
                          selected={isSelected}
                          onClick={(e) => handleItemClick(item, iIdx, sIdx, e)}
                          sx={{
                            borderRadius: '10px',
                            mx: isCollapsed ? 1 : 1.5,
                            px: isCollapsed ? '0 !important' : 1.8,
                            py: 0.8,
                            minHeight: 44,
                            height: 44,
                            width: isCollapsed ? 'calc(100% - 16px)' : 'auto',
                            justifyContent: isCollapsed ? 'center !important' : 'flex-start',
                            alignItems: 'center !important',
                            display: 'flex !important',
                            bgcolor: isSelected
                              ? currentTheme?.activePill || currentTheme?.primaryMain || '#6366f1'
                              : currentTheme?.unselectedPill || '#f1f5f9',
                            color: isSelected ? '#ffffff' : currentTheme?.textPrimary || '#1e293b',
                            border: isSelected
                              ? `1px solid ${currentTheme?.primaryMain || '#6366f1'}`
                              : `1px solid ${alpha(currentTheme?.primaryMain || '#6366f1', 0.12)}`,
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected
                              ? `0 3px 12px ${alpha(currentTheme?.primaryMain || '#6366f1', 0.3)}`
                              : 'none',
                            '&:hover': {
                              bgcolor: isSelected
                                ? currentTheme?.primaryDark || '#4f46e5'
                                : alpha(currentTheme?.primaryMain || '#6366f1', 0.14),
                              color: isSelected ? '#ffffff' : currentTheme?.primaryMain || '#6366f1',
                              '& .MuiListItemIcon-root': {
                                color: isSelected ? '#ffffff' : currentTheme?.primaryMain || '#6366f1',
                              },
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: isCollapsed ? '0 !important' : 32,
                              width: isCollapsed ? '100% !important' : 'auto',
                              m: isCollapsed ? '0 !important' : 'unset',
                              p: 0,
                              justifyContent: 'center !important',
                              alignItems: 'center !important',
                              display: 'flex !important',
                              color: isSelected ? '#ffffff' : (currentTheme?.primaryMain || '#6366f1'),
                              '& svg, & .material-symbols-rounded, & .material-symbols-outlined, & span': {
                                m: '0 auto !important',
                                display: 'block !important',
                              },
                            }}
                          >
                            {getSidebarIcon(itemTitle, item.icon, item.googleIcon)}
                          </ListItemIcon>

                          {!isCollapsed && (
                            <>
                              <ListItemText
                                primary={itemTitle}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  fontWeight: isSelected ? 700 : 600,
                                  fontSize: '0.875rem',
                                }}
                              />
                              {hasSubItems && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: isSelected
                                      ? '#ffffff'
                                      : currentTheme?.textSecondary || '#64748b',
                                  }}
                                >
                                  {isSubOpen ? (
                                    <KeyboardArrowUpIcon fontSize="small" />
                                  ) : (
                                    <ExpandMoreIcon fontSize="small" />
                                  )}
                                </Box>
                              )}
                            </>
                          )}
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>

                    {!isCollapsed && hasSubItems && (
                      <Collapse in={isSubOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ mb: 1, pl: 3.2 }}>
                          {item.subItems.map((subItem: any, subIdx: number) => {
                            const subTitle = subItem.label || subItem.title || '';
                            const cSub = clean(subItem.path);
                            const isSubSelected = cActive === cSub;
                            return (
                              <ListItemButton
                                key={subIdx}
                                selected={isSubSelected}
                                onClick={() =>
                                  handleSubItemClick(subItem, subIdx, iIdx, item.path)
                                }
                                sx={{
                                  py: 0.5,
                                  px: 1.4,
                                  my: 0.3,
                                  borderRadius: '8px',
                                  color: isSubSelected
                                    ? currentTheme?.primaryMain || '#6366f1'
                                    : currentTheme?.textPrimary || '#475569',
                                  bgcolor: isSubSelected
                                    ? currentTheme?.headerTint || '#ede9fe'
                                    : 'transparent',
                                  '&:hover': {
                                    bgcolor: alpha(
                                      currentTheme?.primaryMain || '#6366f1',
                                      0.08
                                    ),
                                    color: currentTheme?.primaryMain || '#6366f1',
                                  },
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: isSubSelected
                                      ? currentTheme?.primaryMain || '#6366f1'
                                      : currentTheme?.textSecondary || '#94a3b8',
                                    mr: 1.5,
                                    display: 'inline-block',
                                    flexShrink: 0,
                                  }}
                                />
                                <ListItemText
                                  primary={subTitle}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    fontSize: '0.8125rem',
                                    fontWeight: isSubSelected ? 700 : 500,
                                  }}
                                />
                              </ListItemButton>
                            );
                          })}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Solid Static Footer - VELORA Branding (Cleaned without description & 2027 copyright) */}
      <Box
        sx={{
          p: isCollapsed ? 1.2 : 2,
          textAlign: 'center',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          bgcolor: currentTheme?.sidebarBg || '#ffffff',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
          borderBottomLeftRadius: 'inherit',
          borderBottomRightRadius: 'inherit',
          transition: 'background-color 0.3s ease',
        }}
      >
        {isCollapsed ? (
          <Tooltip title="VELORA 2027" placement="right">
            <Box
              sx={{
                width: 38,
                height: 38,
                mx: 'auto',
                borderRadius: '10px',
                bgcolor: currentTheme?.headerTint || '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
                boxShadow: `0 2px 6px ${alpha(currentTheme?.primaryMain || '#6366f1', 0.15)}`,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: currentTheme?.primaryMain || '#6366f1',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                }}
              >
                V
              </Typography>
            </Box>
          </Tooltip>
        ) : (
          <>
            <Typography
              variant="caption"
              display="block"
              sx={{ color: '#64748b', fontSize: '0.7rem' }}
            >
              Designed & Developed by
            </Typography>
            <Typography
              variant="subtitle2"
              display="block"
              sx={{
                color: currentTheme?.textPrimary || '#0f172a',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '1.5px',
                my: 0.2,
                fontFamily: '"Public Sans", sans-serif',
              }}
            >
              VELORA
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ color: '#94a3b8', fontSize: '0.65rem', mt: 0.5 }}
            >
              2027 © All rights reserved
            </Typography>
          </>
        )}
      </Box>

      {/* Popover Menu for Sub-items in Collapsed Mode */}
      <Menu
        anchorEl={popoverAnchor?.el}
        open={Boolean(popoverAnchor)}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          elevation: 4,
          sx: {
            ml: 1,
            minWidth: 190,
            borderRadius: '12px',
            border: `1px solid ${alpha(currentTheme?.primaryMain || '#6366f1', 0.15)}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            bgcolor: currentTheme?.sidebarBg || '#ffffff',
            p: 0.5,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 800, color: currentTheme?.textPrimary || '#0f172a' }}
          >
            {popoverAnchor?.item?.title || popoverAnchor?.item?.label}
          </Typography>
        </Box>
        {popoverAnchor?.item?.subItems?.map((subItem: any, subIdx: number) => {
          const subTitle = subItem.label || subItem.title || '';
          const cSub = clean(subItem.path);
          const isSubSelected = cActive === cSub;
          return (
            <MenuItem
              key={subIdx}
              onClick={() => {
                handleSubItemClick(
                  subItem,
                  subIdx,
                  popoverAnchor.iIdx,
                  popoverAnchor.item.path
                );
                handlePopoverClose();
              }}
              sx={{
                fontSize: '0.85rem',
                my: 0.3,
                borderRadius: '8px',
                fontWeight: isSubSelected ? 700 : 500,
                color: isSubSelected
                  ? currentTheme?.primaryMain || '#6366f1'
                  : currentTheme?.textPrimary || '#0f172a',
                bgcolor: isSubSelected
                  ? currentTheme?.headerTint || '#ede9fe'
                  : 'transparent',
                '&:hover': {
                  bgcolor: alpha(currentTheme?.primaryMain || '#6366f1', 0.08),
                  color: currentTheme?.primaryMain || '#6366f1',
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: isSubSelected
                    ? currentTheme?.primaryMain || '#6366f1'
                    : '#94a3b8',
                  mr: 1.5,
                  display: 'inline-block',
                }}
              />
              {subTitle}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}

export const Sidebar = SideBar;
export default SideBar;
