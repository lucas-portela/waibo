import { SvgIconComponent } from "@mui/icons-material";

export type NavigationLink = {
  label: string;
  icon: SvgIconComponent;
  link: string;
  adminOnly?: boolean;
  userOnly?: boolean;
};
