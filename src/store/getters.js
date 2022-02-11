const getters = {

  size: state => state.app.size,
  device: state => state.app.device,
  sidebar: state => state.app.sidebar,
  cachedViews: state => state.tagsView.cachedViews,
  visitedViews: state => state.tagsView.visitedViews,
  info: state => state.user.info,
  name: state => state.user.name,
  token: state => state.user.token,
  roles: state => state.user.roles,
  avatar: state => state.user.avatar,
  permissions: state => state.user.permissions,
  introduction: state => state.user.introduction,
  deptPermissions: state => state.user.deptPermissions,
  addRoutes: state => state.permission.addRoutes,
  permission_routes: state => state.permission.routes,
  topbarRouters:state => state.permission.topbarRouters,
  defaultRoutes:state => state.permission.defaultRoutes,
  sidebarRouters:state => state.permission.sidebarRouters,
}
export default getters
