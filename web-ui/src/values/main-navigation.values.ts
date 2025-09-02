import { NavigationLink } from "@/lib/types/navigation.types";
import { Home, SupervisorAccount } from "@mui/icons-material";

export const MainNavigation: NavigationLink[] = [
  { label: "Home", icon: Home, link: "/" },
  { label: "Users", icon: SupervisorAccount, link: "/users", adminOnly: true },
];
