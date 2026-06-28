import axios from 'axios'

const BASE = import.meta.env.VITE_BACKEND_URL || ''

export const api = axios.create({ baseURL: BASE })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('truecreds_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export const fmtINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export const fmtNum = (n) =>
  new Intl.NumberFormat('en-IN').format(n)

export const fmtLakh = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}
