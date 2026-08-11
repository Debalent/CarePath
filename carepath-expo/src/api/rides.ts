import { api } from './client';
import type { CreateRideRequestBody } from '@/types/api';

export const createRideRequestApi = async (body: CreateRideRequestBody) => {
  // rideRoutes: POST /api/rides
  const res = await api.post('/api/rides', body);
  return res.data;
};

// ======================
// PATIENT
// ======================
export const getMyUpcomingRidesApi = async () => {
  // rideRoutes: GET /api/rides/my (PATIENT)
  const res = await api.get('/api/rides/my');
  return res.data;
};

// ======================
// DRIVER
// ======================
export const getAssignedUpcomingRidesApi = async () => {
  // rideRoutes: GET /api/rides/my-driver-rides (DRIVER)
  const res = await api.get('/api/rides/my-driver-rides');
  return res.data;
};

// ======================
// COORDINATOR
// ======================
export const getPendingRidesApi = async () => {
  // rideRoutes: GET /api/rides/pending (COORDINATOR)
  const res = await api.get('/api/rides/pending');
  return res.data;
};

export const assignDriverToRideApi = async (
  rideId: string,
  body: { driverId: string; fallbackDriverIds?: string[] }
) => {
  // rideRoutes: PATCH /api/rides/:rideId/assign (COORDINATOR)
  const res = await api.patch(`/api/rides/${rideId}/assign`, body);
  return res.data;
};

export const triggerFallbackApi = async (rideId: string) => {
  // rideRoutes: PATCH /api/rides/:rideId/fallback (COORDINATOR)
  const res = await api.patch(`/api/rides/${rideId}/fallback`);
  return res.data;
};

export const getPoolingOptionsApi = async (rideId: string) => {
  // rideRoutes: GET /api/rides/:rideId/pooling-options (COORDINATOR)
  const res = await api.get(`/api/rides/${rideId}/pooling-options`);
  return res.data;
};

export const getDriversApi = async () => {
  // driverRoutes: GET /api/drivers (COORDINATOR/ADMIN)
  const res = await api.get('/api/drivers');
  return res.data;
};

export const getAvailableDriversApi = async () => {
  // driverRoutes: GET /api/drivers/available (COORDINATOR/ADMIN)
  const res = await api.get('/api/drivers/available');
  return res.data;
};

export const getFallbackPoolApi = async () => {
  // driverRoutes: GET /api/drivers/fallback-pool (COORDINATOR/ADMIN)
  const res = await api.get('/api/drivers/fallback-pool');
  return res.data;
};


export const getCurrentTrackingApi = async () => {
  const res = await api.get('/api/rides/gps/current');
  return res.data;
};

export const getRideTrackingApi = async (rideId: string) => {
  const res = await api.get(`/api/rides/${rideId}/gps`);
  return res.data;
};

export const updateRideStatusApi = async (rideId: string, status: string) => {
  const res = await api.patch(`/api/rides/${rideId}/status`, { status });
  return res.data;
};
