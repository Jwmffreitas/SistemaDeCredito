variable "project_id" {
  description = "ID do projeto no GCP"
  type        = string
}

variable "region" {
  description = "Região do GCP"
  type        = string
  default     = "us-central1"
}

variable "db_user" {
  description = "Usuário do banco de dados"
  type        = string
}

variable "db_password" {
  description = "Senha do banco de dados"
  type        = string
}

variable "db_name" {
  description = "Nome do banco de dados"
  type        = string
  default     = "creditdb"
}

variable "gke_service_account" {
  description = "Service Account usada pelo GKE para acessar Cloud SQL"
  type        = string
  default     = "gke-service-account"
}

variable "authorized_network_ip" {
  description = "IP autorizado para acessar o banco (ex: seu IP público)"
  type        = string
}

