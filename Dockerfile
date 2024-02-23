FROM node:lts-alpine

WORKDIR /tmconfjs

ADD . /tmconfjs

RUN npm install --global /tmconfjs/

CMD ["tmconfjs"]
