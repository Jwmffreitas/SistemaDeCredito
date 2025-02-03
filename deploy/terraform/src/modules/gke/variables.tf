variable "cluster_name" { default = "credit-system-cluster" }
variable "region" { default = "us-central1-a" }

variable "gke_service_account" {
  description = "Service Account usada pelo GKE para acessar Cloud SQL"
  type        = string
  default     = "gke-service-account"
}

variable "project_id" {
  description = "ID do projeto no GCP"
  type        = string
}

variable "cloudsql_ip" {
  description = "IP do clousql"
  type        = string
}
