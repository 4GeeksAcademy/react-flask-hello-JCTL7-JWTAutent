// =========================================
// CONFIGURACIÓN BASE
// =========================================
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// Helper para headers con JWT
const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// =========================================
// AUTH
// =========================================
export const signup = async (data) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const resetPassword = async (token, password) => {
  const res = await fetch(`${API_URL}/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.json();
};

// =========================================
// ROUTINES
// =========================================
export const getRoutines = async (search = "") => {
  const url = search
    ? `${API_URL}/routines?search=${search}`
    : `${API_URL}/routines`;

  const res = await fetch(url);
  return res.json();
};

export const createRoutine = async (token, data) => {
  const res = await fetch(`${API_URL}/routines`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const completeRoutine = async (token, routineId) => {
  const res = await fetch(
    `${API_URL}/routines/${routineId}/complete`,
    {
      method: "POST",
      headers: authHeaders(token),
    }
  );
  return res.json();
};

// =========================================
// TRAINING LOG
// =========================================
export const getTrainingLog = async (token) => {
  const res = await fetch(`${API_URL}/training-log`, {
    headers: authHeaders(token),
  });
  return res.json();
};

// =========================================
// GOALS
// =========================================
export const createGoal = async (token, data) => {
  const res = await fetch(`${API_URL}/goals`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getGoals = async (token) => {
  const res = await fetch(`${API_URL}/goals`, {
    headers: authHeaders(token),
  });
  return res.json();
};

// =========================================
// REWARDS
// =========================================
export const getRewards = async () => {
  const res = await fetch(`${API_URL}/rewards`);
  return res.json();
};

export const claimReward = async (token, rewardId) => {
  const res = await fetch(
    `${API_URL}/rewards/claim/${rewardId}`,
    {
      method: "POST",
      headers: authHeaders(token),
    }
  );
  return res.json();
};

// =========================================
// PREMIUM
// =========================================
export const getPremiumDiets = async (token) => {
  const res = await fetch(`${API_URL}/premium/diets`, {
    headers: authHeaders(token),
  });
  return res.json();
};

// =========================================
// EXTERNAL API (EXERCISES)
// =========================================
export const searchExternalExercises = async (query) => {
  const res = await fetch(
    `${API_URL}/external-routines?q=${query}`
  );
  return res.json();
};

// =========================================
// AI ROUTINES
// =========================================
export const generateAiRoutine = async (prompt) => {
  const res = await fetch(`${API_URL}/ai-routine`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
};

export const saveAiRoutine = async (token, data) => {
  const res = await fetch(`${API_URL}/ai-routine/save`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
};