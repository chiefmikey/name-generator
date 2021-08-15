FROM alpine:latest
EXPOSE 9042
WORKDIR /cassandra
COPY . .
COPY init2.sh /bin
RUN rm /cassandra/init2.sh
RUN chmod +x /bin/init2.sh
ENTRYPOINT "init2.sh"
