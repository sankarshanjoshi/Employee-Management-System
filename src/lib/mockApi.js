import { format, addDays, subDays } from 'date-fns'

// Mock data for employees
export const mockEmployees = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    position: 'Software Engineer',
    department: 'Engineering',
    salary: 75000,
    hireDate: '2022-01-15',
    phone: '+1-555-0123',
    address: '123 Main St, City, State 12345',
    role: 'employee'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    position: 'Product Manager',
    department: 'Product',
    salary: 85000,
    hireDate: '2021-03-10',
    phone: '+1-555-0124',
    address: '456 Oak Ave, City, State 12346',
    role: 'employee'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    position: 'DevOps Engineer',
    department: 'Engineering',
    salary: 80000,
    hireDate: '2022-06-01',
    phone: '+1-555-0125',
    address: '789 Pine St, City, State 12347',
    role: 'employee'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    position: 'UX Designer',
    department: 'Design',
    salary: 70000,
    hireDate: '2023-02-20',
    phone: '+1-555-0126',
    address: '321 Elm Dr, City, State 12348',
    role: 'employee'
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@example.com',
    position: 'System Administrator',
    department: 'IT',
    salary: 95000,
    hireDate: '2020-01-01',
    phone: '+1-555-0127',
    address: '654 Cedar Ln, City, State 12349',
    role: 'admin'
  }
]

// Mock user accounts for login
export const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    employeeId: '5'
  },
  {
    id: '2',
    email: 'john.doe@example.com',
    password: 'user123',
    role: 'employee',
    employeeId: '1'
  },
  {
    id: '3',
    email: 'jane.smith@example.com',
    password: 'user123',
    role: 'employee',
    employeeId: '2'
  },
  {
    id: '4',
    email: 'mike.johnson@example.com',
    password: 'user123',
    role: 'employee',
    employeeId: '3'
  },
  {
    id: '5',
    email: 'sarah.wilson@example.com',
    password: 'user123',
    role: 'employee',
    employeeId: '4'
  }
]

// Mock time logs
export const mockTimeLogs = [
  {
    id: '1',
    employeeId: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    clockIn: '09:00',
    clockOut: '17:00',
    totalHours: 8,
    status: 'completed'
  },
  {
    id: '2',
    employeeId: '1',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    clockIn: '09:15',
    clockOut: '17:30',
    totalHours: 8.25,
    status: 'completed'
  },
  {
    id: '3',
    employeeId: '2',
    date: format(new Date(), 'yyyy-MM-dd'),
    clockIn: '08:45',
    clockOut: '17:00',
    totalHours: 8.25,
    status: 'completed'
  },
  {
    id: '4',
    employeeId: '3',
    date: format(new Date(), 'yyyy-MM-dd'),
    clockIn: '09:30',
    clockOut: null,
    totalHours: 0,
    status: 'active'
  }
]

// Utility functions to simulate API calls
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Employee API functions
export const employeeApi = {
  async getAll() {
    await delay(500)
    return [...mockEmployees]
  },

  async getById(id) {
    await delay(300)
    return mockEmployees.find(emp => emp.id === id)
  },

  async create(employeeData) {
    await delay(800)
    const newEmployee = {
      id: (mockEmployees.length + 1).toString(),
      ...employeeData,
      role: 'employee'
    }
    mockEmployees.push(newEmployee)
    return newEmployee
  },

  async update(id, employeeData) {
    await delay(500)
    const index = mockEmployees.findIndex(emp => emp.id === id)
    if (index !== -1) {
      mockEmployees[index] = { ...mockEmployees[index], ...employeeData }
      return mockEmployees[index]
    }
    throw new Error('Employee not found')
  },

  async delete(id) {
    await delay(400)
    const index = mockEmployees.findIndex(emp => emp.id === id)
    if (index !== -1) {
      const deletedEmployee = mockEmployees.splice(index, 1)[0]
      // Also remove from users if exists
      const userIndex = mockUsers.findIndex(user => user.employeeId === id)
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1)
      }
      return deletedEmployee
    }
    throw new Error('Employee not found')
  }
}

// Auth API functions
export const authApi = {
  async login(email, password) {
    await delay(1000)
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (user) {
      const employee = mockEmployees.find(emp => emp.id === user.employeeId)
      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          employeeId: user.employeeId
        },
        employee,
        token: 'fake-jwt-token-' + user.id
      }
    }
    throw new Error('Invalid credentials')
  },

  async register(userData) {
    await delay(1200)
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('Email already exists')
    }

    // Create new employee first
    const newEmployee = await employeeApi.create({
      name: userData.name,
      email: userData.email,
      position: userData.position || 'New Employee',
      department: userData.department || 'General',
      salary: userData.salary || 50000,
      hireDate: format(new Date(), 'yyyy-MM-dd'),
      phone: userData.phone || '',
      address: userData.address || ''
    })

    // Create user account
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email: userData.email,
      password: userData.password,
      role: 'employee',
      employeeId: newEmployee.id
    }
    mockUsers.push(newUser)

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        employeeId: newUser.employeeId
      },
      employee: newEmployee,
      token: 'fake-jwt-token-' + newUser.id
    }
  }
}

// Time tracking API functions
export const timeApi = {
  async getTimeLogs(employeeId, startDate, endDate) {
    await delay(400)
    const logs = mockTimeLogs.filter(log => {
      if (employeeId && log.employeeId !== employeeId) return false
      if (startDate && log.date < startDate) return false
      if (endDate && log.date > endDate) return false
      return true
    })

    // Enrich logs with employee names
    return logs.map(log => {
      const employee = mockEmployees.find(emp => emp.id === log.employeeId)
      return {
        ...log,
        employeeName: employee?.name || `Employee ${log.employeeId}`
      }
    })
  },

  async clockIn(employeeId) {
    await delay(500)
    const today = format(new Date(), 'yyyy-MM-dd')
    const currentTime = format(new Date(), 'HH:mm')
    
    // Check if already clocked in today
    const existingLog = mockTimeLogs.find(log => 
      log.employeeId === employeeId && 
      log.date === today && 
      log.status === 'active'
    )
    
    if (existingLog) {
      throw new Error('Already clocked in today')
    }

    const newLog = {
      id: (mockTimeLogs.length + 1).toString(),
      employeeId,
      date: today,
      clockIn: currentTime,
      clockOut: null,
      totalHours: 0,
      status: 'active'
    }
    
    mockTimeLogs.push(newLog)
    return newLog
  },

  async clockOut(employeeId) {
    await delay(500)
    const today = format(new Date(), 'yyyy-MM-dd')
    const currentTime = format(new Date(), 'HH:mm')
    
    const logIndex = mockTimeLogs.findIndex(log => 
      log.employeeId === employeeId && 
      log.date === today && 
      log.status === 'active'
    )
    
    if (logIndex === -1) {
      throw new Error('No active clock-in found for today')
    }

    const log = mockTimeLogs[logIndex]
    const clockInTime = new Date(`${today}T${log.clockIn}:00`)
    const clockOutTime = new Date(`${today}T${currentTime}:00`)
    const totalHours = (clockOutTime - clockInTime) / (1000 * 60 * 60)

    mockTimeLogs[logIndex] = {
      ...log,
      clockOut: currentTime,
      totalHours: Math.round(totalHours * 100) / 100,
      status: 'completed'
    }
    
    return mockTimeLogs[logIndex]
  },

  async getTodayLog(employeeId) {
    await delay(200)
    const today = format(new Date(), 'yyyy-MM-dd')
    return mockTimeLogs.find(log => 
      log.employeeId === employeeId && 
      log.date === today
    )
  }
}