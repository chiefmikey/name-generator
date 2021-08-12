FROM node:latest
EXPOSE 3001
WORKDIR /name-generator
COPY . .
COPY init.sh /bin
RUN rm /name-generator/init.sh
RUN chown -R node:node /name-generator
RUN chown node:node /bin/init.sh
RUN chmod +x /bin/init.sh
USER node
ENTRYPOINT "init.sh"
