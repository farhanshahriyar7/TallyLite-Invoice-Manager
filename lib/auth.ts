// Authentication types and utilities
export type UserRole = "user" | "admin"
export type SubscriptionPlan = "Free Plan" | "Pro Plan"

export interface User {
  id: string
  email: string
  name: string
  username: string
  fullName: string
  address: string
  mobile: string
  role: UserRole
  subscriptionPlan: SubscriptionPlan
  createdAt: Date
  isEmailVerified: boolean
  avatar?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock users for demonstration (replace with database later)
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@company.com",
    name: "Admin User",
    username: "admin",
    fullName: "Administrator User",
    address: "123 Admin Street, City, State 12345",
    mobile: "+1 (555) 123-4567",
    role: "admin",
    subscriptionPlan: "Pro Plan",
    createdAt: new Date("2024-01-01"),
    isEmailVerified: true,
  },
  {
    id: "2",
    email: "user@company.com",
    name: "John Doe",
    username: "johndoe",
    fullName: "John Michael Doe",
    address: "456 User Avenue, City, State 67890",
    mobile: "+1 (555) 987-6543",
    role: "user",
    subscriptionPlan: "Free Plan",
    createdAt: new Date("2024-01-15"),
    isEmailVerified: true,
  },
]

// Mock authentication functions (replace with real auth later)
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simple mock authentication
  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password") {
    return user
  }
  return null
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("currentUser")
  return userData ? JSON.parse(userData) : null
}

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === "undefined") return

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

// CRUD operations for users (admin functionality)
export const createUser = (userData: Omit<User, "id" | "createdAt">): User => {
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date(),
    subscriptionPlan: userData.subscriptionPlan || "Free Plan",
  }

  mockUsers.push(newUser)
  return newUser
}

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const index = mockUsers.findIndex((user) => user.id === id)
  if (index === -1) return null

  mockUsers[index] = {
    ...mockUsers[index],
    ...updates,
  }

  return mockUsers[index]
}

export const deleteUser = (id: string): boolean => {
  const index = mockUsers.findIndex((user) => user.id === id)
  if (index === -1) return false

  mockUsers.splice(index, 1)
  return true
}

export const getUserById = (id: string): User | null => {
  return mockUsers.find((user) => user.id === id) || null
}

export const getAllUsers = (): User[] => {
  return mockUsers
}

export const getUserStats = () => {
  const total = mockUsers.length
  const admins = mockUsers.filter((user) => user.role === "admin").length
  const users = mockUsers.filter((user) => user.role === "user").length

  return {
    total,
    admins,
    users,
  }
}

export const registerUser = async (userData: {
  email: string
  password: string
  username: string
  fullName: string
  address: string
  mobile: string
}): Promise<{ user: User | null; needsVerification: boolean }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Check if email already exists
  const existingUser = mockUsers.find((u) => u.email === userData.email)
  if (existingUser) {
    throw new Error("Email already registered")
  }

  // Check if username already exists
  const existingUsername = mockUsers.find((u) => u.username === userData.username)
  if (existingUsername) {
    throw new Error("Username already taken")
  }

  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.fullName.split(" ")[0], // First name for display
    username: userData.username,
    fullName: userData.fullName,
    address: userData.address,
    mobile: userData.mobile,
    role: "user",
    subscriptionPlan: "Free Plan",
    createdAt: new Date(),
    isEmailVerified: false, // Requires verification
  }

  mockUsers.push(newUser)

  // Return user but indicate verification needed
  return { user: newUser, needsVerification: true }
}

export const verifyEmail = async (userId: string, token: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock verification - in real app, validate token
  const user = mockUsers.find((u) => u.id === userId)
  if (user && token === "mock-verification-token") {
    user.isEmailVerified = true
    return true
  }
  return false
}

export const sendVerificationEmail = async (email: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock email sending - always succeeds in demo
  console.log(`[Mock] Verification email sent to: ${email}`)
  return true
}
