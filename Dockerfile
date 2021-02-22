FROM node:lts-alpine

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

RUN apk add --no-cache \
        chromium

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV OSDH_ID ""
ENV BIRTHDATE ""
ENV HEADLESS "true"
ENV TELEGRAM_BOT_TOKEN ""
ENV TELEGRAM_CHAT_ID ""
ENV SCHEDULE "1,31 * * * *"

CMD ["npm", "run", "start"]
