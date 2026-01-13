from sqlalchemy import create_engine, select, update
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import create_engine, MetaData, Column, Integer, Text, Float, JSON, Date, Time, Boolean
from sqlalchemy.dialects.postgresql import JSONB

from jwt import encode, decode

#import rsa
#(key_write, key_read) = rsa.newkeys(512)

import redis

import json

import os
from dotenv import load_dotenv

import datetime

import requests

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
    author_id = Column(Integer, nullable=True)
    name = Column(Text, nullable=True)
    jsn = Column(JSONB, nullable=True)
    date = Column(Date, nullable=True)
    time = Column(Time, nullable=True)

class Attempts(Base):
    __tablename__ = 'attempts_table'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=True)
    jsn = Column(JSONB, nullable=True)
    date = Column(Date, nullable=True)
    time = Column(Time, nullable=True)



Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autoflush=True, bind=engine)
db = SessionLocal()

#Функция для получения данных о пользователе по session_id
def check_session_id(token):
    # url = "http://intranet.emk.org.ru/api/auth_router/check"
    url = "https://intranet.emk.ru/api/auth_router/check"
    cookies = { 'session_id': token}
    res = requests.get(url, cookies=cookies)
    return json.loads(res.text)

class UserRedis:
    def __init__(self, user_id=0, jsn=json.dumps([])):
        self.r = redis.Redis(host='redis', port=6379, password=pswd, db=0)
        self.user_id = user_id
        self.jsn = jsn

    def set_user(self):
        self.r.set(self.user_id, json.dumps([]))

    def get_user(self):
        jsn = self.r.get(self.user_id)
        #print(jsn)
        self.jsn = json.loads(jsn)
        return self.jsn

    def update_user(self):
        self.r.setex(self.user_id, 3600, json.dumps(self.jsn))

    def delete_user(self):
        self.r.delete(self.user_id)



class User:
    def __init__(self, token=encode({"uuid" : ""}, "emk", "HS512"), ip="", Id=0, fio="", uuid="", department="", jsn=dict()):
        self.token = token
        self.ip = ip
        self.Id = Id
        self.fio = fio
        self.uuid = uuid
        self.department = department
        self.current_json = jsn
        self.Redis = UserRedis(self.uuid, self.current_json)

    def authenticate(self, sess_token: str = None):
        #либо есть токен
        uuid = decode(self.token, key="emk", algorithms=["HS512"])['uuid']
        usr_uuid = db.query(UserData).filter_by(uuid=uuid).first()
        usr_ip = db.query(UserData).filter_by(ip=uuid).first()
        # или есть такой пользователь
        if uuid != "":
            #или он == uuid
            if usr_uuid is not None:
                r = UserRedis(usr_uuid.uuid, self.current_json)
                r.set_user()

                return self.token

            #или он == ip
            elif usr_ip is not None:
                return self.token

            #или он подделка
            else:
                return False

        #либо есть uuid, fio, department
        elif self.uuid != "" and self.fio != "" and self.department != "":
            usr_uuid = db.query(UserData).filter_by(uuid=self.uuid).first()

            #или он уже есть
            if usr_uuid is not None:
                self.uuid = usr_uuid.uuid
                r = UserRedis(self.uuid, self.current_json)
                r.set_user()

                # self.token = encode({"uuid" : self.uuid}, "emk", "HS512")
                self.token = sess_token

                return self.token

            #или регистрируем
            else:
                usr = UserData(fio=self.fio, uuid=self.uuid, department=self.department)
                db.add(usr)
                db.commit()

                self.Id = usr.id

                r = UserRedis(self.uuid, self.current_json)
                r.set_user()

                # self.token = encode({"uuid" : self.uuid}, "emk", "HS512")
                self.token = sess_token
                return self.token

        #либо есть ip
        elif self.ip != "":
            usr = db.query(UserData).filter_by(ip=self.ip).first()
            #или такой ip уже был
            if usr is not None:
                encode({"uuid": self.ip}, "emk", "HS512")
                return self.token

            #или регистрируем
            else:
                usr = UserData(ip=self.ip)
                db.add(usr)
                db.commit()

                encode({"uuid": self.ip}, "emk", "HS512")

                return self.token
        else:
            return False

    '''
    def auth(self):
        #проеврка токена
        tkn_valid=False
        #декодируем токен в uuid
        #uuid = rsa.decrypt(self.token, key_read).decode('utf8')
        try:
            uuid = decode(token, key='emk', algorithms=["HS512"])
            tkn_valid = True

            #ищем пользователя с таким uuid
            usr = db.query(UserData).filter_by(uuid=uuid).first()
            #если пользователь есть

            # если токена нет
            if uuid == "":

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
    '''

    def check(self):

        try:
            self.uuid = decode(self.token, key="emk", algorithms=["HS512"])['uuid']
            #print("uuid", self.uuid)
            self.Redis = UserRedis().r
            if  self.Redis.exists(self.uuid) == 1:
                return True
            else:
                return False
        except:
            return None



    def set_dt(self):
        #загрузить json
        user_info = check_session_id(self.token)
        
        if 'authenticated' in user_info.keys() and user_info['authenticated'] is True:
            if 'uuid' in user_info['user'].keys()
                self.uuid = user_info['user']['uuid']
            elif 'XML_ID' in user_info['user'].keys():
                self.uuid = user_info['user']['XML_ID'][3:]
        else:
            self.uuid = decode(self.token, key="emk", algorithms=["HS512"])['uuid']
        self.Redis = UserRedis(user_id=self.uuid, jsn=self.current_json)
        self.Redis.update_user()

    def get_dt(self):
        #выгрузить json
        user_info = check_session_id(self.token)
        if 'authenticated' in user_info.keys() and user_info['authenticated'] is True:
            if 'uuid' in user_info['user'].keys()
                self.uuid = user_info['user']['uuid']
            elif 'XML_ID' in user_info['user'].keys():
                self.uuid = user_info['user']['XML_ID'][3:]
        else:
            self.uuid = decode(self.token, key="emk", algorithms=["HS512"])['uuid']
        self.Redis = UserRedis(user_id=self.uuid)

        return self.Redis.get_user()

    def outh(self):
        #разлогинить пользователя в redis
        user_info = check_session_id(self.token)
        if 'authenticated' in user_info.keys() and user_info['authenticated'] is True:
            if 'uuid' in user_info['user'].keys()
                self.uuid = user_info['user']['uuid']
            elif 'XML_ID' in user_info['user'].keys():
                self.uuid = user_info['user']['XML_ID'][3:]
        else:
            self.uuid = decode(self.token, key="emk", algorithms=["HS512"])['uuid']
        try:
            self.Redis = UserRedis(user_id=self.uuid)
            self.Redis.delete_user()
        except:
            return False



    def create_TKP(self, name):
        user_info = check_session_id(self.token)
        if 'authenticated' in user_info.keys() and user_info['authenticated'] is True:
            if 'uuid' in user_info['user'].keys()
                self.uuid = user_info['user']['uuid']
            elif 'XML_ID' in user_info['user'].keys():
                self.uuid = user_info['user']['XML_ID'][3:]
        else:
            self.uuid = decode(self.token, key="emk", algorithms=["HS512"])['uuid']

        #определить id исходя из uuid
        usr = db.query(UserData).filter_by(uuid=self.uuid).first()
        if usr is not None:
            #print(usr.id)
            self.Id = usr.id

            #взять json из Redis
            self.current_json = UserRedis(user_id=self.uuid).get_user()

            #сохранить в БД
            cnf = Cofigurations(author_id=self.Id, name=name, jsn=self.current_json, date=str(datetime.date.today()), time=datetime.datetime.now().strftime("%H:%M:%S"))
            db.add(cnf)
            db.commit()

            #очистить redis
            r = UserRedis(self.uuid, self.current_json)
            r.set_user()

            return self.current_json

    def create_OL(self):
        #найти по токену uuid или ip
        user_info = check_session_id(self.token)
        if 'authenticated' in user_info.keys() and user_info['authenticated'] is True:
            if 'uuid' in user_info['user'].keys()
                pre_id = user_info['user']['uuid']
            elif 'XML_ID' in user_info['user'].keys():
                pre_id = user_info['user']['XML_ID'][3:]
        else:
            pre_id = decode(self.token, key="emk", algorithms=["HS512"])['uuid']
        #найти в БД
        usr_uuid = db.query(UserData).filter_by(uuid=pre_id).first()
        usr_ip = db.query(UserData).filter_by(ip=pre_id).first()

        if usr_uuid is not None:
            self.Id = usr_uuid.id
        elif usr_ip is not None:
            self.Id = usr_ip.id
        else:
            return {'err' : 'пользователь не найден'}

        #сохранить в БД
        current_time = datetime.datetime.now().time()
        clock_time = current_time.strftime("%H:%M:%S")
        OL = Attempts(user_id=self.Id, jsn=self.current_json, date=str(datetime.date.today()), time=clock_time)
        db.add(OL)
        db.commit()

        return True

    def history(self):
        #история запросов пользователя
        # найти по токену uuid или ip
        user_info = check_session_id(self.token)
        if 'authenticated' in user_info.keys() and user_info['authenticated'] is True:
            if 'uuid' in user_info['user'].keys()
                pre_id = user_info['user']['uuid']
            elif 'XML_ID' in user_info['user'].keys():
                pre_id = user_info['user']['XML_ID'][3:]
        else:
            pre_id = decode(self.token, key="emk", algorithms=["HS512"])['uuid']
        # найти в БД
        usr = db.query(UserData).filter_by(uuid=pre_id).first()

        if usr is not None:
            configs = db.query(Cofigurations).filter_by(author_id=usr.id).all()
            if configs is not None and configs != []:
                answer = []
                for conf in configs:
                    ans = {
                        'id' : conf.id,
                        'name' : conf.name,
                        'date' : conf.date,
                        'time' : conf.time,
                    }
                    answer.append(ans)

                return answer
            else:
                return False
        else:
            return False



    def uploadConfiguration(self, ID):
        #загрузка ТКП из БД в redis

        # найти по токену uuid или ip
        user_info = check_session_id(self.token)
        if 'authenticated' in user_info.keys() and user_info['authenticated'] is True:
            if 'uuid' in user_info['user'].keys()
                pre_id = user_info['user']['uuid']
            elif 'XML_ID' in user_info['user'].keys():
                pre_id = user_info['user']['XML_ID'][3:]
        else:
            pre_id = decode(self.token, key="emk", algorithms=["HS512"])['uuid']
        # найти в БД пользователя по uuid
        usr = db.query(UserData).filter_by(uuid=pre_id).first()
        #найти файл по ID
        fl = db.query(Cofigurations).filter_by(id=ID).first()

        if usr is not None and fl is not None:
            self.uuid = pre_id
            self.current_json = fl.jsn

            #заполнить сессию Redis
            self.Redis = UserRedis(user_id=self.uuid, jsn=self.current_json)
            self.Redis.update_user()
            #вывести jsn для перосмотра
            return self.current_json
        else:
            return False

    def deleteConfiguration(self, ID):
        #удаление ТПК из БД
        user_info = check_session_id(self.token)
        if 'authenticated' in user_info.keys() and user_info['authenticated'] is True:
            if 'uuid' in user_info['user'].keys()
                pre_id = user_info['user']['uuid']
            elif 'XML_ID' in user_info['user'].keys():
                pre_id = user_info['user']['XML_ID'][3:]
        else:
            pre_id = decode(self.token, key="emk", algorithms=["HS512"])['uuid']
        # найти в БД пользователя по uuid
        usr = db.query(UserData).filter_by(uuid=pre_id).first()
        # найти файл по ID
        fl = db.query(Cofigurations).filter_by(id=ID).first()

        if usr is not None and fl is not None:
            #удалить запсь из БД
            db.delete(fl)
            db.commit()
            return True
        else:
            return False

    def addPosition(self, tkp_position):
        user_info = check_session_id(self.token)
        if 'authenticated' in user_info.keys() and user_info['authenticated'] is True:
            if 'uuid' in user_info['user'].keys()
                self.uuid = user_info['user']['uuid']
            elif 'XML_ID' in user_info['user'].keys():
                self.uuid = user_info['user']['XML_ID'][3:]
        else:
            self.uuid = decode(self.token, key="emk", algorithms=["HS512"])['uuid']
        self.Redis = UserRedis(user_id=self.uuid)
        jsn = self.Redis.get_user()
        jsn.insert(tkp_position["position_num"], tkp_position["body"])
        self.Redis.jsn = jsn
        self.Redis.update_user()

        # сохранить в БД
        tkp = db.query(Cofigurations).filter_by(id=tkp_position["tkp_id"]).first()
        tkp.jsn = jsn
        db.commit()

        return jsn

    def deletePosition(self, tkp_id, position):
        user_info = check_session_id(self.token)
        if 'authenticated' in user_info.keys() and user_info['authenticated'] is True:
            if 'uuid' in user_info['user'].keys()
                self.uuid = user_info['user']['uuid']
            elif 'XML_ID' in user_info['user'].keys():
                self.uuid = user_info['user']['XML_ID'][3:]
        else:
            self.uuid = decode(self.token, key="emk", algorithms=["HS512"])['uuid']
        self.Redis = UserRedis(user_id=self.uuid)
        jsn = self.Redis.get_user()
        jsn.pop(int(position))
        self.Redis.jsn = jsn
        self.Redis.update_user()

        # сохранить в БД
        tkp = db.query(Cofigurations).filter_by(id=tkp_id).first()
        #если позиций не - осталось удалить запись из БД
        if jsn == []:
            db.delete(tkp)
        #если позиции есть - сохранить
        else:
            tkp.jsn = jsn
        db.commit()

        return jsn
