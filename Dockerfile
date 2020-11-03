FROM node
LABEL maintainer="m6t6ng6 <fernando.miguel.bustamante@gmail.com>"
RUN apt-get update
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER root
RUN npm install g 
COPY --chown=node:node . .
EXPOSE 8000 
CMD ["node", "./dist/bundle.js"]