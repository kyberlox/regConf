--найти все запросы на подбор пружинного ПК
SELECT id, jsn FROM attempts_table
WHERE jsn->>'valve_type' = 'В';