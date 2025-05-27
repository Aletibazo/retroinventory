import React, { useEffect, useState } from "react";
import {
  getGames,
  createGame,
  deleteGame,
  updateGame,
  getConsoles,
  createConsole,
  deleteConsole,
  updateConsole,
} from "./api";

function App() {
  const [games, setGames] = useState([]);
  const [consoles, setConsoles] = useState([]);
  const [form, setForm] = useState({
    title: "",
    condition: "",
    has_box: false,
    has_manual: false,
    console_id: "",
  });
  const [editGameId, setEditGameId] = useState(null);
  const [newConsoleName, setNewConsoleName] = useState("");
  const [editingConsoleId, setEditingConsoleId] = useState(null);
  const [editingConsoleName, setEditingConsoleName] = useState("");

  const conditionOptions = [
    "New",
    "Like New",
    "Very Good",
    "Good",
    "Acceptable",
    "Damaged",
  ];

  useEffect(() => {
    fetchGames();
    fetchConsoles();
  }, []);

  const fetchGames = async () => {
    const res = await getGames();
    setGames(res.data);
  };

  const fetchConsoles = async () => {
    const res = await getConsoles();
    setConsoles(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.console_id) {
      alert("Please select a console.");
      return;
    }

    if (editGameId) {
      await updateGame(editGameId, form);
    } else {
      await createGame(form);
    }

    resetForm();
    fetchGames();
  };

  const resetForm = () => {
    setForm({
      title: "",
      condition: "",
      has_box: false,
      has_manual: false,
      console_id: "",
    });
    setEditGameId(null);
  };

  const handleDeleteGame = async (id) => {
    await deleteGame(id);
    fetchGames();
  };

  const handleEditGame = (game) => {
    setForm({
      title: game.title,
      condition: game.condition,
      has_box: game.has_box,
      has_manual: game.has_manual,
      console_id: game.console_id,
    });
    setEditGameId(game.id);
  };

  const handleNewConsoleChange = (e) => {
    setNewConsoleName(e.target.value);
  };

  const handleAddConsole = async (e) => {
    e.preventDefault();
    const name = newConsoleName.trim();
    if (!name) {
      alert("Console name cannot be empty.");
      return;
    }
    if (consoles.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      alert("This console already exists.");
      return;
    }

    try {
      await createConsole({ name });
      setNewConsoleName("");
      fetchConsoles();
    } catch (error) {
      console.error(
        "Error creating console:",
        error.response?.data || error.message
      );
      alert("Error adding console.");
    }
  };

  const handleDeleteConsole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this console?"))
      return;
    try {
      await deleteConsole(id);
      fetchConsoles();
    } catch (error) {
      alert("Error deleting console. It may have games associated.");
    }
  };

  const startEditingConsole = (id, name) => {
    setEditingConsoleId(id);
    setEditingConsoleName(name);
  };

  const handleEditConsoleChange = (e) => {
    setEditingConsoleName(e.target.value);
  };

  const handleSaveConsole = async () => {
    const name = editingConsoleName.trim();
    if (!name) {
      alert("Console name cannot be empty.");
      return;
    }
    if (
      consoles.some(
        (c) =>
          c.name.toLowerCase() === name.toLowerCase() &&
          c.id !== editingConsoleId
      )
    ) {
      alert("Another console with this name already exists.");
      return;
    }

    try {
      await updateConsole(editingConsoleId, { name });
      setEditingConsoleId(null);
      setEditingConsoleName("");
      await fetchConsoles();
      await fetchGames();
    } catch (error) {
      alert("Error updating console.");
    }
  };

  const handleCancelEditConsole = () => {
    setEditingConsoleId(null);
    setEditingConsoleName("");
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h1>🎮 Retro Game Inventory</h1>

      {/* Consoles Section */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Add Console</h2>
        <form
          onSubmit={handleAddConsole}
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <input
            type="text"
            placeholder="Console name"
            value={newConsoleName}
            onChange={handleNewConsoleChange}
          />
          <button type="submit">Add</button>
        </form>

        <h3>Available Consoles</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {consoles.map((c) => (
            <li key={c.id} style={{ marginBottom: "0.5rem" }}>
              {editingConsoleId === c.id ? (
                <>
                  <input
                    value={editingConsoleName}
                    onChange={handleEditConsoleChange}
                    style={{ marginRight: "0.5rem" }}
                  />
                  <button onClick={handleSaveConsole}>💾</button>
                  <button
                    onClick={handleCancelEditConsole}
                    style={{ marginLeft: "0.3rem" }}
                  >
                    ❌
                  </button>
                </>
              ) : (
                <>
                  {c.name}
                  <button
                    onClick={() => startEditingConsole(c.id, c.name)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteConsole(c.id)}
                    style={{ marginLeft: "0.5rem", color: "red" }}
                  >
                    🗑️
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Game Form */}
      <section>
        <h2>{editGameId ? "Edit Game" : "Add Game"}</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            required
          >
            <option value="">Select condition</option>
            {conditionOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <select
            name="console_id"
            value={form.console_id}
            onChange={handleChange}
            required
          >
            <option value="">Select console</option>
            {consoles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              name="has_box"
              checked={form.has_box}
              onChange={handleChange}
            />
            Includes box
          </label>
          <label>
            <input
              type="checkbox"
              name="has_manual"
              checked={form.has_manual}
              onChange={handleChange}
            />
            Includes manual
          </label>
          <button type="submit">
            {editGameId ? "Update Game" : "Add Game"}
          </button>
          {editGameId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginTop: "0.5rem" }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      {/* Game List */}
      <section>
        <h2>Game List</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {games.map((game) => (
            <li key={game.id} style={{ marginBottom: "1rem" }}>
              <strong>{game.title}</strong> ({game.console_obj?.name}) -{" "}
              {game.condition}
              {game.has_box && " [Box]"}
              {game.has_manual && " [Manual]"}
              <button
                onClick={() => handleEditGame(game)}
                style={{ marginLeft: "1rem" }}
              >
                ✏️
              </button>
              <button
                onClick={() => handleDeleteGame(game.id)}
                style={{ marginLeft: "0.5rem", color: "red" }}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
