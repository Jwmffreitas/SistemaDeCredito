# Sistema de Crédito Instantâneo - Arquitetura e Implementação
## Descrição do Sistema
O sistema de "Crédito Instantâneo" permite que os clientes solicitem e recebam crédito diretamente em suas contas digitais. O sistema precisa ser escalável, capaz de processar milhares de requisições simultâneas, com integração aos serviços internos existentes (como Serviço de Usuários e Serviço de Pagamentos), além de um gateway de parceiros para análise de risco de crédito.

Este repositório contém o planejamento da arquitetura e a implementação inicial do backend, com a decisão de adotar um monólito modular para o núcleo do sistema e um microserviço separado para a comunicação com o sistema de terceiros, utilizando a abordagem C4 para o diagrama de arquitetura.

## Arquitetura do Sistema
A arquitetura foi projetada com foco na escalabilidade horizontal, alta disponibilidade e segurança. O sistema é dividido em um monólito para os serviços principais, com a comunicação com sistemas de terceiros desacoplada em um microserviço independente. A integração com os componentes já existentes (Serviço de Usuários e Serviço de Pagamentos) e com o gateway de parceiros para análise de risco é central para a operação do sistema.

## Diagrama de Arquitetura - C4 (Até o Nível 3)
O diagrama C4 a seguir representa os principais componentes e fluxos do sistema:

### Nível 1 - Contexto

No Diagrama de Nível 1 do C4, é possível visualizar o contexto geral do sistema. O cliente interage diretamente com a plataforma para solicitar crédito. O sistema então realiza as seguintes etapas:

- **Validação de Usuário:** A solicitação é validada através do serviço interno de usuários, garantindo que o cliente seja legítimo e tenha permissões para acessar o crédito.
- **Análise de Risco de Crédito:** A plataforma se comunica com um serviço externo de parceiros para realizar uma análise de risco de crédito, avaliando a viabilidade da liberação do crédito solicitado.
- **Liberação de Crédito:** Após o processamento das informações e validações, o sistema decide liberar ou não o crédito solicitado, utilizando o serviço interno de pagamentos para finalizar a transação, caso aprovado.

Este diagrama de Nível 1 apresenta os principais componentes e fluxos de dados entre o cliente, os serviços internos e os sistemas externos, proporcionando uma visão clara de como as interações acontecem dentro do sistema.
<h1 align="center">
  <img alt="C1" src="https://github.com/Jwmffreitas/SistemaDeCredito-Trampay/blob/main/arquitetura/SistemaDeCredito-C1.drawio.png" width="800px" />
</h1>

### Nível 2 - Containers
No Diagrama de Nível 2 do C4, podemos visualizar a estrutura dos containers e compreender onde cada componente do sistema está localizado.

No centro da arquitetura, temos o cluster GKE, que agrupa os principais serviços do sistema, conforme descrito abaixo:

#### Frontend em ReactJS do sistema de crédito
Este componente é responsável pela interface do usuário, onde o cliente poderá acessar e interagir com o sistema de crédito. O frontend se comunica diretamente com o backend para realizar solicitações e acompanhar o status do crédito.

#### Backend (Monólito Modular) do sistema de crédito
O backend foi projetado como um monólito modular devido a características específicas do projeto, incluindo:

- Formação da equipe: A equipe possui maior experiência no desenvolvimento de monólitos, o que acelera o processo de entrega.
- Simplicidade das regras de negócio atuais: No momento, a lógica de negócios não exige alta dependência de recursos externos, permitindo centralizar o sistema em um único núcleo.
- Apesar de ser um monólito modular, foi tomada uma abordagem estratégica para preservar a responsabilidade única e garantir manutenibilidade. Componentes ou funcionalidades que dependem fortemente de outros serviços são tratados separadamente, como no caso do Adapter de Análise de Crédito. Esse adapter foi implementado como um microserviço independente para gerenciar a integração com sistemas externos de análise de crédito, evitando o acoplamento excessivo no núcleo principal.

A comunicação entre o monólito e o adapter é realizada por meio de um message broker (RabbitMQ), garantindo:

- Desacoplamento: Reduz a dependência direta entre serviços.
- Escalabilidade: Facilita o processamento assíncrono de solicitações em picos de demanda.
Essa abordagem proporciona flexibilidade para expandir o sistema no futuro. À medida que novas funcionalidades surgirem, especialmente aquelas que exigem integrações externas ou que possam impactar a escalabilidade, é recomendável implementá-las como serviços separados. Assim, mesmo sendo um monólito, o sistema permanece modular e alinhado aos princípios de arquitetura limpa e escalável.

#### Análise de Crédito Adapter (Microserviço)
O Análise de Crédito Adapter é um microserviço responsável por gerenciar a comunicação entre o backend do sistema de crédito (monólito) e o gateway de análise de crédito de parceiros. Sua principal função é receber as solicitações de análise de crédito enviadas pelo backend através de uma fila no RabbitMQ, processá-las junto ao gateway parceiro e publicar o feedback na fila de resposta. Esse feedback é posteriormente consumido pelo monólito, que realiza o processamento final, armazena os dados no banco de dados e prossegue com o fluxo de crédito para o cliente.

Mecanismos de Resiliência e Estabilidade
Devido às potenciais limitações de throughput e alta latência do gateway de análise de crédito dos parceiros, o adapter implementa mecanismos robustos para garantir a estabilidade e resiliência do sistema:

**Circuit Breaker**

- O Circuit Breaker é implementado para evitar sobrecarregar o gateway parceiro em casos de falhas consecutivas.
- Funcionamento: Quando o gateway apresentar um número excessivo de falhas ou respostas lentas, o Circuit Breaker "abre", pausando temporariamente novas solicitações.
Durante o período de pausa, as requisições são retidas e o sistema realiza tentativas graduais para verificar se o serviço voltou à normalidade.
Isso reduz o impacto sobre o parceiro e evita que o adapter continue enviando requisições desnecessárias em cenários de instabilidade.

**Dead Letter Queue (DLQ)**

- Uma Dead Letter Queue é utilizada para lidar com solicitações que não podem ser processadas mesmo após múltiplas tentativas.
- Finalidade: Requisições com falhas persistentes são enviadas para a DLQ, permitindo que os desenvolvedores investiguem manualmente os problemas sem interromper o fluxo principal do sistema.
A DLQ garante que falhas críticas sejam tratadas sem comprometer a experiência do cliente ou a estabilidade do sistema.
Backoff Exponencial

Caso o gateway de análise esteja sobrecarregado, o adapter implementa uma estratégia de retry com backoff exponencial.
Essa abordagem aumenta gradualmente o intervalo entre as tentativas de envio, permitindo que o serviço parceiro se recupere antes de receber novas requisições.

#### Serviços de Monitoramento e Observabilidade
O sistema utiliza uma abordagem robusta para monitoramento e observabilidade, garantindo visibilidade em tempo real sobre o comportamento e desempenho das aplicações. Os principais componentes são:

**Prometheus e Grafana**

Prometheus é utilizado para coletar e armazenar métricas de desempenho, como:
- Uso de CPU e memória dos containers.
- Taxa de erros e latência das requisições.
- Consumo de filas (RabbitMQ).
- Grafana é integrado ao Prometheus para visualização das métricas por meio de dashboards interativos. Esses dashboards permitem identificar rapidamente anomalias e gargalos no sistema, auxiliando na tomada de decisões.

**Google Cloud Logging**

Os logs das aplicações são enviados para o Google Cloud Logging, garantindo que o cluster GKE não seja sobrecarregado com armazenamento de logs local. Isso evita que o monitoramento impacte negativamente o desempenho das aplicações.
O uso do Google Cloud Logging traz as seguintes vantagens:
- Armazenamento Centralizado: Todos os logs são acessíveis em um único local, facilitando auditorias e investigações.
- Escalabilidade: A infraestrutura do Google lida com grandes volumes de logs sem impacto na operação.
- Filtros Avançados: Logs podem ser pesquisados e filtrados com base em atributos, como severidade, origem ou timestamps.
- Alertas Automatizados: Configuração de alertas baseados em logs para detectar erros críticos ou padrões de comportamento inesperado.

#### Banco de Dados
O banco de dados do sistema de crédito é um componente central que será acessado exclusivamente pelo backend monolito para realizar as operações de leitura e escrita relacionadas às funcionalidades do sistema. Ele será utilizado para armazenar os status das solicitações de crédito, histórico de operações e demais informações essenciais.

**Tecnologia Utilizada:**
Será utilizado o Cloud SQL (PostgreSQL), um serviço gerenciado pela Google Cloud especificamente projetado para bancos de dados relacionais.
Vantagens do Cloud SQL no Contexto do Sistema:

**Isolamento do Cluster GKE:**
O banco de dados é hospedado fora do cluster de containers para garantir melhor performance e reduzir o risco de impacto entre as aplicações e o banco em momentos de alta carga.
Essa separação facilita a escalabilidade independente e reduz os custos de gerenciamento direto no cluster.

**Alta Disponibilidade e Resiliência:**
O Cloud SQL oferece recursos de replicação automática (read replicas) e failover integrado, garantindo que o banco de dados permaneça acessível mesmo em caso de falhas na infraestrutura.

**Gerenciamento Simplificado:**
Por ser um serviço gerenciado, o Cloud SQL cuida automaticamente de backups, atualizações e patching de segurança, permitindo que a equipe de desenvolvimento se concentre nas funcionalidades do sistema.

**Performance Otimizada:**
O serviço é configurado para lidar com workloads de alta concorrência, o que é essencial para o processamento das solicitações de crédito.

<h1 align="center">
  <img alt="C2" src="https://github.com/Jwmffreitas/SistemaDeCredito-Trampay/blob/main/arquitetura/SistemaDeCredito-C2.drawio.png" />
</h1>

### Nível 3 - Componentes

No Nível 3 do modelo C4, podemos observar a estrutura interna dos componentes tanto do backend quanto do frontend. Aqui estão os principais detalhes:

#### Frontend:
O frontend foi inicialmente projetado com duas páginas principais:
- Página de Solicitação de Crédito: Onde o cliente pode preencher as informações necessárias para iniciar a análise de crédito.
- Página de Acompanhamento do Status do Crédito: Permite que o cliente acompanhe em tempo real o progresso e resultado da sua solicitação.
A interface é desenvolvida em ReactJS, proporcionando uma experiência responsiva e intuitiva para o usuário.

#### Backend:
O backend adota uma estrutura baseada em DDD (Domain-Driven Design), separando responsabilidades em domínios e utilizando bounded contexts para organizar os módulos.
A estrutura geral dos módulos segue esta organização:
- Contexto da Aplicação:
Onde reside a lógica de orquestração e as operações do sistema. Aqui encontramos:
Commands e seus respectivos Handlers, responsáveis por executar ações específicas relacionadas à lógica de crédito, como criar solicitações ou atualizar status.
- Contexto de Domínio:
Modela o núcleo do negócio, representando as regras e entidades do sistema. Neste contexto encontramos:
Entidades: Como CreditRequest ou CreditStatus, que representam os principais objetos do domínio.
Objetos de Valor (Value Objects): Para encapsular comportamentos específicos de atributos, como validações.
- Contexto de Infraestrutura:
Contém a implementação de detalhes técnicos, como:
Repositórios: Para acesso ao banco de dados.
Integrações com RabbitMQ: Incluindo o Producer, que publica mensagens na fila para o microserviço de análise de crédito.
- Contexto de Apresentação:
Responsável por expor os endpoints da aplicação e intermediar a comunicação entre o cliente e a lógica do sistema. Aqui são encontrados:
Controllers: Que processam as requisições HTTP.
DTOs (Data Transfer Objects): Para transferência de dados entre o cliente e o backend de forma estruturada e validada.

**Manutenabilidade:**
Cada módulo, como Credit Request e Credit Status, possui sua própria estrutura bem definida, com seus próprios bounded contexts. Isso facilita a manutenção e evolução do sistema, já que as mudanças são isoladas por domínio.

<h1 align="center">
  <img alt="C3" src="https://github.com/Jwmffreitas/SistemaDeCredito-Trampay/blob/main/arquitetura/SistemaDeCredito-C3.drawio.png" />
</h1>

### Nível 4 - Classe (UML)

O Nível 4 do modelo C4, que detalharia a implementação de classes e objetos específicos, foi considerado não necessário neste momento, já que o projeto incluirá uma POC (Proof of Concept) que demonstrará de forma prática os aspectos abordados neste nível. A POC fornecerá o detalhamento necessário para validação da arquitetura e implementação, eliminando a necessidade de um diagrama de granularidade tão baixa neste estágio.
