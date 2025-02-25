# 🚀 **Sistema de Crédito**  

Este repositório contém uma **Prova de Conceito (POC)** de um sistema de crédito assíncrono, utilizando **NestJS**, **RabbitMQ**, **PostgreSQL** e **Kubernetes no Google Cloud**.  

📌 **Principais funcionalidades:**  
✔ Processamento assíncrono de requisições de crédito  
✔ Comunicação via filas no RabbitMQ  
✔ Deploy automatizado com Terraform e Kubernetes  
✔ Banco de dados gerenciado no Cloud SQL  

---

## 📖 **Sumário**  

🔹 **[Arquitetura e Fluxo do Sistema](arquitetura/README.md)**  
Detalhamento da estrutura do projeto, organização das pastas e fluxo de mensagens no RabbitMQ.  

🔹 **[POC - Sistema de Crédito](poc/README.md)**  
Explicação detalhada sobre a arquitetura do sistema, tecnologias utilizadas e instruções para rodar localmente ou via Docker.  

🔹 **[Infraestrutura e Deploy](deploy/README.md)**  
Guia para provisionamento da infraestrutura no **Google Cloud**, utilizando **Terraform** e **GKE**, além do deploy no Kubernetes.  

---

## 🚀 **Rodando o Projeto**  

Para mais detalhes, acesse os respectivos guias acima. Abaixo, um resumo dos principais comandos:  

### **Executar com Docker**  

```bash
docker-compose up --build
```  

### **Deploy no Kubernetes**  

```bash
terraform apply -auto-approve
gcloud container clusters get-credentials credit-system-cluster
kubectl apply -f k8s/
```  
