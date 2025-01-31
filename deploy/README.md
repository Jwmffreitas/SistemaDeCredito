# ☁️ Infraestrutura com Terraform, Google Cloud e Kubernetes  

Este documento fornece instruções detalhadas para provisionar e implantar a infraestrutura do sistema de crédito utilizando **Terraform**, **Google Kubernetes Engine (GKE)** e **Cloud SQL (PostgreSQL)** no **Google Cloud Platform (GCP)**.  

---

## 📌 **Tecnologias Utilizadas**  

- **Terraform** - Infraestrutura como código (IaC)  
- **Google Cloud Platform (GCP)** - Plataforma de nuvem para hospedar os serviços  
- **Google Kubernetes Engine (GKE)** - Gerenciamento de containers  
- **Cloud SQL (PostgreSQL)** - Banco de dados gerenciado  
- **ConfigMaps e Secrets** - Para armazenar variáveis de ambiente no Kubernetes  

---

## ⚙ **Estrutura do Projeto**  

```
📂 terraform  
 ├── 📂 modules  
 │   ├── 📂 gke             # Provisionamento do cluster GKE  
 │   ├── 📂 cloudsql        # Configuração do PostgreSQL no Cloud SQL  
 ├── main.tf                # Terraform principal  
 ├── variables.tf           # Variáveis globais  
 ├── outputs.tf             # Saídas do Terraform  
 ├── terraform.tfvars       # Configuração personalizada  
 ├── README.md              # Documentação  
```  

---

## 🔧 **Configuração Inicial**  

### 1️⃣ **Autenticar no Google Cloud**  

Certifique-se de estar autenticado no GCP:  

```bash
gcloud auth login
gcloud config set project <YOUR_PROJECT_ID>
```  

Se necessário, crie uma conta de serviço e gere uma chave JSON:  

```bash
gcloud iam service-accounts keys create key.json \
  --iam-account=<YOUR_SA>@<YOUR_PROJECT_ID>.iam.gserviceaccount.com
export GOOGLE_APPLICATION_CREDENTIALS="key.json"
```  

---

## 🚀 **Provisionamento da Infraestrutura com Terraform**  

### 2️⃣ **Inicializar o Terraform**  

```bash
terraform init
```  

Isso instalará os provedores necessários.  

### 3️⃣ **Definir Variáveis do Projeto**  

No arquivo `terraform.tfvars`, configure as variáveis necessárias:  

```hcl
project_id       = "seu-projeto-gcp"
region          = "us-central1"
gke_cluster_name = "credit-system-cluster"
cloudsql_name   = "credit-db"
```  

### 4️⃣ **Criar a Infraestrutura**  

```bash
terraform apply -auto-approve
```  

Esse comando criará:  
✅ Cluster GKE  
✅ Instância Cloud SQL  
✅ Configuração de rede VPC  

---

## ☸ **Configuração do Kubernetes**  

### 5️⃣ **Conectar ao Cluster GKE**  

```bash
gcloud container clusters get-credentials credit-system-cluster --region us-central1 --project <YOUR_PROJECT_ID>
kubectl get nodes
```  

Isso confirma que o cluster está funcionando corretamente.  

---

## 📦 **Implantação do Backend e Adapter no Kubernetes**  

```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/adapter-deployment.yaml
kubectl apply -f k8s/rabbitmq-deployment.yaml
```  

Verifique os pods:  

```bash
kubectl get pods -n default
```  

Se todos os pods estiverem rodando corretamente, o sistema está pronto para uso.  

---

## 🔥 **Destruir Infraestrutura**  

Caso precise excluir os recursos criados:  

```bash
terraform destroy -auto-approve
```  

Isso removerá o cluster GKE, Cloud SQL e configurações associadas.  

---

## 📜 **Conclusão**  

Com essa configuração, você tem um ambiente completo no **Google Cloud** rodando **Kubernetes** com **PostgreSQL**, **RabbitMQ** e o backend NestJS de forma automatizada via **Terraform**. 🚀
