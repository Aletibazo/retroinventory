import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getGames = () => API.get("/games");
export const createGame = (game) => API.post("/games", game);
export const deleteGame = (id) => API.delete(`/games/${id}`);
export const updateGame = (id, game) => API.put(`/games/${id}`, game);

export const getConsoles = () => API.get("/consoles");
export const createConsole = (consoleObj) => API.post("/consoles", consoleObj);
export const deleteConsole = (id) => API.delete(`/consoles/${id}`);
export const updateConsole = (id, consoleObj) =>
  API.put(`/consoles/${id}`, consoleObj);
