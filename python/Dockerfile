FROM python:3.9-alpine3.21

WORKDIR /data/app
COPY ./requirements.txt /data/app/requirements.txt

RUN pip install --upgrade pip

RUN pip install --no-cache-dir --upgrade -r requirements.txt

#COPY ./ /data/app

CMD ["fastapi", "run", "main.py", "--port", "8000"]