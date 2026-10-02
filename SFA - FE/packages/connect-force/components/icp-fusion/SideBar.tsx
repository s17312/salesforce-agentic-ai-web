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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BusinessIcon from '@mui/icons-material/Business';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useRouter, usePathname } from 'next/navigation';

export interface SideBarProps {
  navItems?: any[];
  items?: any[];
  username?: string;
  userEmail?: string;
  role?: string;
  logoUrl?: string;
  onPress?: (path: string) => void;
  onItemClick?: (index: number, path?: string) => void;
  onSubItemClick?: (index: number, parentIdx: number, path: string, subPathpath: string) => void;
  onSidebarToggle?: (event: any) => void;
  currentPath?: string;
  [key: string]: any;
}

const getSidebarIcon = (title: string, customIcon?: any) => {
  if (customIcon) return customIcon;
  const name = (title || '').toLowerCase();
  if (name.includes('home') || name.includes('dashboard')) return <DashboardIcon fontSize="small" />;
  if (name.includes('distributor')) return <LocalShippingIcon fontSize="small" />;
  if (name.includes('outlet')) return <StorefrontIcon fontSize="small" />;
  if (name.includes('product')) return <Inventory2Icon fontSize="small" />;
  if (name.includes('warehouse')) return <WarehouseIcon fontSize="small" />;
  if (name.includes('vehicle')) return <DirectionsCarIcon fontSize="small" />;
  if (name.includes('company')) return <BusinessIcon fontSize="small" />;
  if (name.includes('route')) return <AltRouteIcon fontSize="small" />;
  if (name.includes('unit') || name.includes('sales')) return <FormatListBulletedIcon fontSize="small" />;
  if (name.includes('grn') || name.includes('type')) return <ListAltIcon fontSize="small" />;
  return <DashboardIcon fontSize="small" />;
};

export function SideBar({
  navItems = [],
  items = [],
  onPress,
  onItemClick,
  onSubItemClick,
  currentPath,
}: SideBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  const sections = navItems.length > 0 ? navItems : items;

  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({
    '1-0-Distributor': true,
  });

  const handleToggleSubMenu = (key: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleItemClick = (item: any, itemIdx: number, sectionIdx: number) => {
    if (item.subItems && item.subItems.length > 0) {
      handleToggleSubMenu(`${sectionIdx}-${itemIdx}-${item.title || item.label}`);
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

  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        bgcolor: '#0f1338',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Outer sidebar does not scroll!
      }}
    >
      {/* Scrollable Nav List Section */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          px: 0.5,
          pt: 1,
          pb: 1,
          '&::-webkit-scrollbar': {
            width: '5px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '3px',
          },
        }}
      >
        <List disablePadding>
          {sections.map((section, sIdx) => (
            <React.Fragment key={sIdx}>
              {section.subheader && (
                <Typography
                  variant="overline"
                  sx={{
                    px: 2.5,
                    pt: 2,
                    pb: 0.8,
                    display: 'block',
                    color: '#9da8d8',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    letterSpacing: '0.5px',
                    textTransform: 'none',
                  }}
                >
                  {section.subheader}
                </Typography>
              )}
              {(section.items || []).map((item: any, iIdx: number) => {
                const itemTitle = item.title || item.label || '';
                const menuKey = `${sIdx}-${iIdx}-${itemTitle}`;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isSubOpen = openSubMenus[menuKey] !== undefined ? !!openSubMenus[menuKey] : (hasSubItems && (itemTitle.toLowerCase().includes('distributor')));
                const isSelected = activePath === item.path || (item.path && activePath?.startsWith(item.path));

                return (
                  <React.Fragment key={iIdx}>
                    <ListItem disablePadding sx={{ mb: 0.6 }}>
                      <ListItemButton
                        selected={isSelected}
                        onClick={() => handleItemClick(item, iIdx, sIdx)}
                        sx={{
                          borderRadius: '10px', // Reduced border radius for modern sleek look (Point 1)
                          mx: 1.5,
                          px: 1.8,
                          py: 0.8,
                          bgcolor: isSelected ? '#4b5588' : '#2f3563',
                          color: isSelected ? '#ffffff' : '#d0d5f2',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 3px 10px rgba(0,0,0,0.12)' : 'none',
                          '&:hover': {
                            bgcolor: isSelected ? '#576399' : '#3b4278',
                            color: '#ffffff',
                            '& .MuiListItemIcon-root': { color: '#ffffff' },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 32,
                            color: isSelected ? '#ffffff' : '#d0d5f2',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {getSidebarIcon(itemTitle, item.icon)}
                        </ListItemIcon>
                        <ListItemText
                          primary={itemTitle}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.875rem',
                          }}
                        />
                        {hasSubItems && (
                          <Box sx={{ display: 'flex', alignItems: 'center', color: isSelected ? '#ffffff' : '#d0d5f2' }}>
                            {isSubOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                          </Box>
                        )}
                      </ListItemButton>
                    </ListItem>

                    {hasSubItems && (
                      <Collapse in={isSubOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ mb: 1, pl: 3.2 }}>
                          {item.subItems.map((subItem: any, subIdx: number) => {
                            const subTitle = subItem.label || subItem.title || '';
                            const isSubSelected = activePath === subItem.path;
                            return (
                              <ListItemButton
                                key={subIdx}
                                selected={isSubSelected}
                                onClick={() => handleSubItemClick(subItem, subIdx, iIdx, item.path)}
                                sx={{
                                  py: 0.5,
                                  px: 1.4,
                                  my: 0.3,
                                  borderRadius: '8px', // Reduced border radius for sub-items
                                  color: isSubSelected ? '#ffffff' : '#d0d5f2',
                                  bgcolor: isSubSelected ? 'rgba(255,255,255,0.15)' : 'transparent',
                                  '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    color: '#ffffff',
                                  },
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: '50%',
                                    bgcolor: isSubSelected ? '#ffffff' : '#d0d5f2',
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

      {/* Solid Static Footer - VELORA Branding (Point 2 & Point 3) */}
      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          bgcolor: '#0f1338', // Solid static background
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Typography variant="caption" display="block" sx={{ color: '#8890b5', fontSize: '0.7rem' }}>
          Designed & Developed by
        </Typography>
        <Typography
          variant="subtitle2"
          display="block"
          sx={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.9rem',
            letterSpacing: '1.5px',
            my: 0.2,
            fontFamily: '"Public Sans", sans-serif',
          }}
        >
          VELORA
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: '#8890b5', fontSize: '0.68rem', lineHeight: 1.2 }}>
          Building software that moves businesses forward.
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: '#666d93', fontSize: '0.65rem', mt: 0.5 }}>
          2024 © All rights reserved
        </Typography>
      </Box>
    </Box>
  );
}

export const Sidebar = SideBar;
export default SideBar;
