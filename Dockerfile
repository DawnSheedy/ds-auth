FROM --platform=linux/amd64 node:18-alpine

LABEL author="Dawn Sheedy (dawn@dawnsheedy.com)"
LABEL version="1.0"

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

COPY .npmrc ./

RUN yarn

COPY src/ ./src/

COPY tsconfig.json ./

RUN yarn build

EXPOSE 8000

CMD ["node", "build/index.js"]