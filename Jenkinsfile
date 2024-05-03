pipeline {
    agent {
        label 'builtInNode'
    }

    stages {
        stage('checkout git and Dockerfile build ') {
            steps {
                git branch: 'main', url: 'https://github.com/naiduharinadh/sample_node.git'
                sh 'sudo sed -i \'/RUN npm install/i\\RUN git pull https://github.com/naiduharinadh/sample_node.git\' Dockerfile'
            }
        }
        
        
        stage("docker login"){
            steps{
                script {
                    sh 'sudo echo N@dh23006 | sudo docker login -u harinadh14 --password-stdin'
                }
            }
        }
        
        
        stage("build - with out entry point added "){
            steps{
                script {
                    def imageName = "userlogapp2"
                    sh 'sudo docker build --build-arg CACHEBUST=$(date +%s) -t userlogapp2 .'
                    sh "sudo docker tag userlogapp2 harinadh14/userlogapp1:latest"
                }
            }
        }
        stage("testing by MOCHA"){
            steps{
                script {
                    
                    sh "sudo docker run -dit --name testContainer1 userlogapp2"
                    sh "sudo docker exec  testContainer1 npm install -g mocha"
                    sh "sudo docker exec  testContainer1 mocha --exit server.test.js"
                }
            }
        }
        stage("build - ENTRYPOINT as npm start  "){
            steps{
                script {
                    sh 'sudo sed -i \'$i\\ENTRYPOINT ["npm", "start"]\'  Dockerfile'
                    sh 'sudo docker build --build-arg CACHEBUST=$(date +%s) -t userlogapp2 .'
                    sh 'sudo docker tag userlogapp2  harinadh14/userlogapp1:latest'
                    sh 'sudo docker push harinadh14/userlogapp1:latest'
                }
            }
        }
    }
// post build actions 
        post{

        failure{

            build job: 'post -build-project-sample-2', waitForStart: true
        }



        sucess{
            build job: 'post -build-project-sample-1', waitForStart: true
        }


    }
}
