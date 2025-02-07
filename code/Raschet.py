import math
from math import sqrt, log, exp, pi, log10

#В каких величинах PN? кгс/см2 =>  0.098067 * PN МПа
from sqlalchemy import create_engine
from sqlalchemy import select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import create_engine, MetaData, Column, Integer, Text, Float

engine = create_engine('postgresql+psycopg2://kyberlox:4179@postgres/pdb')

class Base(DeclarativeBase): pass

class Params(Base):
    __tablename__ = 'parametrs_table'
    id = Column(Integer, primary_key=True)
    DNS = Column(Float, nullable=True)
    P1 = Column(Float, nullable=True)
    DN = Column(Float, nullable=True)
    PN = Column(Float, nullable=True)
    spring_material = Column(Text, nullable=True)

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autoflush=True, bind=engine)
db = SessionLocal()



def searchParams(DNS, curP1):
    #найти все подходящие строки их DNS и P1 - больше искомых
    request = db.query(Params).filter(Params.DNS >= DNS, Params.P1 >= curP1).all()

    if request == None:
        return False
    ans = False

    #найти самы подходящий - MIN по DNS и P1
    minDNS = request[0].DNS
    minP1 = request[0].P1
    for example in request:
        if (example.DNS <= minDNS) and (example.P1 <= minP1):
            minDNS = example.DNS
            minP1 = example.P1
            ans = {
                "ID" : example.id,  
                "DNS" : example.DNS, 
                "P1" : example.P1, 
                "DN" : example.DN, 
                "PN" : example.PN, 
                "spring_material" : example.spring_material
            }
    
    return ans

def mixture(envs : list):
    result = {
        "name" : "",
        "environment" : "",
        "molecular_weight" : 0,
        "density" : 0,
        "material" : "",
        "viscosity" : 0,
        "isobaric_capacity" : 0,
        "molar_mass" : 0,
        "isochoric_capacity" : 0,
        "adiabatic_index" : 0,
        "compressibility_factor" : 0
    }

    
    env_type = set()
    for env in envs:
        env_type.add(env["environment"])

    material = []
    for env in envs:
        material.append(env['material'])
    
    ln = 0
    for mat in material:
        if len(mat) > ln:
            ln = len(mat)
            result["material"] = mat

    #проверка типа среды смеси
    if len(env_type) == 1: #если среда однородная
        result["environment"] = env_type.pop()
        if result["environment"] == "Жидкость": #если среда - жидкость
            ch_den = 0
            zn_den = 0
            pre_viscosity = 0
            for env in envs:
                r = env["r"]
                result["name"] += f"{env['name']}:{r} "
                result["molecular_weight"] += env["molecular_weight"] * r
                ch_den += env["density"] * r
                zn_den += r
                pre_viscosity += log10(env["viscosity"]) * r

            result["density"] = ch_den/zn_den
            result["viscosity"] = 10**(pre_viscosity)
            
            '''
            #добавить подбор материала result["material"]
            if "Морская вода" in result["name"]:
                result["material"] = "12Х18Н12М3ТЛ"
            elif ("Масло подсолнечное" in result["name"]) or ("Лимонная кислота" in result["name"]) or ("Молочная кислота" in result["name"]):
                result["material"] = "12Х18Н9ТЛ"
            '''

        elif result["environment"] == "Газ": #если среда - газ
            viscosity_сh = 0
            viscosity_zn = 0
            pre_M = 0
            adiabatic_index = 0
            adiabatic_index_zn = 0
            for env in envs:
                r = env["r"]
                result["name"] += f"{env['name']}:{r} "
                M_i = env["molar_mass"]
                u_i = env["viscosity"]
                pre_M += M_i * r
                viscosity_сh += u_i * r * sqrt(M_i)
                viscosity_zn += r * sqrt(M_i)
                adiabatic_index += env['adiabatic_index'] * r
                
            result["molar_mass"] = pre_M #/100
            result["viscosity"] = viscosity_сh / viscosity_zn
            result["adiabatic_index"] = adiabatic_index
    else:
        result["environment"] = "Раствор газа в жидкости"
        density_ch = 0
        density_zn = 0
        pre_u = 0
        for env in envs:
            r = env["r"]
            result["name"] += f"{env['name']}:{r} "

            density_ch += env["density"] * r
            density_zn += r

            #pre_viscosity += log10(env["viscosity"]) * r
            
            if env["environment"] == "Газ":
                M = env["molar_mass"]
            elif env["environment"] == "Жидкость":
                M = env["molecular_weight"]
            pre_u += r * env["viscosity"] * M

        result["density"] = density_ch / density_zn
        result["viscosity"] = pre_u
        #result["viscosity"] = 10**(pre_viscosity)
    
    return result

def Raschet(dt):
    P_atm = 0.101320
    R = 8.31446261815324 #Газовая постоянная ( Па / (моль * K))

    u = dt["viscosity"]
    Pn = dt["Pn"]
    Pp = dt["Pp"]
    Pp_din = dt["Pp_din"]
    Gab = dt["Gab"]
    N = dt["N"]
    pre_Kc = dt["pre_Kc"]
    
    p1 = dt["density"] 

    climate = dt["climate"]
    model = {
        "У1" : [-40, 40],
        "ХЛ1" : [-60, 40],
        "УХЛ1" : [-60, 40],
        "М1" : [-40, 40]
    }

    T_min, T_max = model[climate]

    #если климатика => то материал
    if ((climate == "ХЛ1") or (climate == "УХЛ1")) and (dt["material"] == "25Л"):
        dt["material"] = "20ГЛ"

    T = dt["T"]


    if pre_Kc:
        Kc = 0.9
    else:
        Kc = 1

    #n = #Введите показатель изоэнтропы среды

    #Давление начала открытия
    if Pn <= 0.3:
        Pno = Pn + 0.02
    elif (Pn > 0.3) and (Pn <= 6):
        Pno = 1.07 * Pn
    elif Pn > 6:
        Pno = 1.05 * Pn

    #Давление полного открытия
    if Pn <= 0.3:
        Ppo = Pn + 0.05
    elif (Pn > 0.3) and (Pn <= 6):
        Ppo = 1.15 * Pn
    elif Pn > 6:
        Ppo = 1.1 * Pn

    #Максимально допустимое давление аварийного сброса;
    P_ab_max = 1.1 * Pno

    #Абсолютное давление до клапана,
    P1 = Ppo + P_atm # < P_ab_max

    #Абсолютное давление за клапаном при его полном открытии
    P2 = Pp + P_atm # = P_sbr

    #Отношение абсолютных давлений;
    B = P2 / P1
       
    if dt["environment"] == "Газ":
        M = dt["molar_mass"]

        p1 = P1 * 1000 * M / (R  * (T+273.15))

        alpha = 0.8
        if (Ppo / Pn) == 1.1:
            if (Pp / Pno) <= 0.3:
                Kw = 1
            else:
                Kw = 1.1027 + 0.4007 * (Pp / Pno) - 2.4577 * (Pp / Pno)**2
        elif (Ppo / Pn) == 1.15:
                if (Pp / Pno) <= 0.37:
                    Kw = 1
                else:
                    Kw = 1.2857 - 0.7603 * (Pp / Pno)
        elif ((Ppo / Pn) > 1.2) and ((Pp / Pno) >= 0.5):
            Kw = 1
        elif ((Ppo / Pn) > 1.1) and ((Ppo / Pn) <= 1.15):
            #Kw определяют линейной интерполяцией по (Ppo / Pn) между значениями, полученными по (Д.22) и (Д.23)
            pass
        elif ((Ppo / Pn) > 1.15) and ((Ppo / Pn) <= 1.2):
            #Kw определяют линейной интерполяцией по (Ppo / Pn) между значениями, полученными по (Д.23) и (Д.24)
            pass
            
        #показатель изоэнтропии
        #dt["isobaric_capacity"] / dt["isochoric_capacity"] = dt["adiabatic_index"]
        n = dt["adiabatic_index"] #/ dt["compressibility_factor"]

        Bkr = (2/(n+1))**(n/(n-1))
        #определим режим истечения
        if B <= Bkr: #
            print('критический режим истечения')
            Kb = 1
            if n == 1:
                Kp_kr = 0.60653 ** 2
            else:
                #Kp_kr = n*(Bkr**((n+1)/n)) #на самом деле, тут корень, но его будем извлекать в конце 
                Kp_kr = sqrt((2*n)/(n+1)) * (2/(n+1))**(1/(n-1)) #или можно так
        else: #докритический режим
            print('докритический режим истечения')
            Kp_kr = 1 
            if n == 1:
                Kb = B**2 * -2 * exp * log(B)#на самом деле, тут корень, но его будем извлекать в конце
            else:
                Kb = (((n + 1) / (n - 1)) * (B**(2/n) - B**((n+1)/n)) * ((n + 1) / 2)) ** 2

        #P1 * p1
        Gideal = Kp_kr * Kb *sqrt(P1 * p1)

    else:
        alpha = 0.6
        #p1 = dt["density"]
        if (Pp / Pno) <= 1.15:
            Kw = 1
        elif ((Pp / Pno) > 1.15) and ((Pp / Pno) <= 0.25):
            Kw = 0.875 + 1.8333 * (Pp / Pno) - 6.6667 * (Pp / Pno)**2
        elif (Pp / Pno) > 0.25:
            Kw = 1.149 - 0.988 * (Pp / Pno)

        Kp = sqrt(2*(1-B)) #на самом деле, тут корень, но его будем извлекать в конце
        Gideal = Kp * sqrt(P1 * p1)

    #print(Kp_kr, P1, p1)
    #print(Kp, P1, p1)
    #print(Gideal)

    DN_s = None
    pre_DN = 0
    Kv = 1

    while DN_s != pre_DN:
        #print(3.6, alpha, Kv, Kw, Kc, Gideal, N)
        pre_F = Gab / (3.6 * alpha * Kv * Kw * Kc * Gideal * N)
        print(pi, pre_F)
        pre_DN = sqrt((4 * pre_F) / pi)
            
        Re = (Gideal * p1 * pre_DN) / u #Gideal
        if (Re >= 1000) and (Re <= 100000):
            Kv = (0.9935 + (2.8780/Re**0.5) + (342.75/Re**1.5))**(-1)
        elif (Re < 1000):
            Kv = 0.975 * sqrt(1/170/(Re+0.98))
        else:
            Kv = 1
            
        F = Gab / (3.6 * alpha * Kv * Kw * Kc * Gideal * N)
        DN_s = sqrt((4 * F) / pi)

            
    new_dt = {
        "T_min" : T_min,     #Минимальная рабочая температура
        "T_max" : T_max,     #Максивальная рабочая температура
        "Pno" : Pno,         #Давление начала открытия с противодавлением
        "Ppo" : Ppo,         #Давление полного открытия с противодавлением
        "P1" : P1,           #Давление на входе
        "P2" : P2,           #Давление на выходе
        "Kw" : Kw,           #Коэффициент, учитывающий эффект неполного открытия разгруженных ПК из-за противодавления
        "Gideal" : Gideal,   #Массовая скорость
        "pre_DN" : pre_DN,   #DN предворительный
        "DN_s" : DN_s        #Диаметр седла клапана
    }

    #Деаметр ПК
    new_dt["DN"] = f"Невозмажно подобрать при сочитании параметров: \nДаметр седла клапана = {DN_s} \n Давление на входе = {P1}"
    
    #поиск записи в БД
    example = searchParams(DN_s, 0.098067 * P1)#P1 перевести из МПа в кгс/см2
    
    new_dt["DN"] = example["DN"] #Номинальный диаметр
    new_dt["PN"] = example["PN"] #Номиннальное давление

    #подбор сильфона !!!!!!!!!!!!!!!!!!!!! сильфон только на пружине?
    if (dt["valve_type"] == 'В') and  ( ( (example["spring_material"] == '51ХФА') and (T > 120) ) or ( (example["spring_material"] == '50ХФА') and (T > 250) ) ):
        new_dt["need_bellows"] = True

    all_dt = dt | new_dt
    return all_dt

def mark_params(dt):
    valve_type = dt["valve_type"]
    PN = dt["PN"]
    DN = dt["DN"]
    T = dt["T"]
    joining_type = dt["joining_type"]

    err = False

    #тип контакта
    if valve_type == "В": #у пружинного - строго металл-металл
        contact_type = "металл-металл"
    elif (valve_type == "Н") and (PN > 160):  
        contact_type = "металл-металл"
    elif (valve_type == "Н") and (PN <= 160): #если пилотный - по умлочанию металл-неметалл, но можно выбрать
        contact_type = "металл-неметалл" #можно заменить
    else:
        err = {"error" : "Невозможно определить тип контакта", "value" : f"Некорректое значение типа ПК: {valve_type}"}

    #класс гкрметичнности
    #бывает ли АА?
    if valve_type == "Н":
        if contact_type == "металл-металл":
            tightness = ["С"]
        elif contact_type == "металл-неметалл":
            tightness = ["В", "А", "АА", "С"]
    elif valve_type == "В":
        if DN == 25.0:
            tightness = ["В", "С"]
        else:
            tightness = ["В", "А", "С"]
    else:
        err = {"error" : "Невозможно определить класс гкрметичнности", "value" : f"Некорректое значение типа ПК: {valve_type}"}

    #окр закр тип
    
    env_name = dt["name"]
    env_names = []
    for ev in env_name.split():
        env_names.append(ev[:ev.find(":")])
    
    print(env_names)

    #вода агрессиваня?
    cool_env = ["Вода", "Водяной пар", "Воздух", "Азот", "Вода"]
    
    evil_env = False
    cool = 0
    for en in env_names:
        #убрать из смеси неагрессивные среды
        if en in cool_env:
            print(en)
            cool+=1

    if cool == len(env_names):
        evil_env = True
    
    print(evil_env)

    open_close_type = "закрытого типа"
    if evil_env:
        open_close_type = "открытого типа"
        dt["need_bellows"] = False
        

    #подбор фланца
    if joining_type == "фланцевое":
        inlet_flange = ['B']#B C D F J K
        if PN == 16.0 or PN == 16.4:
            inlet_flange = ['B', 'C', 'D', 'F']
        if PN == 40.0:
            inlet_flange = ['F', 'C', 'D']
        if PN == 63.0 or PN == 100.0 or PN == 160.0:
            inlet_flange = ['J', 'K', 'F', 'C', 'D']
        if PN == 250.0:
            inlet_flange = ['K', 'D']
        outlet_flange = inlet_flange
    else:
        inlet_flange = None
        outlet_flange = inlet_flange
        
    #заполнеие параметров и выгрузка
    if not err:
        dt["contact_type"] = contact_type       #тип присоединения
        dt["tightness"] = tightness             #варианты класса герметичности
        dt["open_close_type"] = open_close_type #открытый или закрытый тип
        dt["inlet_flange"] = inlet_flange       #варианты фланца на входе
        dt["outlet_flange"] = outlet_flange     #варианты фланца на выходе
        return dt
    else:
        return err
