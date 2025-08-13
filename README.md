This project is a project with a react-vite frontend and a djang-rest api backend.

To run the project do the following:

1. From the root folder, run "sudo docker compose -f docker-compose.prod.yml down" to kill any running containers
2. Run "sudo docker-compose down --remove-orphans" to remove any unused containers
3. Run "sudo docker system prune -af --volumes" to delet any unused volumes
4. Run "sudo docker-compose -f docker-compose.prod.yml up --build -d" to build containers
4. Run "sudo docker logs <container_name> --tail 50" to check container logs
5. Run "sudo docker ps -a" to check which containers are running


Deployment

1. Push to main branch will automatically deploy to droplet
2. When deploying for the first time, cd /vakaden and run python manage.py migrate

