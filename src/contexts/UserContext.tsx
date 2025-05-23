'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { ROLES } from '../utils/userSetup'
import type { RoleType } from '../utils/userSetup'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import type { User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebaseConfig'

// Define user data structure
export interface UserData {
  id: string
  name: string
  email: string
  role: RoleType
  site?: string
  lastLogin?: string
  avatar?: string
  isActive: boolean
}

// Define authentication state
interface AuthState {
  isAuthenticated: boolean
  userData: UserData | null
  loading: boolean
  error: string | null
}

// Define context type
interface UserContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (
    userData: Omit<UserData, 'id' | 'isActive'> & { password: string }
  ) => Promise<void>
  updateUserData: (updates: Partial<UserData>) => Promise<void>
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  isAuthenticated: false,
  userData: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updateUserData: async () => {}
})

// Sample user data for development
const sampleUsers: UserData[] = [
  {
    id: 'user1',
    name: 'Admin User',
    email: 'admin@tyresystem.com',
    role: ROLES.ADMIN,
    isActive: true,
    lastLogin: new Date().toISOString(),
    avatar: 'https://i.pravatar.cc/150?u=admin'
  },
  {
    id: 'user2',
    name: 'Site Manager',
    email: 'sitemanager@company.com',
    role: ROLES.SITE_MANAGER,
    site: 'North Pit',
    isActive: true,
    lastLogin: new Date().toISOString(),
    avatar: 'https://i.pravatar.cc/150?u=manager'
  },
  {
    id: 'user3',
    name: 'Supervisor',
    email: 'supervisor@company.com',
    role: ROLES.SUPERVISOR,
    site: 'South Pit',
    isActive: true,
    lastLogin: new Date().toISOString(),
    avatar: 'https://i.pravatar.cc/150?u=supervisor'
  },
  {
    id: 'user4',
    name: 'Tyre Fitter',
    email: 'fitter@company.com',
    role: ROLES.FITTER,
    site: 'Main Workshop',
    isActive: true,
    lastLogin: new Date().toISOString(),
    avatar: 'https://i.pravatar.cc/150?u=fitter'
  }
]

// Helper function to get home path based on role
export const getRoleHomePath = (role: RoleType): string => {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin'
    case ROLES.SITE_MANAGER:
      return '/sitemanager'
    case ROLES.SUPERVISOR:
      return '/supervisor'
    case ROLES.FITTER:
      return '/fitter'
    default:
      return '/login'
  }
}

// Helper function to get user data from Firestore
const getUserDataFromFirestore = async (
  uid: string
): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data() as UserData
    }

    return null
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

// Provider component
export function UserProvider ({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userData: null,
    loading: true,
    error: null
  })

  // Check for existing auth on mount and listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Try to get user data from Firestore
          const userData = await getUserDataFromFirestore(firebaseUser.uid)

          if (userData) {
            // User found in Firestore
            setAuthState({
              isAuthenticated: true,
              userData: {
                ...userData,
                id: firebaseUser.uid,
                email: firebaseUser.email || userData.email,
                lastLogin: new Date().toISOString()
              },
              loading: false,
              error: null
            })
          } else {
            // No user in Firestore yet, check for demo users with matching email
            const demoUser = sampleUsers.find(
              u => u.email === firebaseUser.email
            )

            if (demoUser) {
              setAuthState({
                isAuthenticated: true,
                userData: {
                  ...demoUser,
                  id: firebaseUser.uid,
                  lastLogin: new Date().toISOString()
                },
                loading: false,
                error: null
              })
            } else {
              // No matching demo user either
              setAuthState({
                isAuthenticated: false,
                userData: null,
                loading: false,
                error: 'User profile not found'
              })
            }
          }
        } catch (err) {
          console.error('Failed to get user data:', err)
          setAuthState({
            isAuthenticated: false,
            userData: null,
            loading: false,
            error: 'Failed to load user profile'
          })
        }
      } else {
        // User is signed out
        setAuthState({
          isAuthenticated: false,
          userData: null,
          loading: false,
          error: null
        })

        // For demo purposes, check if there's user data in localStorage
        if (typeof window !== 'undefined') {
          const localUserData = localStorage.getItem('userData')
          if (localUserData) {
            try {
              setAuthState({
                isAuthenticated: true,
                userData: JSON.parse(localUserData),
                loading: false,
                error: null
              })
            } catch (err) {
              console.error('Failed to parse local user data:', err)
            }
          }
        }
      }
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // First try Firebase authentication
      try {
        await signInWithEmailAndPassword(auth, email, password)
        // Authentication success - user data will be loaded by the auth state listener
        return
      } catch (firebaseError: any) {
        console.log(
          'Firebase auth failed, falling back to demo mode:',
          firebaseError.message
        )
        // Firebase auth failed, try demo login...
      }

      // In a real app, this would call an API
      // For development, just check against sample users
      let user

      // Quick login by role
      if (email === 'admin') {
        user = sampleUsers.find(u => u.role === ROLES.ADMIN)
      } else if (email === 'manager' || email === 'sitemanager') {
        user = sampleUsers.find(u => u.role === ROLES.SITE_MANAGER)
      } else if (email === 'supervisor') {
        user = sampleUsers.find(u => u.role === ROLES.SUPERVISOR)
      } else if (email === 'fitter') {
        user = sampleUsers.find(u => u.role === ROLES.FITTER)
      } else {
        // Regular email lookup
        user = sampleUsers.find(u => u.email === email)
      }

      if (!user) {
        throw new Error('Invalid credentials')
      }

      // Check password - accept either the predefined password or an empty one for easy testing
      const validPassword = password === 'Password123!' || password === ''
      if (!validPassword) {
        throw new Error('Invalid password')
      }

      // Update the last login time
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      }

      // Store in localStorage for demo mode
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(updatedUser))
      }

      setAuthState({
        isAuthenticated: true,
        userData: updatedUser,
        loading: false,
        error: null
      })
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Login failed'
      }))
      throw err
    }
  }

  // Logout function
  const logout = () => {
    // First try to sign out from Firebase
    signOut(auth).catch(error => {
      console.error('Firebase sign out error:', error)
    })

    // Remove from localStorage for demo mode
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userData')
    }

    setAuthState({
      isAuthenticated: false,
      userData: null,
      loading: false,
      error: null
    })
  }

  // Register function
  const register = async (
    userData: Omit<UserData, 'id' | 'isActive'> & { password: string }
  ) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // In a real app, this would call an API
      // For development, just create a new user locally

      const newUser: UserData = {
        id: `user-${Date.now()}`,
        ...userData,
        isActive: true,
        lastLogin: new Date().toISOString()
      }

      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(newUser))
      }

      setAuthState({
        isAuthenticated: true,
        userData: newUser,
        loading: false,
        error: null
      })
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Registration failed'
      }))
      throw err
    }
  }

  // Update user data function
  const updateUserData = async (updates: Partial<UserData>) => {
    if (!authState.userData) {
      throw new Error('No authenticated user')
    }

    setAuthState(prev => ({ ...prev, loading: true }))

    try {
      const updatedUserData = {
        ...authState.userData,
        ...updates
      }

      // If using Firebase, update the user data in Firestore
      if (auth.currentUser) {
        await updateDoc(doc(db, 'users', updatedUserData.id), updatedUserData)
      }

      // For demo mode, update in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(updatedUserData))
      }

      setAuthState({
        ...authState,
        userData: updatedUserData,
        loading: false
      })
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to update user data'
      }))
      throw err
    }
  }

  return (
    <UserContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
        updateUserData
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser () {
  return useContext(UserContext)
}
