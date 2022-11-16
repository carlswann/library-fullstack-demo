# Library Demo App
## Getting Started

1. Ensure you're using node 14 & yarn is installed
```console
node --version (`nvm install v14 && nvm use v14` if not on v14)
yarn --version (`npm install -g yarn` if missing)
```

2. Ensure docker is installed and running (Necessary for Redis & Docker Containers)
```console
docker --version
```

3. Install dependencies & build Typescript
```console
yarn install && yarn build
```

4. Start Docker containers & ensure they're running
```console
docker compose up -d 
docker compose logs --follow
```

5. Start API on port 3000 & React App on port 4200
```console
yarn start
```

6. Login with the demo user
```
Username: demo@demo.com
Password: password
```

That's it!
