from sqlalchemy.orm import Session
from . import models, schemas

def get_games(db: Session):
    return db.query(models.Game).all()

def get_game(db: Session, game_id: int):
    return db.query(models.Game).filter(models.Game.id == game_id).first()

def create_game(db: Session, game: schemas.GameCreate):
    db_game = models.Game(**game.dict())
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

def update_game(db: Session, game_id: int, updated_data: schemas.GameCreate):
    db_game = get_game(db, game_id)
    if db_game:
        for key, value in updated_data.dict().items():
            setattr(db_game, key, value)
        db.commit()
        db.refresh(db_game)
    return db_game

def delete_game(db: Session, game_id: int):
    db_game = get_game(db, game_id)
    if db_game:
        db.delete(db_game)
        db.commit()
    return db_game

def get_consoles(db: Session):
    return db.query(models.Console).all()

def create_console(db: Session, console: schemas.ConsoleCreate):
    db_console = models.Console(name=console.name)
    db.add(db_console)
    db.commit()
    db.refresh(db_console)
    return db_console

def get_console(db: Session, console_id: int):
    return db.query(models.Console).filter(models.Console.id == console_id).first()

def update_console(db: Session, console_id: int, updated_data: schemas.ConsoleCreate):
    db_console = get_console(db, console_id)
    if db_console:
        db_console.name = updated_data.name
        db.commit()
        db.refresh(db_console)
    return db_console

def delete_console(db: Session, console_id: int):
    db_console = get_console(db, console_id)
    if db_console:
        db.delete(db_console)
        db.commit()
    return db_console
