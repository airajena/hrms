// src/components/Employee/EmployeeCard.tsx
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Building,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from '../../types';
import { cn } from '@/lib/utils';

interface EmployeeCardProps {
  employee: User;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export const EmployeeCard = ({
  employee,
  onEdit,
  onDelete,
  onView,
}: EmployeeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Probation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Exited': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const name = `${employee.first_name} ${employee.last_name}`;
  const initials = `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase();

  return (
    <Card
      className={cn(
        "transition-all duration-300 ease-in-out border flex flex-col",
        isHovered ? "shadow-lg scale-105 border-blue-300" : "shadow-sm border-gray-200"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4 flex flex-col flex-grow">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onView(employee.id)}>
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
              <p className="text-sm text-gray-600 truncate">{employee.designation?.title || 'N/A'}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(employee.id)}>
                <Eye className="mr-2 h-4 w-4" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(employee.id)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(employee.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Details Section */}
        <div className="space-y-2 text-sm flex-grow">
            <div className="flex items-center text-gray-600">
                <Building className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">{employee.department?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">{employee.email}</span>
            </div>
            {employee.phone && (
            <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{employee.phone}</span>
            </div>
            )}
        </div>

        {/* Footer Section */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <Badge className={cn("text-xs font-medium", getStatusColor(employee.status))}>
                {employee.status}
            </Badge>
            <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                {employee.emp_code}
            </p>
        </div>
      </CardContent>
    </Card>
  );
};
