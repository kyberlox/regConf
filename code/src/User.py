from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import create_engine, MetaData, Column, Integer, Text, Float, JSON, Date, Time, Boolean
from sqlalchemy.dialects.postgresql import JSONB

from jwt import encode, decode

import rsa
(key_write, key_read) = rsa.newkeys(512)

import redis

import json

import os
from dotenv import load_dotenv

import datetime

load_dotenv()

user = os.getenv('user')
pswd = os.getenv('pswd')
port = os.getenv('PORT')

engine = create_engine(f'postgresql+psycopg2://{user}:{pswd}@postgres/pdb')

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
    author_id = Column(Text, nullable=True)
    name = Column(Text, nullable=True)
    jsn = Column(JSONB, nullable=True)
    date = Column(Date, nullable=True)
    time = Column(Time, nullable=True)

class Attempts(Base):
    __tablename__ = 'attempts_table'
    id = Column(Integer, primary_key=True)
    ip = Column(Text, nullable=True)
    jsn = Column(JSONB, nullable=True)
    valid = Column(Boolean, nullable=True)
    uuid = Column(Text, nullable=True)
    date = Column(Date, nullable=True)
    time = Column(Time, nullable=True)



Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autoflush=True, bind=engine)
db = SessionLocal()

class UserRedis:
    def __init__(self, user_id, jsn):
        self.r = redis.Redis(host='redis', port=6379, password=pswd, db=0)
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
    def __init__(self, token="", ip="", Id=0, fio="", uuid="", department="", jsn=dict([])):
        self.token = token
        self.ip = ip
        self.Id = Id
        self.fio = fio
        self.uuid = uuid
        self.department = department
        self.current_json = jsn
        self.Redis = UserRedis(self.uuid, self.current_json)

    def authenticate(self):
        #проеврка токена
        tkn_valid=False
        #декодируем токен в uuid
        #uuid = rsa.decrypt(self.token, key_read).decode('utf8')
        try:
            token = decode(self.token, key='emk', algorithms=["HS512"])
            tkn_valid = True

            #ищем пользователя с таким uuid
            usr = db.query(UserData).filter_by(uuid=uuid).first()
            #если пользователь есть

            # если токена нет
            if token == "":

                #если запрос валидный
                if self.uuid != "" and self.fio != "" and self.department != "":

                    #запрос в БД
                    usr = db.query(UserData).filter_by(uuid=self.uuid).first()

                    #если в БД есть пользователь -> запустить сессию в редисе и дать токен
                    if usr != None and usr != []:
                        r = UserRedis(self.uuid, self.current_json)
                        r.set_user()

                        self.Id = usr.id

                        self.token = rsa.encrypt(self.uuid.encode('utf8'), key_write)
                        return self.token

                    #если в БД нет пользователя
                    else:
                        #добавить его в БД, запустить сессию в редисе и дать токен
                        usr = UserData(fio=self.fio, uuid=self.uuid, department=self.department)
                        db.add(usr)
                        db.commit()

                        self.Id = usr.id

                        r = UserRedis(self.uuid, self.current_json)
                        r.set_user()

                        self.token = rsa.encrypt(self.uuid.encode('utf8'), key_write)
                        return self.token

                #получить ip и не запускать сессию в редисе
                else:
                    usr = UserData(ip=self.ip)
                    db.add(usr)
                    db.commit()

                    self.Id = usr.id

                    self.token = rsa.encrypt(self.uuid.encode('utf8'), key_write)

            #если токен есть ->валидируем запрос
            elif tkn_valid:
                return self.token
            # если токен не валидный
        except:
            return False

    def create_TKP(self, name):
        #сохранить в БД
        cnf = Cofigurations(author_id=self.Id, name=name, jsn=self.current_json, date=str(datetime.date.today()), time=str(datetime.time.now()))
        db.add(cnf)
        db.commit()

        #очистить redis
        self.current_json = {}
        r = UserRedis(self.uuid, self.current_json)
        r.set_user()

        return True

    def create_OL(self):
        #сохранить в БД
        pass

    def history(self):
        #история запросов пользователя
        pass

    def outh(self):
        #разлогинить пользователя в redis
        pass

    def uploadConfiguration(self, id):
        #загрузка ТКП из БД в redis
        pass