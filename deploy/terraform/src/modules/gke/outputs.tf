output "gke_cluster_name" {
  description = "Nome do cluster do GKE"
  value       = google_container_cluster.credit_cluster.name
}

output "gke_cluster_endpoint" {
  description = "Endpoint do cluster GKE"
  value       = google_container_cluster.credit_cluster.endpoint
}

output "gke_service_account_email" {
  description = "Email da conta de serviço do GKE"
  value       = google_service_account.gke_sa.email
}
