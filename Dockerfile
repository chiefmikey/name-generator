FROM alpine:latest
EXPOSE 3001
WORKDIR /name-generator
COPY . .
COPY init.sh /bin
RUN rm /name-generator/init.sh
RUN chmod +x /bin/init.sh
ENTRYPOINT "init.sh"
