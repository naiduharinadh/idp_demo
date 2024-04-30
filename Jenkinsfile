pipeline {
    agent {
        label 'redhatslave1'
    }
    environment {
        DOCKER_REGISTRY = 'your-docker-registry'
        IMAGE_TAG = "${env.BUILD_NUMBER}" // You can use Jenkins build number as the image tag
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-username/your-repo.git'
            }
        }
        stage('Build') {
            steps {
                script {
                    // Build Docker image
                    docker.build("${DOCKER_REGISTRY}/your-app:${IMAGE_TAG}")
                }
            }
        }
        stage('Push') {
            steps {
                script {
                    // Push Docker image to registry
                    docker.withRegistry('https://${DOCKER_REGISTRY}', 'docker-registry-credentials') {
                        docker.image("${DOCKER_REGISTRY}/your-app:${IMAGE_TAG}").push()
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                // Deploy the Docker image to Kubernetes cluster
                // You can use kubectl or any Kubernetes deployment tool here
            }
        }
    }
}
