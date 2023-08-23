FROM --platform=linux/amd64 node:18-alpine

ENV GITHUB_TOKEN=''

LABEL author="Dawn Sheedy (dawn@dawnsheedy.com)"
LABEL version="1.0"

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN echo $'@dawnsheedy:registry=https://npm.pkg.github.com/\n\
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}' > /usr/src/app/.npmrc

RUN echo ""

RUN yarn

COPY src/ ./src/

COPY tsconfig.json ./

RUN yarn build

EXPOSE 8000

CMD ["node", "build/index.js"]