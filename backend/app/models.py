from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Console(Base):
    __tablename__ = "consoles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    games = relationship("Game", back_populates="console")  # relación con Game

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    condition = Column(String)
    has_box = Column(Boolean, default=False)
    has_manual = Column(Boolean, default=False)
    console_id = Column(Integer, ForeignKey("consoles.id"))

    console = relationship("Console", back_populates="games")  # relación inversa
