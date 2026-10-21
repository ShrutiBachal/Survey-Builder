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

export const getQuestionsBySurvey = async (surveyId) => {
  const response = await axios.get(
    `${API_URL}/${surveyId}/questions`
  );
  return response.data;
};

export const createQuestion = async (surveyId, questionData) => {
  const response = await axios.post(
    `${API_URL}/${surveyId}/questions`,
    questionData
  );
  return response.data;
};

export const updateQuestion = async (questionId, questionData) => {
  const response = await axios.put(
    `http://localhost:5000/api/questions/${questionId}`,
    questionData
  );
  return response.data;
};

export const deleteQuestion = async (questionId) => {
  const response = await axios.delete(
    `http://localhost:5000/api/questions/${questionId}`
  );
  return response.data;
};