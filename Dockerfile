FROM ubuntu:18.04
COPY . /os/workdir
ENV mode=production
WORKDIR /os/workdir
EXPOSE 3000