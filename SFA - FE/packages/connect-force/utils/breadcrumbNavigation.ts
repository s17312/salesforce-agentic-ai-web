
export const handleBreadcrumbNavigation = (path: string | undefined, router:any) => {
  
  if (path) {
    router.push(path);
  }
};
