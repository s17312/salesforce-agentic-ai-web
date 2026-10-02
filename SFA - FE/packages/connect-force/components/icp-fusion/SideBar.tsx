import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useRouter, usePathname } from 'next/navigation';
import { Logo } from './CommonComponents';

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

export function SideBar({
  navItems = [],
  items = [],
  onPress,
  onItemClick,
  onSubItemClick,
  currentPath,
}: SideBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  const sections = navItems.length > 0 ? navItems : items;

  // Track open state for expandable items with subItems
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  const handleToggleSubMenu = (key: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleItemClick = (item: any, itemIdx: number, sectionIdx: number) => {
    if (item.subItems && item.subItems.length > 0) {
      handleToggleSubMenu(`${sectionIdx}-${itemIdx}-${item.label}`);
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
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: alpha(theme.palette.text.primary, 0.15),
          borderRadius: '3px',
        },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Logo />
      </Box>
      <Divider />
      <List sx={{ pt: 1, pb: 4 }}>
        {sections.map((section, sIdx) => (
          <React.Fragment key={sIdx}>
            {section.subheader && (
              <Typography
                variant="overline"
                sx={{
                  px: 3,
                  pt: 2,
                  pb: 0.5,
                  display: 'block',
                  color: theme.palette.text.secondary,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.8px',
                }}
              >
                {section.subheader}
              </Typography>
            )}
            {(section.items || []).map((item: any, iIdx: number) => {
              const menuKey = `${sIdx}-${iIdx}-${item.label}`;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isSubOpen = !!openSubMenus[menuKey];
              const isSelected = activePath === item.path;

              return (
                <React.Fragment key={iIdx}>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => handleItemClick(item, iIdx, sIdx)}
                      sx={{
                        borderRadius: 1.5,
                        mx: 1.5,
                        my: 0.3,
                        px: 1.5,
                        py: 0.8,
                        '&.Mui-selected': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          '& .MuiListItemIcon-root': {
                            color: theme.palette.primary.main,
                          },
                        },
                        '&:hover': {
                          bgcolor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: theme.palette.text.secondary }}>
                        {item.icon || <DashboardIcon fontSize="small" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title || item.label}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.875rem',
                        }}
                      />
                      {hasSubItems && (isSubOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
                    </ListItemButton>
                  </ListItem>

                  {hasSubItems && (
                    <Collapse in={isSubOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subItems.map((subItem: any, subIdx: number) => {
                          const isSubSelected = activePath === subItem.path;
                          return (
                            <ListItemButton
                              key={subIdx}
                              selected={isSubSelected}
                              onClick={() => handleSubItemClick(subItem, subIdx, iIdx, item.path)}
                              sx={{
                                pl: 5.5,
                                pr: 2,
                                py: 0.6,
                                mx: 1.5,
                                my: 0.2,
                                borderRadius: 1.5,
                                '&.Mui-selected': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                                  color: theme.palette.primary.main,
                                  fontWeight: 700,
                                },
                                '&:hover': {
                                  bgcolor: theme.palette.action.hover,
                                },
                              }}
                            >
                              <ListItemText
                                primary={subItem.label || subItem.title}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  fontSize: '0.8125rem',
                                  fontWeight: isSubSelected ? 700 : 500,
                                  color: isSubSelected ? theme.palette.primary.main : theme.palette.text.primary,
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
  );
}

export const Sidebar = SideBar;
export default SideBar;
