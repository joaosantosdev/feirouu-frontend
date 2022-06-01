FROM node:13.14-alpine
RUN npm install -g @quasar/cli

WORKDIR /var/www

ENV NODE_ENV=development
COPY package.json /var/www/package.json
RUN npm install

COPY . /var/www

EXPOSE 8081
VOLUME /var/www

CMD ["quasar", "dev"]