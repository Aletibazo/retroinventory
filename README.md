# Retro Games Inventory

Web App for managing retro gaming inventories.

Current development version includes support for creating games and consoles and managing them.

## Prerequisites

### Backend

- Python 3.10 or higher
- pip
- virtualenv

### Frontend

- Node.js (v18 or higher)
- npm (v9.5 or higher)

## Set up backend

```
$ cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend
$ uvicorn main:app --reload
```

Backend should be available at http://localhost:8000

## Set up frontend

```
$ cd ../frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend should be available at http://localhost:3000
