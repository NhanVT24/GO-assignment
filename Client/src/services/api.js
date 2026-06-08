import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

export const getScoreByRegistrationNumber = async (registrationNumber) => {
  const response = await api.get(`/scores/${registrationNumber}`)
  return response.data
}

export const getScoreStatistics = async () => {
  const response = await api.get('/statistics')
  return response.data
}

export const getTopStudents = async () => {
  const response = await api.get('/top-students')
  return response.data
}

export default api
