variable "region" {
  description = "Região onde o banco será provisionado"
  default     = "us-central1"
}

variable "db_user" {
  description = "Usuário do banco de dados"
  type        = string
}

variable "db_password" {
  description = "Senha do banco de dados"
  type        = string
  sensitive   = true
}

variable "project_id" {
  description = "ID do projeto no GCP"
  type        = string
}

variable "authorized_network_ip" {
  description = "IP autorizado para acessar o banco (ex: seu IP público)"
  type        = string
}
