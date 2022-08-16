FROM node:16.16.0

ENV NODE_PATH=./dist

WORKDIR /app

COPY ["package.json", "/app"]

RUN npm install typescript 


COPY . /app

RUN yarn 

EXPOSE 3000

CMD ["yarn", "start"]