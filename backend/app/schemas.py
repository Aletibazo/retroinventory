from pydantic import BaseModel

# --- Consolas ---
class ConsoleBase(BaseModel):
    name: str

class ConsoleCreate(ConsoleBase):
    pass

class Console(ConsoleBase):
    id: int

    class Config:
        orm_mode = True

# --- Juegos ---
class GameBase(BaseModel):
    title: str
    condition: str
    has_box: bool = False
    has_manual: bool = False
    console_id: int  # ID de consola relacionada

class GameCreate(GameBase):
    pass

class Game(GameBase):
    id: int
    console: Console  # <- esta línea debe coincidir con el nombre del atributo en `models.Game`

    class Config:
        orm_mode = True
