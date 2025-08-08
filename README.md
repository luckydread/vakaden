This project is 

BACKEND (container name is = backend)

- Restart nginx : sudo nginx -t && sudo systemctl reload nginx
- Check Logs : sudo docker-compose logs -f <container_name>
- Build container : sudo docker-compose -d --build <container_name> (use this command if you have changed the code)
- Migrate the Django container : sudo docker-compose exec backend python manage.py migrate
- Run container : sudo docker compose up -d <container_name>
- Check if container is running : sudo docker ps


Frontend

- Build frontend : sudo docker build -t vakaden-frontend .


