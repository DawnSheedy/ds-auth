APPNAME = ds-auth
TAG ?= $(shell bash -c 'read -p "Select Tag: " tag; echo $$tag')
NAMESPACE ?= $(shell bash -c 'read -p "Select Namespace: " namespace; echo $$namespace')

build-image:
	docker build -t ${APPNAME}:${TAG} .

push-image: STAG = ${TAG}
push-image:
	docker tag ${APPNAME}:${STAG} registry.digitalocean.com/ds-services-container/${APPNAME}:${STAG}
	docker push registry.digitalocean.com/ds-services-container/${APPNAME}:${STAG}

dev-force: dev-destroy
dev-force: dev

dev: NAMESPACE = dev
dev: TAG = development
dev: build-image
dev: helm-deploy

dev-destroy: NAMESPACE = dev
dev-destroy: helm-destroy

helm-deploy: SNAMESPACE = ${NAMESPACE}
helm-deploy:
	helm upgrade --install --create-namespace -n ${SNAMESPACE} --set image.tag=${TAG} --set namespace=${SNAMESPACE} ${APPNAME} ${APPNAME}

helm-destroy:
	helm uninstall -n ${NAMESPACE} ${APPNAME}