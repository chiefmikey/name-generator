FROM node:latest
WORKDIR /name-generator
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci
COPY . .
RUN chown -R node:node /name-generator
USER node
CMD ["npm", "start"]
