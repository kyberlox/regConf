import openpyxl
from openpyxl import load_workbook
from openpyxl import Workbook

from sqlalchemy import create_engine
from sqlalchemy import select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import create_engine, MetaData, Column, Integer, Text, Float

engine = create_engine('postgresql+psycopg2://kyberlox:4179@postgres/pdb')

class Base(DeclarativeBase): pass

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

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autoflush=True, bind=engine)
db = SessionLocal()

def migration():
    result = []
    wb1 = load_workbook("./Table2.xlsx")
    sheet = wb1['Лист1']

    par_result = {"added" : [], "exists" : []}
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
            par_result["added"].append(curr)
        #если есть - пропустить
        else:
            curr = {
                "ID" : request.id,  
                "T" : request.T, 
                "Pn" : request.Pn, 
                "P" : request.P
            }
            par_result["exists"].append(curr)
        
    result.append(par_result)

    wb2 = load_workbook("./Table10.xlsx")
    sheet = wb2['Лист1']

    par_result = {"added" : [], "exists" : []}

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
            par_result["added"].append(curr)
        #если есть - пропустить
        else:
            curr = {
                "ID" : request.id,  
                "T" : request.T, 
                "Pn" : request.Pn, 
                "P" : request.P
            }
            par_result["exists"].append(curr)
            
        result.append(par_result)

    return result

def searchT2(T, Pn):
    #найти все подходящие строки их DNS и P1 - больше искомых
    request = db.query(Table2).filter(Table2.T >= T, Table2.Pn >= Pn).all()

    if request == None:
        return False
    ans = False

    #найти самы подходящий - MIN по DNS и P1
    minT = request[0].T
    minPn = request[0].Pn
    for example in request:
        if (example.T <= minT) and (example.Pn <= minPn):
            minT = example.T
            minPn = example.Pn
            ans = {
                "ID" : example.id,  
                "T" : example.T, 
                "Pn" : example.Pn, 
                "PN" : example.P
            }
    
    return ans

def searchT10(T, Pn):
    #найти все подходящие строки их DNS и P1 - больше искомых
    request = db.query(Table10).filter(Table10.T >= T, Table10.Pn >= Pn).all()

    if request == None:
        return False
    ans = False

    #найти самы подходящий - MIN по DNS и P1
    minT = request[0].T
    minPn = request[0].Pn
    for example in request:
        if (example.T <= minT) and (example.Pn <= minPn):
            minT = example.T
            minPn = example.Pn
            ans = {
                "ID" : example.id,  
                "T" : example.T, 
                "Pn" : example.Pn, 
                "PN" : example.P
            }
    
    return ans

print(searchT2(251, 15))

print(searchT10(251, 15))