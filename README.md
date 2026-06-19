# Sistema de Inventario - Despliegue en Kubernetes & GitOps con Argo CD

Este repositorio contiene la configuración de infraestructura como código y los manifiestos de Kubernetes para el despliegue del **Sistema de Inventario** (`inventario-app`). La arquitectura del proyecto sigue un enfoque GitOps para automatizar, auditar y sincronizar el ciclo de vida de la aplicación de manera continua.

##  Objetivo de la Actividad

El objetivo principal de esta actividad fue diseñar e implementar un pipeline moderno de **Integración Continua y Despliegue Continuo (CI/CD)** utilizando tecnologías nativas de la nube. El enfoque se centró en mitigar errores manuales, centralizar la configuración de la infraestructura y garantizar una reconciliación automática del estado del clúster frente al repositorio de Git.

### Metas Alcanzadas:
1. **Orquestación con Kubernetes:** Definición y despliegue automatizado de componentes clave (`Deployment`, `ReplicaSet`, `Pods`, `Service`) para la aplicación de inventario.
2. **GitOps con Argo CD:** Configuración de un modelo declarativo donde el repositorio de Git actúa como la "Única Fuente de Verdad" (*Single Source of Truth*).
3. **Pruebas de Resiliencia y Desviación de Configuración (*Configuration Drift*):** Simulación de fallos manuales en el clúster (eliminación intencional de servicios mediante `kubectl`) para observar y analizar el comportamiento de detección de Argo CD (`OutOfSync`, estados *Ghost*) y validar políticas de auto-reparación (*Self-Heal*).

---

##  Arquitectura de Despliegue

El despliegue de la aplicación está compuesto por las siguientes capas lógicas dentro de Kubernetes, visualizadas dinámicamente a través del árbol de topología de Argo CD:
[ Git Repository ] ──► [ Argo CD Application: inventario-app ]
│
├──► [ Service (svc): inventario-app-inventario-service ]
│
└──► [ Deployment: inventario-app-inventario ]
│
└──► [ ReplicaSet (rs) ]
│
└──► [ Pods ]

* **Application (`inventario-app`):** Entidad raíz en Argo CD que monitorea la rama principal del repositorio (`main`) y automatiza la sincronización.
* **Service (`inventario-app-inventario-service`):** Capa de red interna que expone la aplicación, balancea el tráfico entre los Pods y provee un punto de enlace estable para otros módulos del sistema.
* **Deployment (`inventario-app-inventario`):** Declara el estado deseado de los contenedores, controlando las estrategias de actualización y garantizando la alta disponibilidad mediante réplicas administradas por `ReplicaSets`.

---

## 📊 Estado del Ciclo de Vida y Reconciliación

Durante la actividad, se evaluó cómo reacciona el ciclo de vida de GitOps ante intervenciones manuales en el clúster:

1. **Estado Sincronizado (`Synced` & `Healthy`):** En condiciones normales, el estado declarado en Git coincide con el estado físico en Kubernetes.
2. **Detección de Desviaciones (`OutOfSync` / Estado Fantasma 👻):** Al ejecutar comandos destructivos directos como:
   ```bash
   kubectl delete svc inventario-app-inventario-service
    ```

   Argo CD detecta inmediatamente que el recurso ha desaparecido en el clúster pero aún existe en Git, marcando el nodo del servicio con un estado Ghost (fantasma).
3. Estrategia de Recuperación:

Sincronización Manual: Restauración inmediata del servicio mediante la interfaz de usuario de Argo CD (Sync) o vía CLI (argocd app sync inventario-app).

Sincronización Automática (Self-Heal): Configuración opcional en la política de sincronización (Sync Policy) para delegar en Argo CD la recreación inmediata y automática ante cualquier alteración manual no autorizada en el clúster.

🛠️ Tecnologías Utilizadas
Kubernetes: Motor de orquestación de contenedores.

Argo CD: Herramienta de entrega continua declarativa para GitOps.

Git / GitHub: Control de versiones y disparador de cambios (Webhook/Polling).

Ubuntu (WSL): Entorno local de desarrollo e interacción mediante la CLI de kubectl.