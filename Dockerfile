FROM alpine:latest
EXPOSE 3001
WORKDIR /name-generator
COPY . .
COPY init1.sh /bin
RUN rm /name-generator/init1.sh
RUN chmod +x /bin/init1.sh
ENTRYPOINT "init1.sh"
