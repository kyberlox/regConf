import math
from math import sqrt, log, exp, pi

class Raschet:
    def __init__(self, dt):
        P_atm = 0.101320
        u = dt["viscosity"]
        Pn = dt["Pn"]
        Pp = dt["Pp"]
        Pp_din = dt["Pp_din"]
        Gab = dt["Gab"]
        N = dt["N"]
        pre_Kc = dt["pre_Kc"]

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
            n = dt["adiabatic_index"] / dt["compressibility_factor"]

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

        elif dt["environment"] == "Жидкость":
            alpha = 0.6
            p1 = dt["density"]
            if (Pp / Pno) <= 1.15:
                Kw = 1
            elif ((Pp / Pno) > 1.15) and ((Pp / Pno) <= 0.25):
                Kw = 0.875 + 1.8333 * (Pp / Pno) - 6.6667 * (Pp / Pno)**2
            elif (Pp / Pno) > 0.25:
                Kw = 1.149 - 0.988 * (Pp / Pno)

            Kp = sqrt(2*(1-B)) #на самом деле, тут корень, но его будем извлекать в конце
            Gideal = Kp * sqrt(P1 * p1)

        DN = None
        pre_DN = 0
        Kv = 1

        while DN != pre_DN:
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
            DN = sqrt((4 * F) / pi)
        
        new_dt = {
            "Pno" : Pno,         #Давление начала открытия с противодавлением
            "Ppo" : Ppo,         #Давление полного открытия с противодавлением
            "P1" : P1,           #Давление на входе
            "P2" : P2,           #Давление на выходе
            "Kw" : Kw,           #Коэффициент, учитывающий эффект неполного открытия разгруженных ПК из-за противодавления
            "Gideal" : Gideal,   #Массовая скорость
            "pre_DN" : pre_DN,   #DN предворительный
            "DN" : DN            #Диаметр седла клапана
        }

        all_dt = dt | new_dt

        return all_dt
                        