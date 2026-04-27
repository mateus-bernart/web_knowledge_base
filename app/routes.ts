import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),

  layout("routes/layout.tsx", [
    index("routes/index.tsx"),
    route("logout", "routes/logout.tsx"),
    route("about", "routes/about.tsx"),
    ...prefix("materials", [
      index("routes/materials.tsx"),
      route(":materialId", "routes/material.tsx"),
    ]),
    ...prefix("groups", [
      index("routes/groups.tsx"),
      route(":groupId", "routes/group.tsx", [
        ...prefix("materials", [
          index("routes/group-materials.tsx"),
          route(":materialId", "routes/group-material.tsx"),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
