terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.3.0"
}

provider "google" {
  project = var.project_id
  region  = var.region
}


module "gke" {
  depends_on  = [module.cloudsql]
  source      = "./modules/gke"
  project_id  = var.project_id
  cloudsql_ip = module.cloudsql.cloud_sql_ip
}

module "cloudsql" {
  source                = "./modules/cloudsql"
  project_id            = var.project_id
  db_user               = var.db_user
  db_password           = var.db_password
  authorized_network_ip = var.authorized_network_ip
}

resource "null_resource" "install_helm_and_monitoring_services" {
  depends_on = [
    module.gke.credit_cluster, # Garante que o cluster GKE seja criado antes de executar os comandos
    module.gke.credit_nodes    # Garante que o node pool esteja pronto
  ]

  provisioner "local-exec" {
    command = <<EOT
    docker run --rm \
      -v $HOME/.kube:/root/.kube \
      -v $HOME/.config/gcloud:/root/.config/gcloud \
      -v $HOME/.config/helm:/root/.config/helm \
      -v $(pwd)/../../k8s:/k8s \
      -e GOOGLE_APPLICATION_CREDENTIALS=/root/.config/gcloud/application_default_credentials.json \
      google/cloud-sdk:alpine \
      /bin/sh -c "
      apk add --no-cache helm && \
      gcloud components install kubectl && \
        gcloud components install gke-gcloud-auth-plugin && \
        gcloud container clusters get-credentials credit-system-cluster --region us-central1 --project possible-post-449514-a8 && \
        helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && \
        helm repo update && \
        helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace --set prometheus.service.type=LoadBalancer && \
        kubectl apply -f /k8s/grafana-deployment.yaml
      "
  EOT
  }
}

resource "null_resource" "deploy_services" {
  depends_on = [
    module.gke.credit_cluster, # Garante que o cluster GKE seja criado antes de executar os comandos
    module.gke.credit_nodes,   # Garante que o node pool esteja pronto
    null_resource.install_helm_and_monitoring_services
  ]

  provisioner "local-exec" {
    command = <<EOT
    kubectl apply -f ${path.module}/k8s_deployment_template.yaml
    EOT
  }

  triggers = {
    cloud_sql_ip = module.cloudsql.cloud_sql_ip
    timestamp    = timestamp()
  }
}

