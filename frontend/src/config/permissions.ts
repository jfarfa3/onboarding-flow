export interface Permission {
  label: string;
  permissions: string[];
}

export const rolesAndPermissions: Permission[] = [
  {
    "label": "Desarrollador",
    "permissions": [
      "user:view:self",
      "user:update:self",
      "equipment:create:self",
      "equipment:view:self",
      "access:create:self",
      "access:view:self"
    ]
  },
  {
    "label": "DevOps",
    "permissions": [
      "user:view:self",
      "user:update:self",
      "equipment:create:self",
      "equipment:view:self",
      "access:create:self",
      "access:view:self"
    ]
  },
  {
    "label": "Calidad (QA)",
    "permissions": [
      "user:view:self",
      "user:update:self",
      "equipment:create:self",
      "equipment:view:self",
      "access:create:self",
      "access:view:self"
    ]
  },
  {
    "label": "Diseñador UX/UI",
    "permissions": [
      "user:view:self",
      "user:update:self",
      "equipment:create:self",
      "equipment:view:self",
      "access:create:self",
      "access:view:self"
    ]
  },
  {
    "label": "Administrador",
    "permissions": [
      "user:create:any",
      "user:view:any",
      "user:update:any",
      "user:delete:any",
      "equipment:create:any",
      "equipment:view:any",
      "equipment:update:any",
      "equipment:approve:any",
      "access:create:any",
      "access:view:any",
      "access:update:any",
      "access:approve:any",
      "software:create:any",
      "software:view:any",
      "software:update:any",
    ]
  },
  {
    "label": "Líder Técnico",
    "permissions": [
      "user:create:any",
      "user:view:any",
      "user:update:any",
      "user:delete:any",
      "equipment:create:any",
      "equipment:view:any",
      "equipment:update:any",
      "equipment:approve:any",
      "access:create:any",
      "access:view:any",
      "access:update:any",
      "access:approve:any",
      "software:create:any",
      "software:view:any",
      "software:update:any",
    ]
  },
  {
    "label": "Arquitecto de Software",
    "permissions": [
      "user:view:self",
      "user:update:self",
      "equipment:create:self",
      "equipment:view:self",
      "access:create:self",
      "access:view:self",
      "user:view:any",
      "equipment:view:any",
      "access:view:any",
      "software:view:any"
    ]
  },
  {
    "label": "Product Owner",
    "permissions": [
      "user:view:self",
      "user:update:self",
      "equipment:create:self",
      "equipment:view:self",
      "access:create:self",
      "access:view:self",
      "user:view:any",
      "equipment:view:any",
      "access:view:any",
      "software:view:any"
    ]
  },
  {
    "label": "Scrum Master",
    "permissions": [
      "user:view:self",
      "user:update:self",
      "equipment:create:self",
      "equipment:view:self",
      "access:create:self",
      "access:view:self",
      "user:create:any",
      "user:view:any",
      "user:update:any",
      "user:delete:any",
      "equipment:create:any",
      "equipment:view:any",
      "equipment:update:any",
      "access:create:any",
      "access:view:any",
      "access:update:any",
      "software:view:any",
      "software:update:any"
    ]
  }
];

export interface DecodedJwtPayload {
  id: string;
  name: string;
  email: string;
  role: string; 
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}
