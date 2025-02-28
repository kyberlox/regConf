FROM node:20.17-alpine AS build-stage
# Установить рабочий каталог в контейнере
WORKDIR /app

# Скопировать файлы package.json и package-lock.json
COPY package*.json ./

# Установить зависимости
RUN npm install

# Скопировать остальную часть кода приложения
COPY . .

# Собрать приложение
RUN npm run build

WORKDIR /app/dist

CMD ["npm", "run", "preview"]