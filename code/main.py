from fastapi import FastAPI, File, UploadFile, Body, Response, Cookie, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import HTTPException

from Raschet import Raschet, mixture, mark_params, get_tightness, make_XL

import openpyxl
from openpyxl import load_workbook
from openpyxl import Workbook

from sqlalchemy import create_engine
from sqlalchemy import select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import create_engine, MetaData, Column, Integer, Text, Float

import psycopg2

import json

def DB_exec(command):
    conn = psycopg2.connect(dbname="pdb", host="postgres", user="kyberlox", password="4179", port="5432")
    cursor = conn.cursor()
    cursor.execute(command)
    conn.commit()
    conn.close()

def DB_fetchOne(command):
    conn = psycopg2.connect(dbname="pdb", host="postgres", user="kyberlox", password="4179", port="5432")
    cursor = conn.cursor()
    cursor.execute(command)
    answer = cursor.fetchone()[0]
    conn.close()
    return answer

def DB_fetchAll(command):
    conn = psycopg2.connect(dbname="pdb", host="postgres", user="kyberlox", password="4179", port="5432")
    cursor = conn.cursor()
    cursor.execute(command)
    answer = cursor.fetchall()
    conn.close()
    return answer



engine = create_engine('postgresql+psycopg2://kyberlox:4179@postgres/pdb')

class Base(DeclarativeBase): pass

class Table(Base):
    __tablename__ = 'environment_table'
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    environment = Column(Text)
    molecular_weight = Column(Float, nullable=True)
    density = Column(Float, nullable=True)
    material = Column(Text, nullable=True)
    viscosity = Column(Float, nullable=True)
    isobaric_capacity = Column(Float, nullable=True)
    molar_mass = Column(Float, nullable=True)
    isochoric_capacity = Column(Float, nullable=True)
    adiabatic_index = Column(Float, nullable=True)
    compressibility_factor = Column(Float, nullable=True)

class Params(Base):
    __tablename__ = 'parametrs_table'
    id = Column(Integer, primary_key=True)
    DNS = Column(Float, nullable=True)
    P1 = Column(Float, nullable=True)
    DN = Column(Float, nullable=True)
    PN = Column(Float, nullable=True)
    spring_material = Column(Text, nullable=True)
    spring_number = Column(Text, nullable=True)
    valve_type = Column(Text, nullable=True)

class Table2(Base):
    __tablename__ = 'table2'
    id = Column(Integer, primary_key=True)
    T = Column(Float, nullable=True)
    Pn = Column(Float, nullable=True)
    P = Column(Float, nullable=True)

class Table10(Base):
    __tablename__ = 'table10'
    id = Column(Integer, primary_key=True)
    T = Column(Float, nullable=True)
    Pn = Column(Float, nullable=True)
    P = Column(Float, nullable=True)

class pakingParams(Base):
    __tablename__ = 'paking_params'
    id = Column(Integer, primary_key=True)
    mark = Column(Text, nullable=True)
    DN = Column(Float, nullable=True)
    PN = Column(Float, nullable=True)
    M = Column(Float, nullable=True)
    S = Column(Float, nullable=True)

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autoflush=True, bind=engine)
db = SessionLocal()



app = FastAPI()



origins = [
    "http://localhost:8000",
    "http://localhost:5173",
    "http://reg.conf"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PUT", "OPTIONS", "PATH"],
    allow_headers=["Content-Type", "Accept", "Location", "Allow", "Content-Disposition", "Sec-Fetch-Dest"],
)

#app.mount("/", StaticFiles(directory="../front/dist", html=True), name="static")

#миграция и таблицы эксель
@app.get("/api/migration")
def migration():
    #прочитать из таблицы
    wb = load_workbook("./table.xlsx")
    sheet = wb['table']
    column_names = [
        "name",
        "environment",
        "molecular_weight",
        "density",
        "material",
        "viscosity",
        "isobaric_capacity",
        "molar_mass",
        "isochoric_capacity",
        "adiabatic_index",
        "compressibility_factor"
    ]
    cell_names = ['A', 'B', 'C', 'D', 'E',  'F', 'G',  'H', 'I',  'J', 'K']
    
    result = []
    for i in range(3, sheet.max_row+1):
        row = dict()
        for j in range(len(column_names)):
            row[f"{column_names[j]}"] = sheet[f"{cell_names[j]}{i}"].value
        result.append(row)
    
    #записать в БД
    for env in result:
        #построчная запись после проверки
        line = Table(name = env['name'], environment = env['environment'], molecular_weight = env['molecular_weight'], density = env['density'], material = env['material'], viscosity = env['viscosity'], isobaric_capacity = env['isobaric_capacity'], molar_mass = env['molar_mass'], isochoric_capacity = env['isochoric_capacity'], adiabatic_index = env['adiabatic_index'], compressibility_factor = env['compressibility_factor'])
        #lines = select(Table).where(Table.name == env['name'], Table.environment == env['environment'])
        lines = db.query(Table).filter(Table.name == env['name'], Table.environment == env['environment']).first()
        
        if lines == None:
            db.add(line)
            db.commit()
            env['id'] = line.id
        #перезаписать в БД
        else:
            line = db.query(Table).filter(Table.name == env['name'] and Table.environment == env['environment']).first()
            params = [line.environment, line.molecular_weight, line.density, line.material, line.viscosity, line.isobaric_capacity, line.molar_mass, line.isochoric_capacity, line.adiabatic_index, line.compressibility_factor]
            keys = ["environment", "molecular_weight", "density", "material", "viscosity", "isobaric_capacity", "molar_mass", "isochoric_capacity", "adiabatic_index", "compressibility_factor"]
            need = False
            for i in range(len(keys)):
                if params[i] != env[keys[i]]:
                    params[i] = env[keys[i]]
                    need = True
            if need:
                db.commit()
    
    #миграция параметров DN и PN
    WB = load_workbook("./PNtoDN.xlsx")
    sheet = WB['full']

    par_result = {"added" : [], "exists" : []}

    for i in range(2, sheet.max_row+1):
        DNS = float(sheet[f"A{i}"].value)
        P1_max = float(sheet[f"D{i}"].value)
        DN = float(sheet[f"C{i}"].value)
        PN = float(sheet[f"B{i}"].value)
        spring_material = str(sheet[f"F{i}"].value)
        spring_number = str(sheet[f"E{i}"].value)
        valve_type = str(sheet[f"H{i}"].value)

        #экземпляр таблицы параметров
        example = Params(DNS = DNS, P1 = P1_max, DN = DN, PN = PN, spring_material = spring_material, spring_number = spring_number, valve_type = valve_type)
        
        #есть ли такая запись?
        request = db.query(Params).filter(Params.DNS == DNS, Params.P1 == P1_max, Params.DN == DN, Params.PN == PN, Params.spring_material == spring_material, Params.spring_number == spring_number, Params.valve_type == valve_type).first()
        #print(request)

        #если нет - добавить
        if request == None:
            db.add(example)
            db.commit()

            curr = {
                "№" : i,
                "ID" : example.id,  
                "DNS" : DNS, 
                "P1" : P1_max, 
                "DN" : DN, 
                "PN" : PN, 
                "spring_material" : spring_material,
                "spring_number" : spring_number,
                "valve_type" : valve_type
            }
            par_result["added"].append(curr)

        #если есть - пропустить
        else:
            curr = {
                "ID" : request.id,  
                "DNS" : request.DNS, 
                "P1" : request.P1, 
                "DN" : request.DN, 
                "PN" : request.PN, 
                "spring_material" : request.spring_material,
                "spring_number" : spring_number,
                "valve_type" : valve_type
            }
            par_result["exists"].append(curr)

    wb1 = load_workbook("./Table2.xlsx")
    sheet = wb1['Лист1']

    t2_result = {"added" : [], "exists" : []}
    for i in range(2, sheet.max_row+1):
        T = float(sheet[f"A{i}"].value)
        Pn = float(sheet[f"B{i}"].value)
        P = float(sheet[f"C{i}"].value)

        #print(i, T, Pn, P)

        example = Table2(T=T, Pn=Pn, P=P)
        request = db.query(Table2).filter(Table2.T == T, Table2.Pn == Table2.Pn, Table2.P == P).first()

        #если нет - добавить
        if request == None:
            db.add(example)
            db.commit()

            curr = {
                "№" : i,
                "ID" : example.id,  
                "T" : T, 
                "Pn" : Pn, 
                "P" : P
            }
            t2_result["added"].append(curr)
        #если есть - пропустить
        else:
            curr = {
                "ID" : request.id,  
                "T" : request.T, 
                "Pn" : request.Pn, 
                "P" : request.P
            }
            t2_result["exists"].append(curr)
        
    result.append(par_result)

    wb2 = load_workbook("./Table10.xlsx")
    sheet = wb2['Лист1']

    t10_result = {"added" : [], "exists" : []}

    for i in range(2, sheet.max_row+1):
        T = float(sheet[f"A{i}"].value)
        Pn = float(sheet[f"B{i}"].value)
        P = float(sheet[f"C{i}"].value)

        example = Table10(T=T, Pn=Pn, P=P)
        request = db.query(Table10).filter(Table10.T == T, Table10.Pn == Table10.Pn, Table10.P == P).first()
        
        #если нет - добавить
        if request == None:
            db.add(example)
            db.commit()

            curr = {
                "№" : i,
                "ID" : example.id,  
                "T" : T, 
                "Pn" : Pn, 
                "P" : P
            }
            t10_result["added"].append(curr)
        #если есть - пропустить
        else:
            curr = {
                "ID" : request.id,  
                "T" : request.T, 
                "Pn" : request.Pn, 
                "P" : request.P
            }
            t10_result["exists"].append(curr)

    result.append(t10_result)

    wb3 = load_workbook("./paking_params.xlsx")
    sheet = wb3["result"]

    pak_res = {"added" : [], "exists" : []}
    for i in range(2, sheet.max_row):
        mark = str(sheet[f"A{i}"].value)
        DN = float(sheet[f"B{i}"].value)
        PN = float(sheet[f"C{i}"].value)
        M = sheet[f"D{i}"].value
        S = float(sheet[f"E{i}"].value)
        if type(M) == type("") or type(M) == type(1.0):
            M = float(sheet[f"D{i}"].value)
        else:
            M = None

        example = pakingParams(mark=mark, DN=DN, PN=PN, M=M, S=S)
        request = db.query(pakingParams).filter(pakingParams.mark == mark, pakingParams.DN == DN, pakingParams.PN == PN).first()

        #если нет - добавить
        if request == None:
            db.add(example)
            db.commit()

            curr = {
                "№" : i,
                "ID" : example.id,  
                "mark" : mark, 
                "DN" : DN, 
                "PN" : PN,
                "M" : M,
                "S" : S
            }
            pak_res["added"].append(curr)
        #если есть - пропустить
        else:
            curr = {
                "№" : i,
                "ID" : example.id,  
                "mark" : mark, 
                "DN" : DN, 
                "PN" : PN,
                "M" : M,
                "S" : S
            }
            pak_res["exists"].append(curr)



    return {"environmentTable" : result, "valveParametrsTable" : par_result, "Table2" : t2_result, "Table10" : t10_result, "PackingParams" : pak_res}

#подбор сред
@app.get("/api/get_table")
async def get_table():
    #вывод словаря
    environments = []
    lines = db.query(Table).all()
    for line in lines:
        environment = {
            "id" : line.id,
            "name" : line.name,
            "environment" : line.environment,
            "molecular_weight" : line.molecular_weight,
            "density" : line.density,
            "material" : line.material,
            "viscosity" : line.viscosity,
            "isobaric_capacity" : line.isobaric_capacity,
            "molar_mass" : line.molar_mass,
            "isochoric_capacity" : line.isochoric_capacity,
            "adiabatic_index" : line.adiabatic_index,
            "compressibility_factor" : line.compressibility_factor
        }
            
        environments.append(environment)
    
    return environments

#подбор смесей
@app.post("/api/get_compound")
async def get_compound(data = Body()):
    environments = []
    lines = db.query(Table).all()
    for line in lines:
        for env in data:
            ID = env["id"]
            r = env["r"]
            if line.id == ID:
                environment = {
                    "id" : line.id,
                    "name" : line.name,
                    "environment" : line.environment,
                    "molecular_weight" : line.molecular_weight,
                    "density" : line.density,
                    "material" : line.material,
                    "viscosity" : line.viscosity,
                    "isobaric_capacity" : line.isobaric_capacity,
                    "molar_mass" : line.molar_mass,
                    "isochoric_capacity" : line.isochoric_capacity,
                    "adiabatic_index" : line.adiabatic_index,
                    "compressibility_factor" : line.compressibility_factor,
                    "r" : r
                }
                        
                environments.append(environment)

    return mixture(environments)

#получение осатльных параметров
@app.post("/api/get_pressure")
def get_pressure(data = Body()):
    for key in data.keys():
        if ((data[key] == "") or (data[key] == None)):
            return {"error" : "incorrect value", "key" : key, "value" : data[key]}
        else:
            #расчет
            return Raschet(data)

#подбор оборудования
@app.post("/api/get_mark_params")
async def get_mark_params(data = Body()):
    return mark_params(data)

@app.post("/api/get_tightness")
async def web_get_tightness(data = Body()):
    return get_tightness(data)



#авторизазия => генерация токена, начало сессии

#добавить в корзину элемент

#выгрузить из корзины элемент

#изменить элемент

#удалить из корзиный элемент

#просмотр корзины

#выгрузка корзины -> опустошение -> сохранить в БД

#генерация документации
@app.post("/api/generate") #проверка сессии
def generate(data = Body()):
    #запись в БД

    #удалить предыдущий эксель файл и чтение ID
    ID = 1

    #сохранить json
    f = open(f"./data/TKP{ID}.json", 'w')
    json.dump(data, f)
    f.close()
    
    #генерация файла
    make_XL(data, ID)

    #выдать файл
    return FileResponse(f'TKPexample.xlsx', filename=f'ТКП ПК {ID}.xlsx', media_type='application/xlsx')
