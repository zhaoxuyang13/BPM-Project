# parking

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Deploy to kubernetes
```
npm run build
docker build -t parking:1.0 .
kubectl apply -f deploy.yml
kubectl get deployments # Check if 
kubectl get svc | grep parking
# Then we can access the frontend on the specific port of any of the node in the cluster
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
