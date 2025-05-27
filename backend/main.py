from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import models, schemas, crud, database

# Crear tablas
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Inventario de Juegos Retro")

# Middleware CORS para permitir conexión desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency: obtener conexión a la base de datos
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"mensaje": "API del inventario de juegos funcionando 🎮"}

@app.get("/games", response_model=list[schemas.Game])
def list_games(db: Session = Depends(get_db)):
    return crud.get_games(db)

@app.get("/games/{game_id}", response_model=schemas.Game)
def read_game(game_id: int, db: Session = Depends(get_db)):
    db_game = crud.get_game(db, game_id)
    if db_game is None:
        raise HTTPException(status_code=404, detail="Juego no encontrado")
    return db_game

@app.post("/games", response_model=schemas.Game)
def create_game(game: schemas.GameCreate, db: Session = Depends(get_db)):
    return crud.create_game(db, game)

@app.put("/games/{game_id}", response_model=schemas.Game)
def update_game(game_id: int, game: schemas.GameCreate, db: Session = Depends(get_db)):
    db_game = crud.update_game(db, game_id, game)
    if db_game is None:
        raise HTTPException(status_code=404, detail="Juego no encontrado")
    return db_game

@app.delete("/games/{game_id}")
def delete_game(game_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_game(db, game_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Juego no encontrado")
    return {"ok": True}

@app.get("/consoles", response_model=list[schemas.Console])
def list_consoles(db: Session = Depends(get_db)):
    return crud.get_consoles(db)

@app.post("/consoles", response_model=schemas.Console)
def create_console(console: schemas.ConsoleCreate, db: Session = Depends(get_db)):
    return crud.create_console(db, console)

@app.delete("/consoles/{console_id}", status_code=204)
def delete_console(console_id: int, db: Session = Depends(get_db)):
    console = db.query(models.Console).filter(models.Console.id == console_id).first()
    if not console:
        raise HTTPException(status_code=404, detail="Console not found")
    db.delete(console)
    db.commit()
    return

@app.put("/consoles/{console_id}", response_model=schemas.Console)
def update_console(console_id: int, updated_console: schemas.ConsoleCreate, db: Session = Depends(get_db)):
    db_console = crud.update_console(db, console_id, updated_console)
    if db_console is None:
        raise HTTPException(status_code=404, detail="Consola no encontrada")
    return db_console

@app.delete("/consoles/{console_id}", response_model=schemas.Console)
def delete_console(console_id: int, db: Session = Depends(get_db)):
    db_console = crud.delete_console(db, console_id)
    if db_console is None:
        raise HTTPException(status_code=404, detail="Consola no encontrada")
    return db_console