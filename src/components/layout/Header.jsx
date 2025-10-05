import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, Bell } from 'lucide-react'

const Header = ({ onMenuClick }) => {
  const { employee } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Mobile menu button */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="ml-4 lg:ml-0">
          <h1 className="text-lg font-semibold text-gray-900">
            Employee Management System
          </h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="hidden md:block text-sm text-gray-700">
          Welcome, {employee?.name}
        </div>
      </div>
    </header>
  )
}

export default Header