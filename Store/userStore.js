import { create } from 'zustand'

const userStore = create((set) => ({
    currentUser: null,
    setCurrentUser: (user) => set({ currentUser: user }),
}))

export default userStore
