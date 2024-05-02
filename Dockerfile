FROM node:latest
EXPOSE 4623
RUN mkdir nodeApp
WORKDIR /nodeApp
RUN git init
ARG CACHEBUST=1
RUN npm install
