pipeline {
  agent any
  environment {
    NEXUS_IMAGE_NAME = "${DOCKER_REPO_NAME}/${DOCKER_IMAGE_NAME}"
  }
  stages {
    stage('拉取代码') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: env.GIT_BUILD_REF]],
          userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]]
        ])
      }
    }
    stage('构建docker镜像') {
      steps {
        script {
          echo '正在构建。。。'
          sh 'docker login -u ${BASE_IMG_REPO_USER} -p ${BASE_IMG_REPO_PWD} docker.icyanstone.com'
          
          def replacedText = DOCKER_IMAGE_VERSION.contains('/') ? DOCKER_IMAGE_VERSION.replaceAll("/", "-") : DOCKER_IMAGE_VERSION
          def buildEnv = env.BUILD_ENV
          echo "${buildEnv}"
          sh "DOCKER_BUILDKIT=1 docker build --build-arg BUILD_ENV=${buildEnv} -t ${NEXUS_HOST}/${NEXUS_IMAGE_NAME}:${replacedText} -f ${DOCKERFILE_PATH} ${DOCKER_BUILD_CONTEXT}"
          sh "docker push ${NEXUS_HOST}/${NEXUS_IMAGE_NAME}:${replacedText}"
          
          if (env.DEPLOY == 'true') {
            echo "${replacedText}"
            sh """
              curl --location --request POST 'https://opworks.coding.net/api/cd/webhooks/webhook/82334a2b-f90d-4c1d-9e5b-487d6618d9e8' \\
              --header 'Content-Type: application/json' \\
              --data-raw '{"parameters":{"version":"${replacedText}","limitHeapSize":"64M","servicename":"heran-media-front","loglevel":"info","imagesecret":"docker-nexus","projectTag":"heran","namespace":"heran","dockerrepo":"docker.icyanstone.com/repository/docker-repo","limitCPU":"0.2"}}'
            """
            echo '构建成功，部署请求已发送，请确认是否部署成功'
          } else {
            echo '构建成功'
          }
        }
      }
    }
  }
}
