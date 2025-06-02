export type roles = keyof typeof RoleEnum;

export const RoleEnum = {
  DEV: "desarrollador",
  ADMIN: "administrador",
  LEAD: "líder",
  DEVOPS: "devops",
  ARQUITECT: "arquitecto",
  PRODUCT_OWNER: "product owner",
  SCRUM_MASTER: "scrum master",
  UX_UI: "ux/ui",
  QA: "qa",
} as const;

export const generateRoleOptions = () => {
  return Object.entries(RoleEnum).map(([key, value]) => ({
    value: key.toLowerCase(),
    label: formatLabel(value),
  }));
};

function formatLabel(label: string): string {
  return label
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
