local-mysql:
	docker run --name stayease -e MYSQL_DATABASE=stayease -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql

.PHONY: server
server:
	cd server && mvn spring-boot:run

.PHONY:ui
ui:
	cd ui && pnpm dev