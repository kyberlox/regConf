import math
from math import sqrt, log, exp, pi, log10

#В каких величинах PN? кгс/см2 =>  0.098067 * PN МПа
DNtoPN = [   
    {
        "DN_s" : 12,
        "PN" : 100,
        "DN" : 25
    },
    {
        "DN_s" : 12,
        "PN" : 160,
        "DN" : 25
    },
    {
        "DN_s" : 16,
        "PN" : 16.4,
        "DN" : 25
    },
    {
        "DN_s" : 33,
        "PN" : 16,
        "DN" : 50
    },
    {
        "DN_s" : 33,
        "PN" : 40,
        "DN" : 50
    },
    {
        "DN_s" : 33,
        "PN" : 63,
        "DN" : 50
    },
    {
        "DN_s" : 33,
        "PN" : 160,
        "DN" : 50
    },
    {
        "DN_s" : 40,
        "PN" : 16,
        "DN" : 80
    },
    {
        "DN_s" : 40,
        "PN" : 40,
        "DN" : 80
    },
    {
        "DN_s" : 40,
        "PN" : 63,
        "DN" : 80
    },
    {
        "DN_s" : 48,
        "PN" : 16,
        "DN" : 100
    },
    {
        "DN_s" : 48,
        "PN" : 40,
        "DN" : 100
    },
    {
        "DN_s" : 48,
        "PN" : 160,
        "DN" : 100
    },
    {
        "DN_s" : 56,
        "PN" : 100,
        "DN" : 100
    },
    {
        "DN_s" : 72,
        "PN" : 63,
        "DN" : 100
    },
    {
        "DN_s" : 75,
        "PN" : 16,
        "DN" : 150
    },
    {
        "DN_s" : 75,
        "PN" : 40,
        "DN" : 150
    },
    {
        "DN_s" : 142,
        "PN" : 16,
        "DN" : 200
    }
]

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
    R = 8.31446261815324 #Газовая постоянная ( Дж / (моль * K))

    u = dt["viscosity"]
    Pn = dt["Pn"]
    Pp = dt["Pp"]
    Pp_din = dt["Pp_din"]
    Gab = dt["Gab"]
    N = dt["N"]
    pre_Kc = dt["pre_Kc"]
    
    p1 = dt["density"] 

    climate = dt["climate"]

    #если климатика => то материал
    if climate == "М1":
        dt["material"] = "ГЛ20"

    model = {
        "У1" : [-45, 40],
        "ХЛ1" : [-60, 40],
        "УХЛ1" : [-60, 40],
        "М1" : [-40, 40]
    }

    T_min, T_max = model[climate]
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
        #p1 = P1 * M / R * T

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

    #print(Kp, P1, p1)
    #print(Gideal)

    DN_s = None
    pre_DN = 0
    Kv = 1

    while DN_s != pre_DN:
        pre_F = Gab / (3.6 * alpha * Kv * Kw * Kc * Gideal * N)
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
    new_dt["DN"] = f"Невозмажно подобрать при сочитании параметров: \nДаметр седла клапана = {DN_s} \nДавление на входе = {P1}"
    for req in DNtoPN:
        if (DN_s <= req['DN_s']) and (P1 <= req['PN']):
            new_dt["DN"] = req["DN"]
            all_dt = dt | new_dt
            return all_dt

def get_silfon(dt):
    #
    pass