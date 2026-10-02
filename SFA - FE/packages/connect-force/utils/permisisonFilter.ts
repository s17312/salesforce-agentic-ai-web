// Utility to flatten permissions for quick lookup
export const getAllowedMenuPaths = (rolePermission: any[]) => {
  const allowedPaths = new Set<string>();

  // Default core menu paths
  allowedPaths.add("Home");
  allowedPaths.add("Dashboard");

  if (Array.isArray(rolePermission)) {
    rolePermission.forEach((module) => {
      if (module.moduleName) {
        allowedPaths.add(module.moduleName);
      }
      module.menus?.forEach((menu: any) => {
        if (menu.menuName) {
          allowedPaths.add(menu.menuName);
        }
        menu.subMenus?.forEach((subMenu: any) => {
          if (subMenu.subMenuName) {
            allowedPaths.add(subMenu.subMenuName);
          }
          subMenu.permissions?.forEach((perm: any) => {
            if (perm.permission) {
              allowedPaths.add(subMenu.subMenuName);
              allowedPaths.add(menu.menuName);
              allowedPaths.add(module.moduleName);
            }
          });
        });
      });
    });
  }

  return allowedPaths;
};

// Recursively filter navItems
export const filterNavItemsByPermission = (
  navItems: any[],
  allowedPaths: Set<string>
) => {
  if (!Array.isArray(navItems)) return [];

  return navItems
    .map((section) => {
      const filteredItems = (section.items || [])
        .map((item: any) => {
          // Filter subItems if present
          let filteredSubItems = item.subItems
            ? item.subItems.filter((sub: any) => allowedPaths.has(sub.label) || allowedPaths.has(sub.title))
            : undefined;

          // Keep item if label/title is allowed or it has allowed subItems
          if (
            allowedPaths.has(item.label) ||
            allowedPaths.has(item.title) ||
            allowedPaths.has(section.subheader) ||
            (filteredSubItems && filteredSubItems.length > 0)
          ) {
            return {
              ...item,
              subItems: filteredSubItems,
            };
          }
          return null;
        })
        .filter(Boolean);

      // Keep section if it has any allowed items
      if (filteredItems.length > 0) {
        return {
          ...section,
          items: filteredItems,
        };
      }
      return null;
    })
    .filter(Boolean);
};
