# Nous utilise simplement alpine car d'apres docker elle n'a pas de "vulnérabilité" alors que les autres affichent des warnings
FROM node:alpine

RUN npm install -g pnpm

WORKDIR /nova-app

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]