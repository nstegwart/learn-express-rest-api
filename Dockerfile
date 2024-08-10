FROM arm64v8/node:14
# Atau gunakan versi Node.js yang lebih baru jika diperlukan

RUN apt-get update && apt-get install -y docker.io
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn global add nodemon
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]
