from django.db.models import ForeignKey
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import create_engine, MetaData, Column, Integer, Text, Float, JSON
from sqlalchemy.dialects.postgresql import JSONB

import redis

import json

engine = create_engine('postgresql+psycopg2://kyberlox:4179@postgres/pdb')

class Base(DeclarativeBase): pass

class UserData(Base):
    __tablename__ = 'user_table'
    id = Column(Integer, primary_key=True)
    fio = Column(Text, nullable=True)
    uuid = Column(Text, nullable=True)
    department = Column(Text, nullable=True)
    ip = Column(Text, nullable=True)

class Cofigurations(Base):
    __tablename__ = 'configuration_table'
    id = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey('user_table.id'))
    jsn = Column(JSONB, nullable=True)

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autoflush=True, bind=engine)
db = SessionLocal()

class UserRedis:
    def __init__(self, user_id, jsn):
        self.r = redis.Redis(host='redis', port=6379, user="kyberlox", password="4179", db=0)
        self.user_id = user_id
        self.jsn = jsn

    def set_user(self):
        self.r.set(self.user_id, json.dumps([]))

    def get_user(self):
        return self.r.get(self.user_id)

    def update_user(self):
        self.r.set(self.user_id, json.dumps(self.jsn))

    def delete_user(self):
        self.r.delete(self.user_id)



class User:
    def __init__(self, token, ip, Id, fio, uuid, department, jsn):
        self.token = token
        self.ip = ip
        self.Id = Id
        self.fio = fio
        self.uuid = uuid
        self.department = department
        self.current_json = jsn
        self.Redis = UserRedis(self.user_id, self.jsn, self.ip)



    def add_user_db(self):
        pass

    def get_user_db(self):
        pass

    def add_file_db(self):
        pass

    def get_user_file(self):
        pass



    def authenticate(self):
        #если токена нет
        #запрос в БД
        #если в БД есть пользователь -> дать токен и запустить сессию в редисе
        #если в БД нет пользователя
        #и данные валидные -> добавить его в БД, дать токен и запустить сессию в редисе
        #и данные не валидные -> получить ip и не запускать сессию в редисе
        #если токен есть ->валидируем запрос
        pass

    def create_TKP(self):
        #сохранить в БД
        pass

    def create_OL(self):
        #сохранить в БД
        pass