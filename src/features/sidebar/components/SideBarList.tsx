import "./SideBarList.css";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../../context/UserInfoContext";
import { useHasPermission } from "../../../context/UseHasPermission";
import { useState } from "react";

type SubItem = {
  label: string;
  path: string;
  permission?: string;
};

type SidebarItem = {
  label: string;
  path: string;
  isExpandable: boolean;
  permission: string;
  subItems?: SubItem[];
};

type SideBarListProps = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    path: "/home",
    isExpandable: false,
    permission: "view_home",
  },
  {
    label: "My Schedules",
    path: "/scheduledBookings",
    isExpandable: false,
    permission: "view_schedules",
  },
  {
    label: "User",
    path: "/list-users",
    isExpandable: false,
    permission: "view_users",
  },
 
  {
    label: "Roles",
    path: "/role-mapping",
    isExpandable: false,
    permission: "VIEW_ROLES",
  },
  
];

const SideBarList = ({
  setIsMobileMenuOpen,
  isMobileMenuOpen,
}: SideBarListProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const hasPermission = useHasPermission(userInfo.userInfo.role);

  const handleToggle = (item: SidebarItem) => {
    if (item.label === "Documents") {
      navigate("/documents/my-documents");
      setIsMobileMenuOpen(false);
    }
    else if (item.label==="Contacts") {
      navigate("/contacts");
      setIsMobileMenuOpen(false);
    }
    setExpandedItem((prev) => (prev === item.label ? null : item.label));
  };
  

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setExpandedItem(null);
  };

  return (
    <div className="mobile_sidebar_list">
      {sidebarItems.map((item) => {
        if (!hasPermission(item.permission)) return null;

        const hasVisibleSubItems = item.subItems?.some((subItem) =>
          hasPermission(subItem.permission ?? item.permission)
        );

        return (
          <div key={item.label}>
            {hasVisibleSubItems ? (
              <div
              className="sidebar-item expandable"
              onClick={() => handleToggle(item)}
            >
              <span>{item.label}</span>
              {item.isExpandable &&
                (item.label === expandedItem ? (
                  <ExpandLessIcon className="dropdown-icon" />
                ) : (
                  <ExpandMoreIcon className="dropdown-icon" />
                ))}
            </div>
            ) : (
              <div
                className="sidebar-item"
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </div>
            )}
            <div
              className={`dropdown__container ${
                expandedItem === item.label ? "expanded" : ""
              }`}
            >
              {item.subItems?.map((subItem) => {
                if (!hasPermission(subItem.permission ?? item.permission))
                  return null;

                return (
                  <div
                    key={subItem.label}
                    className="dropdown-item"
                    onClick={() => handleNavigation(subItem.path)}
                  >
                    {subItem.label}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SideBarList;
