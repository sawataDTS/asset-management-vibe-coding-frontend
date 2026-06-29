def notifyTeams(String status) {
    def payload = """
    {
        "title": "Asset Management Frontend Deployment",
        "job": "${env.JOB_NAME}",
        "build": "${env.BUILD_NUMBER}",
        "branch": "${env.BRANCH_NAME}",
        "status": "${status}",
        "url": "${env.BUILD_URL}"
    }
    """
    node('Asset-Management-DQ') {
        withCredentials([string(credentialsId: 'teams-webhook', variable: 'WEBHOOK_URL')]) {
            sh """
            curl -s -X POST \$WEBHOOK_URL \
            -H 'Content-Type: application/json' \
            -d '${payload}'
            """
        }
    }
}

pipeline {
    agent none

    environment {
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_REPO = "nexus.dtskill.com:8445/asset-management/frontend"
        EMAILS = "tejas.patil@dtskill.ai, aboli.shinde@dtskill.ai, divya.mali@dtskill.ai"
    }

    stages {

        stage('Notify Build Start') {
            steps {
                script {
                    notifyTeams("STARTED")
                    emailext(
                        subject: "🚀 Asset Management Frontend DEPLOYMENT STARTED FOR BUILD NO.| #${env.BUILD_NUMBER} BRANCH (${env.BRANCH_NAME})",
                        mimeType: 'text/html',
                        body: """
                        <b>Asset Management Frontend Deployment Started</b><br><br>
                        <b>Service:</b> Asset Management Frontend<br>
                        <b>Branch:</b> ${env.BRANCH_NAME}<br>
                        <b>Build:</b> ${env.BUILD_NUMBER}<br><br>
                        <a href="${env.BUILD_URL}">Open Jenkins Build</a>
                        """,
                        to: EMAILS
                    )
                }
            }
        }

        stage('Build & Push Image') {
            when { anyOf { branch 'develop'; branch 'stage'; branch 'prod' } }
            agent { label env.BRANCH_NAME == 'prod' ? 'Asset-Management-Prod' : 'Asset-Management-DQ' }

            steps {
                script {

                    def ENV_FILE = env.BRANCH_NAME == 'stage'
                        ? '/home/ubuntu/.asset-management/.frontend/.stage/.env'
                        : '/home/ubuntu/.asset-management/.frontend/.develop/.env'

                    def IMAGE_TAG = "${DOCKER_REPO}/${env.BRANCH_NAME}:v${DOCKER_TAG}"

                    sh """
                        echo "Using env file: ${ENV_FILE}"
                        sudo cp ${ENV_FILE} .env
                        docker build -t ${IMAGE_TAG} .
                        docker push ${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Deploy') {
            when { anyOf { branch 'develop'; branch 'stage'; branch 'prod' } }
            agent { label env.BRANCH_NAME == 'prod' ? 'Asset-Management-Prod' : 'Asset-Management-DQ' }

            steps {
                script {

                    def IMAGE_TAG = "${DOCKER_REPO}/${env.BRANCH_NAME}:v${DOCKER_TAG}"
                    def CONTAINER = "asset-management-frontend-${env.BRANCH_NAME}"
                    def PORT = env.BRANCH_NAME == 'stage' ? '3001' : '3000'

                    sh """
                        docker rm -f ${CONTAINER} || true
                        docker run -d -p ${PORT}:3000 \
                            --name ${CONTAINER} \
                            ${IMAGE_TAG}
                    """
                }
            }
        }
    }

    post {

        success {
            script { notifyTeams("SUCCESS") }

            emailext(
                subject: "Asset Management TimeLens Frontend DEPLOYMENT SUCCESSULL FOR BUILD NO.| #${env.BUILD_NUMBER} BRANCH (${env.BRANCH_NAME})",
                mimeType: 'text/html',
                body: """
                <b style="color:green;">Deployment Successful</b><br><br>
                <b>Service:</b> Asset Management Frontend<br>
                <b>Branch:</b> ${env.BRANCH_NAME}<br>
                <b>Build:</b> ${env.BUILD_NUMBER}<br>
                <b>Image:</b> ${DOCKER_REPO}/${env.BRANCH_NAME}:v${DOCKER_TAG}<br><br>
                <a href="${env.BUILD_URL}">View Logs</a>
                """,
                to: EMAILS
            )
        }

        failure {
            script { notifyTeams("FAILED") }

            emailext(
                subject: "❌ Asset Management Frontend DEPLOYMENT FAILED FOR BUILD NO.| #${env.BUILD_NUMBER} BRANCH (${env.BRANCH_NAME})",
                mimeType: 'text/html',
                body: """
                <b style="color:red;">Deployment Failed</b><br><br>
                <b>Service:</b> Asset Management Frontend<br>
                <b>Branch:</b> ${env.BRANCH_NAME}<br>
                <b>Build:</b> ${env.BUILD_NUMBER}<br><br>
                <b>Action Required</b><br>
                <a href="${env.BUILD_URL}">Check Jenkins Logs</a>
                """,
                to: EMAILS
            )
        }
    }
}
