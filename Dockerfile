FROM node:latest
WORKDIR /name-generator
COPY . .
RUN npm ci
RUN chown -R node:node /name-generator
USER node
CMD ["npm", "start"]
