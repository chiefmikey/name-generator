FROM alpine:latest
WORKDIR /cass-helper
COPY . .
COPY init3.sh /bin
RUN rm /cass-helper/init3.sh
RUN chmod +x /bin/init3.sh
ENTRYPOINT "init3.sh"
