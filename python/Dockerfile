FROM python:3.9

WORKDIR /data/ToDo

COPY ./requirements.txt /data/ToDo/requirements.txt

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./ /data/ToDo

CMD ["fastapi", "run", "main.py", "--port", "8000"]