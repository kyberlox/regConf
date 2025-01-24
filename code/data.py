{
    "environment_id" : 0,
    "name" : "",
    "environment" : "",
    "molecular_weight" : 0.0,
    "density" : 0.0,
    "material" : "",
    "viscosity" : 0.0,
    "isobaric_capacity" : 0.0,
    "molar_mass" : 0.0,
    "isochoric_capacity" : 0.0,
    "adiabatic_index" : 0.0,
    "compressibility_factor" : 0.0,

    "Pn" : 0.0,       #Введите давление настройки (МПа)
    "Pp" : 0.0,       #Введите проитводавление (МПа)
    "Pp_din" : 0.0,   #Введите динамическое противодавление (МПа)
    "Gab" : 0.0,      #Введите максимальный аварийный расход жидкости и газа (кг/час)
    "N" : 1,          #Введите количество параллельно установленных и одновременно работающих клапанов (шт) 
    "pre_Kc" : False, #Мембранно-предохранительное устройство установлено до и/или после
    "T" : 0,          #Температура окружающей среды
    "climate" : "",   #Климатика

    "T_min" : 0,      #минимальная температура
    "T_max" : 0,      #максимальная температура
    "Pno" : 0.0,      #Давление начала открытия с противодавлением
    "Ppo" : 0.0,      #Давление полного открытия с противодавлением
    "P1" : 0.0,       #Давление на входе
    "P2" : 0.0,       #Давление на выходе
    "Kw" : 0.0,       #Коэффициент, учитывающий эффект неполного открытия разгруженных ПК из-за противодавления
    "Gideal" : 0.0,   #Массовая скорость
    "pre_DN" : 0.0,   #DN предворительный
    "DN" : 0.0,       #Диаметр седла клапана

    "valve_type" : "",            #Тип предохранительного клапана Пружинный или Пилотный
    "need_bellows" : False,       #Переменное противодавление или необходим сильфон на пружинные ПК по требованию ОЛ
    "joining_standard" : "",      #Исполнение фланцев на входе по ГОСТ 33259-2015 или Исполнение фланцев на входе по ГОСТ 33259-2015
    "joining_type" : "",          #Тип присоединения [Фланцевое, Под приварку, Штуцерно-торцовое, Муфтовое, Ниппельное, Кламповое, Комбинированное]
    "inlet flange" : "",          # B C D E F J или RF LM LF SM SF LT LG ST SG RTJ
    "outlet flange" : "",         # B C D E F J или RF LM LF SM SF LT LG ST SG RTJ
    "detonation_node" : False,    #Узел подрыва
    "rotary_plugs" : False,       #Наличие поворотных заглушек
    "thermal_cover" : False,      #Наличие термочехла
    "abrasive_particles" : False, #Наличие в рабочей среде абразивных частиц
    "climate" : "",               #Климатическое исполнение по ГОСТ 15150-69 (У1 ХЛ1 М1)
    "tightness" : "",             #Герметичность затвора по ГОСТ 9544-2015 (A AA B C)
    "color" : "",                 #Покраска

    "warranty" : 12,                  #Гарантийный срок службы, мес.
    "assignment" : 20,                #Назначенный срок службы, лет
    "packaging" : "Стандартная (клапан упакован в стрейч-пленку, на паллет). Хранение под навесом.",                 #Упаковка 
    "acceptance" : "",                #Приемка
    "additionally" : "",              #Дополнительно
    "need_ZIP" : "",                  #Наличие ЗИП
    "reciprocal_connections" : False, #Комплект ответных присоединительных частей
    "pipe_material" : ""              #Материал трубы
}