## 5. Arquitectura Técnica

### Aunque la tecnología sea compleja, la experiencia debe ser sencilla.

El principio de diseño técnico de AlmaNEO es claro: **Los usuarios no necesitan saber nada sobre blockchain.** La tecnología compleja opera entre bastidores y los usuarios utilizan el servicio de forma familiar.

---

### 5.1 Descripción General del Sistema

**Arquitectura de 4 Capas del Sistema AlmaNEO:**

| Capas | Componentes | Roles |
|:---:|:---|:---|
| **1. Capa de Usuario** | App AlmaNEO, Web3Auth, interfaz de chat de IA | Interacción directa con el usuario |
| **2. Capa de Inteligencia** | Servicio de modelos de IA, red DePIN, localización de modelos | Provisión de servicios de IA |
| **3. Capa de Confianza** | Puntuación de Amabilidad, autenticación biométrica, emisión de Jeong-SBT | Verificación de identidad y contribución |
| **4. Capa de Blockchain** | Red Polygon, Token ALMAN, Contratos Inteligentes | Infraestructura Descentralizada |

**Flujo de Datos:** Punto de Contacto del Usuario → Inteligencia → Confianza → Blockchain (Comunicación Bidireccional entre Capas)

---

### 5.2 Blockchain: ¿Por Qué Polygon?

AlmaNEO se basa en la **Red Polygon**.

#### Razones de Selección

| Criterios | Ventajas de Polygon |
|------|---------------|
| **Tarifa de Gas** | Menos de $0.01 por transacción — Accesible incluso para usuarios del Sur Global |
| **Velocidad** | Confirmación de Transacción en 2 segundos — Interacción en Tiempo Real |
| **Ecosistema** | Ecosistema DeFi Maduro, NFT — Escalable |
| **Compatibilidad** | Totalmente Compatible con Ethereum — Fácil de Expandir |
| **Entorno** | Eficiencia Energética Basado en PoS — Sostenible |

#### Estructura de Contrato Inteligente

### Estructura de Contrato Inteligente

| Contrato | Descripción | Rol principal |
| :--- | :--- | :--- |
| **Token ALMAN** | Token estándar ERC-20 | Suministro total: 8 mil millones, utilidad de crédito/staking/gobernanza de IA |
| **Jeong-SBT** | ERC-5484 (SBT) | Token de alma intransferible, registro en cadena de Kindness Score |
| **Registro de Kindness** | Contrato de verificación de actividad | Verificación y registro de actividad de Kindness, sistema de votación verificado por pares |
| **Acuerdo de cómputo** | Contrato de intercambio de recursos | Registro y recompensas de nodos DePIN, asignación automatizada de recursos computacionales |
| **Gobernanza** | Contrato DAO | Propuesta y votación de DAO, derechos de voto ponderados por Kindness Score |

---

### 5.3 Experiencia de usuario: Diseño sin barreras

#### Web3Auth: Puesta en marcha en 5 segundos

La mayor barrera de entrada a los servicios blockchain existentes es la creación de monederos. Anota tus 12 frases semilla, no las pierdas nunca y mantén tus claves privadas seguras. La mayoría de la gente se da por vencida aquí.

**AlmaNEO es diferente.**

![AlmaNEO Technical](../assets/images/05.webp)

### Comparación entre la incorporación tradicional y la de AlmaNEO

| Categoría | Incorporación tradicional en blockchain | Incorporación en AlmaNEO |
| :--- | :--- | :--- |
| **Procedimiento** | Instalar billetera → Generar frase semilla → Almacenar de forma segura → Copiar dirección → Comprar tokens → Enviar → Cobrar la tarifa de gas → Usar el servicio (8 pasos) | Haz clic en "Iniciar sesión con Google" → Completar (2 pasos) |
| **Tiempo requerido** | De 30 minutos a 1 hora | **5 segundos** |
| **Tasa de rebote** | 90 % o más | Mínimo |

**Cómo funciona:**
- Web3Auth crea automáticamente una billetera sin custodia basada en la cuenta de redes sociales del usuario.
- Las claves privadas se almacenan de forma descentralizada, lo que las hace inaccesibles tanto para el usuario como para AlmaNEO.
- Los usuarios pueden usar todas las funciones sin saber de la existencia de la billetera.

#### Transacciones sin gas: Sin preocupaciones por comisiones

Otra barrera para la adopción de blockchain son las comisiones de gas. Pagar una comisión por cada transacción, por pequeña que sea, puede ser una carga significativa para los nuevos usuarios.

**Solución de AlmaNEO:**
- Se aplica ERC-4337 (Abstracción de Cuenta).
- La base cubre la comisión de gas para las transacciones básicas.
- Los usuarios pueden usar el servicio sin comisiones.

---

### 5.4 Infraestructura de IA: Distribuida y Optimizada

#### Optimización de Modelos

El Centro de IA de AlmaNEO proporciona modelos de IA optimizados de código abierto.

| Tecnología | Descripción | Efecto |
|------|------|------|
| **Cuantización** | Ajuste de precisión del modelo | 70 % de reducción de capacidad, 99 % de rendimiento |
| **LoRA** | Ajuste fino ligero | Optimización del idioma local |
| **Computación de borde** | Computación en el dispositivo | Disponible incluso con internet inestable |

#### Operación del nodo DePIN

Usuarios de todo el mundo conectan sus ordenadores a la red AlmaNEO para proporcionar recursos computacionales.

Cómo participar en un nodo:

1. Instalar el software del nodo AlmaNEO (Windows, Mac, Linux).
2. Definir la cantidad de recursos a compartir (GPU, CPU, almacenamiento).
3. Conectarse a la red.
4. Recibir recompensas en tokens ALMAN según la cantidad de recursos proporcionados.

**Seguridad:**
- Todos los cálculos se ejecutan en un entorno de pruebas dentro de un contenedor Docker. Los datos de los usuarios están protegidos con cifrado de extremo a extremo (E2EE).
Ni siquiera los operadores de nodos pueden ver las consultas de los usuarios.

---

### 5.5 Verificación de identidad: Humanos, no bots

Ofrecer recursos de IA gratuitos inevitablemente conduce a intentos de abuso. Los bots crean decenas de miles de cuentas para monopolizar los recursos.

AlmaNEO implementa el principio **"Una persona, una cuenta"** mediante la tecnología.

#### Prueba de Personalidad Multicapa

### Prueba de Personalidad Multicapa

1. **Capa 1: Autenticación del Dispositivo**
- Detección de dispositivos duplicados mediante la Huella Digital
2. **Capa 2: Autenticación Social**
- Verificación básica de identidad mediante la vinculación de cuentas de redes sociales
3. **Capa 3: Autenticación Biométrica (Opcional)**
- Consigue mejores calificaciones con Face ID y otros métodos de autenticación
4. **Capa 4: Análisis de Comportamiento**
- Distingue entre bots y humanos según patrones de uso
5. **Capa 5: Recomendaciones de la Comunidad**
- Mayor confianza gracias a las recomendaciones de miembros existentes

**Sistema de Calificación:**

|Calificación | Nivel de Autenticación | Créditos de IA Gratis Diarios |
|------|----------|-------------------|
| Básico | Solo Inicio de Sesión Social | 10 veces |
| Verificado | Dispositivo + Redes Sociales | 50 veces |
| De Confianza | Autenticación biométrica añadida | 200 veces |
| Guardián | Alta puntuación de amabilidad | Ilimitado |

---

### 5.6 Privacidad: Tus datos te pertenecen

AlmaNEO no recopila datos de los usuarios.

#### Principios de privacidad

| Principios | Implementación |
|------|------|
| **Conversaciones sin almacenamiento** | Las conversaciones de IA no se almacenan en servidores |
| **Cifrado local** | Los datos del usuario se cifran en el dispositivo con AES-256 |
| **Análisis anónimo** | Los datos se anonimizan completamente para mejorar el servicio |
| **Uso del protocolo de conocimiento cero** | Protección de la privacidad al verificar la puntuación de amabilidad |

> *"No sabemos qué preguntaste. Solo sabemos lo amable que eres."*

---

### 5.7 Resumen de la hoja de ruta tecnológica

| Fase | Periodo | Desarrollos principales |
|------|------|----------|
| **Alfa** | 1.er-2.er trimestre de 2025 | Implementación de la red de prueba, verificación de funciones principales |
| **Beta** | 3.er-4.er trimestre de 2025 | Implementación de la red principal, expansión del nodo DePIN |
| **V1.0** | 1.er trimestre de 2026 | Lanzamiento oficial, soporte multilingüe |
| **V2.0** | 2.er semestre de 2026 | Funciones avanzadas, expansión del ecosistema |

---

*La siguiente sección detalla la estructura económica del token ALMAN.*

