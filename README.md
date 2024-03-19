GET the container form the DOCKER-HUB running on the PORT : 4623 
docker pull harinadh14/nodeapp:v1.0
docker run -dit  --name nodeapp -p 8008:4623 harinadh14/nodeapp:v1.0

note:
  data base connected by default is mine. 
  To add and setup your own :
    step1 :
        - update the database connection string in above code and build the image by using that code 
    step2 :
        -  code to build your own image by using -  "Dockerfile" :
              FROM node:latest
              EXPOSE 4623
              RUN mkdir nodeApp
              WORKDIR /nodeApp
              RUN git init
              RUN git pull https://github.com/naiduharinadh/sample_node.git
              RUN npm install
              ENTRYPOINT ["node", "server.js"]
    step3 :
            docker build -t nodeapp .  ( "."  here the dot defines the Dockerfile located in which dir , in this case it is in same dir )
    step4 :
            docker login 
            docker tag nodeapp  harinadh14/nodeapp:v1.0
    step5 :
            docker push harinadh14/nodeapp:v1.0
    


docker build -t nodeapp .
