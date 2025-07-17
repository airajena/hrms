// components/Layout/Sidebar.tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building, 
  Award, 
  Calendar, 
  FileText, 
  Settings,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { User as UserType } from '../../types';

interface SidebarProps {
  user: UserType | null;
  onLogout: () => void;
}

interface MenuItem {
  name: string;
  icon: React.ElementType;
  href?: string;
  badge?: number;
  children?: MenuItem[];
}

export const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['employees']);

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: Home,
      href: '/dashboard',
    },
    {
      name: 'Employees',
      icon: Users,
      children: [
        { name: 'All Employees', icon: Users, href: '/employees' },
        { name: 'Add Employee', icon: Users, href: '/employees/add' },
        { name: 'Departments', icon: Building, href: '/departments' },
        { name: 'Designations', icon: Award, href: '/designations' },
      ],
    },
    {
      name: 'Attendance',
      icon: Calendar,
      href: '/attendance',
    },
    {
      name: 'Reports',
      icon: FileText,
      href: '/reports',
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '/settings',
    },
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children: MenuItem[] = []) => 
    children.some(child => child.href && isActive(child.href));

  const getUserInitials = (user: UserType | null) => {
    if (!user) return 'U';
    const email = user.email || '';
    return email.charAt(0).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hr': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">HRMS</h1>
            <p className="text-xs text-gray-500">Indian Port Authority</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.email} />
            <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email || 'User'}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-xs text-gray-500 truncate">
                {user?.emp_code || 'N/A'}
              </p>
              {user?.role && (
                <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                  {user.role.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isParentActive(item.children)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {expandedItems.includes(item.name) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedItems.includes(item.name) && (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href!}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          isActive(child.href!)
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <child.icon className="w-4 h-4" />
                        <span>{child.name}</span>
                        {child.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {child.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.href!}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(item.href!)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start text-gray-700 hover:bg-gray-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
};
