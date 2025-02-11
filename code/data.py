{
    "environment_id" : 0,           #ID среды
    "name" : "",                    #Название среды
    "environment" : "",             #Состояние (Жидкость/Газ)
    "molecular_weight" : 0.0,       #Молекулярная масса
    "density" : 0.0,                #Плотность
    "material" : "",                #Материал
    "viscosity" : 0.0,              #Вязкость
    "isobaric_capacity" : 0.0,      #удельная изобарная теплоемиокость
    "molar_mass" : 0.0,             #молярная масса
    "isochoric_capacity" : 0.0,     #удельная изохорная теплоемиокость
    "adiabatic_index" : 0.0,        #Показатель адиабаты
    "compressibility_factor" : 0.0, #Фактор сжимаемости
    "mark" : "",                    #Маркировка

    "valve_type" : "",    #Тип предохранительного клапана Пружинный или Пилотный (B/H)
    "force_open" : False, #Устройство принудительного открытия [Да/Нет]
    "Pn" : 0.0,           #Введите давление настройки (МПа)
    "Pp" : 0.0,           #Введите проитводавление (МПа)
    "Pp_din" : 0.0,       #Введите динамическое противодавление (МПа)
    "Gab" : 0.0,          #Введите максимальный аварийный расход жидкости и газа (кг/час)
    "N" : 1,              #Введите количество параллельно установленных и одновременно работающих клапанов (шт) 
    "pre_Kc" : False,     #Мембранно-предохранительное устройство установлено до и/или после
    "T" : 0,              #Температура рабочей среды !!!!!!!!!!!!!!!!!!!!!!!!!
    "climate" : "",       #Климатическое исполнение по ГОСТ 15150-69 (У1 ХЛ1 УХЛ1 М1)

    "T_min" : 0,      #минимальная температура
    "T_max" : 0,      #максимальная температура
    "Pno" : 0.0,      #Давление начала открытия с противодавлением
    "Ppo" : 0.0,      #Давление полного открытия с противодавлением
    "P1" : 0.0,       #Давление на входе
    "P2" : 0.0,       #Давление на выходе
    "Kw" : 0.0,       #Коэффициент, учитывающий эффект неполного открытия разгруженных ПК из-за противодавления
    "Gideal" : 0.0,   #Массовая скорость
    "pre_DN" : 0.0,   #DN предворительный
    "DN_s" : 0.0,     #Диаметр седла клапана
    "DN" : 0.0,       #Номинналлльный иаметр
    "PN" : 0.0,       #Номинальное давление
    "DN2" : 0.0,       #Номинналлльный иаметр на выходе
    "PN2" : 0.0,       #Номинальное давление на выходе
    "spring_material": "",        #Материал пружины
    "spring_number" : "",         #Номер пружины
    "color" : "",                 #Покраска

    "need_bellows" : False,       #Переменное противодавление или необходим сильфон на пружинные ПК по требованию ОЛ
    "contact_type" : "",          #Тит котакта (металл-металл / металл-неметалл)
    "tightness" : "",             #Герметичность затвора по ГОСТ 9544-2015 (A AA B C)
    "open_close_type" : "",       #Открытый / Закрытый тип
    "joining_standard" : "",      #Исполнение фланцев на входе по ГОСТ 33259-2015 или Исполнение фланцев на входе по ГОСТ 33259-2015
    "joining_type" : "",          #Тип присоединения [Фланцевое, Под приварку, Штуцерно-торцовое, Муфтовое, Ниппельное, Кламповое, Комбинированное]
    "inlet_flange" : "",          # B C D E F J или RF LM LF SM SF LT LG ST SG RTJ
    "outlet_flange" : "",         # B C D E F J или RF LM LF SM SF LT LG ST SG RTJ
    "detonation_node" : False,    #Узел подрыва недоступен для заказа
    "material_bellows" : "",      #Материал сильфона
    "material_spool" : "",        #Материал золотника
    "material_saddle" : "",       #Материал седла
    "weight" : "",                #Маccа
    "painting_area" : "",         #Площадь под покраску
    "packaging" : "Стандартная (клапан упакован в стрейч-пленку, на паллет). Хранение под навесом.", #Упаковка
    "trials" : "",                #Испытания
    
    "rotary_plugs" : False,       #Наличие поворотных заглушек
    "thermal_cover" : False,      #Наличие термочехла
    "abrasive_particles" : False, #Наличие в рабочей среде абразивных частиц
    "warranty" : 12,                  #Гарантийный срок службы, мес.
    "assignment" : 30,                #Назначенный срок службы, лет
    "acceptance" : False,             #Приемка
    "adapters" : False,               #Переходники
    "needKOF" : False,                #Наличие [Да/Нет]
    "need_ZIP" : "",                  #Наличие ЗИП
    "reciprocal_connections" : False, #Комплект ответных присоединительных частей
    "pipe_material" : "",             #Материал трубы
    "quantity" : 0,                   #Количество
    "docs" : "",                      #Документация
    "additionally" : ""               #Дополнительно
}