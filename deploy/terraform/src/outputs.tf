output "sql_instance_name" {
  value = module.cloudsql.name
}

output "gke_cluster_name" {
  value = module.gke.gke_cluster_name
}
output "gke_cluster_endpoint" {
  value = module.gke.gke_cluster_endpoint
}
output "gke_service_account_email" {
  value = module.gke.gke_service_account_email
}

output "sql_instance_ip" {
  value = module.cloudsql.cloud_sql_ip
}
