import axios from "axios";

const API_URL = "http://localhost:5000/api/surveys";

export const getAllSurveys = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getSurveyById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createSurvey = async (surveyData) => {
  const response = await axios.post(API_URL, surveyData);
  return response.data;
};

export const updateSurvey = async (id, surveyData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    surveyData
  );

  return response.data;
};

export const deleteSurvey = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );

  return response.data;
};