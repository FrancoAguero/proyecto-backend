#Ejecutar en modo cluster

npm start cluster

#Prueba de performance sobre listado de productos

artillery quick --count 50 -n 40 http://localhost:3001/api/products > result_fork_cluster.txt