## 5. Architecture technique

### Même si la technologie est complexe, l'expérience utilisateur doit rester simple.

Le principe de conception technique d'AlmaNEO est clair : **Les utilisateurs n'ont pas besoin de connaître la blockchain.** La technologie complexe opère en arrière-plan, et les utilisateurs accèdent au service de manière intuitive.

---
### 5.1 Vue d'ensemble du système

**Architecture à 4 couches du système AlmaNEO :**

| Couches | Composants | Rôles |

|:---:|:---|:---|

| **1. Couche utilisateur** | Application AlmaNEO, Web3Auth, interface de chat IA | Interaction directe avec l'utilisateur |

| **2. Couche d'intelligence** | Déploiement du modèle d'IA, réseau DePIN, localisation du modèle | Fourniture de services d'IA |

| **3. Couche de confiance** | Score de bienveillance, authentification biométrique, émission de Jeong-SBT | Vérification d'identité et de contribution |

| **4. Couche blockchain** | Réseau Polygon, jeton ALMAN, contrats intelligents | Infrastructure décentralisée |

**Flux de données :** Point de contact utilisateur → Intelligence → Confiance → Blockchain (Communication bidirectionnelle entre les couches)

---

### 5.2 Blockchain : Pourquoi Polygon ?

AlmaNEO est construit sur le **réseau Polygon**.

#### Raisons du choix

| Critères | Avantages de Polygon |

|------|---------------|

| **Frais de gaz** | Moins de 0,01 $ par transaction — Abordable même pour les utilisateurs des pays du Sud |

| **Rapidité** | Confirmation de transaction en moins de 2 secondes — Interaction en temps réel |

| **Écosystème** | Écosystème DeFi et NFT mature — Évolutif |

| **Compatibilité** | Entièrement compatible avec Ethereum — Facile à étendre |

| **Environnement** | Économie d'énergie grâce à la preuve d'enjeu (PoS) — Durable |

#### Structure du contrat intelligent

### Structure du contrat intelligent

| Contrat | Description | Rôle principal |

| :--- | :--- | :--- |

| **Jeton ALMAN** | Jeton standard ERC-20 | Offre totale : 8 milliards, utilitaire de crédit/staking/gouvernance basé sur l'IA |

| **Jeong-SBT** | ERC-5484 (SBT) | Jeton d'âme non transférable, enregistrement du score de bienveillance sur la blockchain |

| **Registre de bienveillance** | Contrat de vérification d'activité | Vérification et enregistrement des activités de bienveillance, système de vote vérifié par les pairs |

| **Accord de calcul** | Contrat de partage de ressources | Enregistrement et récompenses des nœuds DePIN, allocation automatisée des ressources de calcul |

| **Gouvernance** | Contrat DAO | Proposition et vote de la DAO, droits de vote pondérés par le score de bienveillance |

---

### 5.3 Expérience utilisateur : Conception sans barrière

#### Web3Auth : Démarrage en 5 secondes

Le principal obstacle à l’adoption des services blockchain existants est la « création de portefeuille ». Notez vos 12 phrases de récupération, ne les perdez jamais et conservez vos clés privées en lieu sûr. La plupart des utilisateurs abandonnent à cette étape.

**AlmaNEO est différent.**

![AlmaNEO Technical](../assets/images/05.webp)

### Comparaison de l’intégration traditionnelle et de l’intégration AlmaNEO

| Catégorie | Intégration blockchain traditionnelle | Intégration AlmaNEO |

| :--- | :--- | :--- |

| **Procédure** | Installer le portefeuille → Générer une phrase de récupération → Stocker en lieu sûr → Copier l’adresse → Acheter des jetons → Envoyer → Facturer les frais de gaz → Utiliser le service (8 étapes) | Cliquer sur « Se connecter avec Google » → Terminer (2 étapes) |

| **Durée requise** | 30 minutes à 1 heure | **5 secondes** |

| **Taux de rebond** | 90 % ou plus | Minimal |

**Fonctionnement :**

- Web3Auth crée automatiquement un portefeuille non custodial à partir du compte de réseau social de l'utilisateur.

- Les clés privées sont stockées de manière décentralisée, les rendant inaccessibles à l'utilisateur comme à AlmaNEO.

- Les utilisateurs peuvent utiliser toutes les fonctionnalités sans même se rendre compte de l'existence du portefeuille.

#### Transactions sans frais de gaz : aucun souci de frais

Un autre frein à l'adoption de la blockchain réside dans les « frais de gaz ». Devoir payer des frais pour chaque transaction, même minime, peut représenter une charge importante pour les nouveaux utilisateurs.

**Solution d'AlmaNEO :**

- Utilisation de l'ERC-4337 (Abstraction de compte).

- La plateforme prend en charge les frais de gaz pour les transactions de base.

- Les utilisateurs peuvent utiliser le service gratuitement.

---

### 5.4 Infrastructure IA : Distribuée et optimisée

#### Optimisation des modèles

La plateforme IA AlmaNEO fournit des modèles d'IA open source optimisés.

| Technologie | Description | Effet |

|------|------|------|

| **Quantification** | Ajustement de la précision du modèle | Réduction de 70 % de la capacité, performances de 99 % |

| **LoRa** | Réglage fin léger | Optimisation pour le langage local |

| **Calcul en périphérie** | Calcul sur l'appareil | Disponible même en cas de connexion Internet instable |

#### Fonctionnement des nœuds DePIN

Des utilisateurs du monde entier connectent leurs ordinateurs au réseau AlmaNEO pour fournir des ressources de calcul.

Comment participer à un nœud :

1. Installez le logiciel AlmaNEO Node (Windows, Mac, Linux).

2. Définissez la quantité de ressources à partager (GPU, CPU, stockage).

3. Connectez-vous au réseau.

4. Recevez des récompenses en jetons ALMAN en fonction de la quantité de ressources fournies.

**Sécurité :**

- Tous les calculs sont exécutés dans un environnement isolé (sandbox) au sein d'un conteneur Docker.

- Les données des utilisateurs sont protégées par un chiffrement de bout en bout (E2EE).

- Même les opérateurs de nœuds ne peuvent pas consulter les requêtes des utilisateurs.

---

### 5.5 Vérification d'identité : Des humains, pas des robots

La mise à disposition gratuite de ressources d'IA entraîne inévitablement des tentatives d'abus. Des robots créeront des dizaines de milliers de comptes pour monopoliser les ressources.

AlmaNEO met en œuvre le principe « Une personne, un compte » grâce à sa technologie.

#### Preuve d'identité multicouche

### Preuve d'identité multicouche

1. **Niveau 1 : Authentification de l'appareil**

- Détection des appareils dupliqués par empreinte digitale

2. **Niveau 2 : Authentification sociale**

- Vérification d'identité de base par la liaison des comptes de réseaux sociaux

3. **Niveau 3 : Authentification biométrique (optionnelle)**

- Amélioration de la notation grâce à la reconnaissance faciale et autres méthodes d'authentification

4. **Niveau 4 : Analyse comportementale**

- Distinction entre bots et humains selon les habitudes d'utilisation

5. **Niveau 5 : Recommandation de la communauté**

- Confiance accrue grâce aux recommandations des membres existants

**Système de notation :**

|Notation | Niveau d'authentification | Crédits IA gratuits quotidiens |

|------|----------|-------------------|

| Basique | Connexion via les réseaux sociaux uniquement | 10 fois |

| Vérifié | Appareil + Réseaux sociaux | 50 fois |

| Fiable | Authentification biométrique ajoutée | 200 fois |

| Gardien | Score de gentillesse élevé | Illimité |

---

### 5.6 Confidentialité : Vos données vous appartiennent

AlmaNEO ne collecte aucune donnée utilisateur.

#### Principes de confidentialité

| Principes | Mise en œuvre |

|------|------|
| **Conversations sans stockage** | Les conversations avec l'IA ne sont pas stockées sur les serveurs |

| **Chiffrement local** | Les données utilisateur sont chiffrées sur l'appareil avec AES-256 |

| **Analyses anonymes** | Les données sont entièrement anonymisées pour l'amélioration du service |

| **Utilisation du protocole à connaissance nulle** | Protection de la vie privée lors de la vérification du score de gentillesse |

> *"Nous ne savons pas ce que vous avez demandé. Tout ce que nous savons, c'est à quel point vous êtes gentil."*

---
### 5.7 Résumé de la feuille de route technologique

| Phase | Période | Principaux développements |

|------|------|----------|

| **Alpha** | 1er-2e trimestre 2025 | Déploiement sur le réseau de test, vérification des fonctionnalités principales |

| **Bêta** | 3e-4e trimestre 2025 | Déploiement sur le réseau principal, extension du réseau DePIN |

| **V1.0** | 1er trimestre 2026 | Lancement officiel, prise en charge multilingue |

| **V2.0** | 2e semestre 2026 | Fonctionnalités avancées, extension de l'écosystème |

---

*La section suivante détaille la structure économique du jeton ALMAN.*

