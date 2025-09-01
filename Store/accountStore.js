import { create } from 'zustand'

const accountStore = create((set) => ({
    currentAccount: null,
    setCurrentAccount: (account) => set({ currentAccount: account }),
}))

export default accountStore
