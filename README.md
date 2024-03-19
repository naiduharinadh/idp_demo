GET the container form the DOCKER-HUB running on the PORT : 4623 <br />
docker pull harinadh14/nodeapp:v1.0 <br />
docker run -dit  --name nodeapp -p 8008:4623 harinadh14/nodeapp:v1.0 <br />
<br /><br />
note: <br />
  data base connected by default is mine.  <br />
  To add and setup your own : <br />
    step1 : <br />
        - update the database connection string in above code and build the image by using that code <br />
    step2 : <br />
        -  code to build your own image by using -  "Dockerfile" : <br />
              FROM node:latest <br />
              EXPOSE 4623 <br />
              RUN mkdir nodeApp <br />
              WORKDIR /nodeApp <br />
              RUN git init <br />
              RUN git pull https://github.com/naiduharinadh/sample_node.git <br /> 
              RUN npm install <br />
              ENTRYPOINT ["node", "server.js"] <br />
    step3 : <br />
            docker build -t nodeapp .  ( "."  here the dot defines the Dockerfile located in which dir , in this case it is in same dir ) <br />
    step4 : <br />
            docker login  <br />
            docker tag nodeapp  harinadh14/nodeapp:v1.0 <br />
    step5 : <br />
            docker push harinadh14/nodeapp:v1.0 <br />
    
