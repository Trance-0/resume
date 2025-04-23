pipeline {
    environment {
        registry = "trance0/resume"
        version = "1.0"
        NODE_OPTIONS = "--max-old-space-size=8192"
    }
    
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    echo "Building docker image ${registry}:${version}.${env.BUILD_ID}"
                    def customImage = docker.build("${registry}:v${version}.${env.BUILD_ID}")
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    def imageTag = "${registry}:v${version}.${env.BUILD_ID}"
                    echo "Deploying docker image ${imageTag}"
                    echo "Stopping existing container"
                    sh 'docker stop resume-jenkins || true'
                    echo "Removing existing container"
                    sh 'docker rm resume-jenkins || true'
                    echo "Running new docker container"
                    sh "docker run -d -p 13000:3000 --name resume-jenkins ${imageTag}"
                }
            }
        }
    }
}