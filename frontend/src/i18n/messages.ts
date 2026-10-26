export const supportedLocales = ["pt-BR", "en-US", "es-ES"] as const;

export type Locale = (typeof supportedLocales)[number];

const enUS = {
  common: {
    skip: "Skip to content",
    primaryNavigation: "Primary navigation",
    compare: "Compare",
    docs: "Docs",
    projectType: "PORTFOLIO PROJECT",
    language: "Language",
  },
  home: {
    intro: "API evolution, without the guesswork.",
    title: "Catch breaking API changes before they ship.",
    subtitle:
      "Compare OpenAPI specifications. Understand what changed, what breaks, and what needs a closer look. Before your consumers find out.",
    start: "Start Comparing",
    github: "View on GitHub",
    note: "No account required. Bring two specs. Get a clear diff.",
    exampleLabel: "Example comparison result",
    complete: "COMPARISON COMPLETE",
    changes: "4 CHANGES DETECTED",
    breaking: "2 breaking",
    safe: "1 non-breaking",
    review: "1 review",
    findingTitle: "Response property type changed",
    findingText:
      "User.id changed from integer to string. Existing clients may fail to deserialize the response.",
    baselineCandidate: "BASELINE → CANDIDATE",
    semantic: "Semantic changes. Not just different lines.",
    explore: "Explore the comparison →",
    builtFor: "Built for your API contract",
    workflowLabel: "01 / THE WORKFLOW",
    workflowTitle: "A clear answer in three steps.",
    workflowCopy:
      "Less time reading diffs. More confidence in the next release.",
    steps: [
      {
        title: "Bring your contracts",
        description:
          "Paste YAML or JSON, drop in your files, or load the example. Set a baseline and a candidate.",
      },
      {
        title: "Compare the meaning",
        description:
          "Find changes to endpoints, parameters, schemas, and responses — not formatting or key order.",
      },
      {
        title: "Ship with context",
        description:
          "Inspect every finding, share a report, and bring the same checks into your pull requests.",
      },
    ],
    contractLabel: "02 / BUILT FOR THE CONTRACT",
    contractTitle: "Signal, not noise.",
    features: [
      {
        title: "Semantic by design",
        description:
          "Understand response types, required fields, and endpoint changes in the context of your OpenAPI contract.",
      },
      {
        title: "Review-ready findings",
        description:
          "Every change comes with a reason and a precise contract location, classified conservatively.",
      },
      {
        title: "From browser to build",
        description:
          "Start with an interactive comparison. Export JSON or Markdown, then automate checks with the CLI.",
      },
    ],
    privacyLabel: "03 / PRIVACY FIRST",
    privacyTitle: "Your contracts.\nYour control.",
    privacyCopy:
      "API specifications can describe sensitive systems. OASFuse compares inputs in memory and intentionally keeps no comparison history.",
    securityLink: "Read the security principles →",
    privacyItems: [
      {
        title: "Stateless by intention",
        description:
          "Comparison inputs are not written to application storage.",
      },
      {
        title: "No account in the way",
        description: "The workflow starts with specifications, not sign-up.",
      },
      {
        title: "Inspectable, not a black box",
        description:
          "Rules are deterministic, documented, and shared with the CLI.",
      },
    ],
    ctaTitle: "Make the next change a deliberate one.",
    ctaCopy:
      "Start with the example, or compare the API you're shipping today.",
    footer: "Open specifications. Clear decisions.",
    documentation: "Documentation",
  },
  workspace: {
    kicker: "WORKSPACE / NEW COMPARISON",
    title: "Every release starts with a comparison.",
    subtitle:
      "Add your current contract and the proposed version. We'll surface the changes that matter.",
    example: "Example",
    loadExample: "Load example",
    swap: "Swap specifications",
    baseline: "Baseline",
    candidate: "Candidate",
    privacy:
      "Designed for stateless comparison. Review our security principles.",
    compare: "Compare Specifications",
    comparing: "Comparing specifications…",
    missing: "Add both a baseline and a candidate specification.",
  },
  editor: {
    loading: "Loading editor…",
    upload: "Upload file",
    drop: "Drop a .yaml or .json file anywhere in this editor",
    ready: "✓ Ready for validation",
    lines: "lines",
    chooseFile: "Choose a .yaml, .yml, or .json file.",
    size: "Each specification must be 2 MiB or smaller.",
    specification: "specification",
    openApiEditor: "OpenAPI editor",
  },
  results: {
    back: "← Back to workspace",
    title: "Comparison results",
    complete: "COMPLETE",
    newComparison: "New comparison",
    severities: {
      breaking: "Breaking",
      nonBreaking: "Non-breaking",
      review: "Needs review",
    },
    severityHelp: {
      breaking: "Existing consumers may be affected",
      nonBreaking: "Additive changes to your contract",
      review: "Impact depends on your workflow",
    },
    search: "Search findings",
    searchPlaceholder: "Search findings or schema paths…",
    filter: "Filter by severity",
    all: "All severities",
    showing: "Showing {shown} of {total} changes",
    emptyTitle: "No findings match your filters.",
    emptyCopy: "Try another schema path or clear your filters.",
    clear: "Clear filters",
    baseline: "BASELINE",
    candidate: "CANDIDATE",
    present: "present",
    absent: "absent",
    markdownTitle: "OASFuse comparison report",
    totalFindings: "Total findings",
    severity: "Severity",
    rule: "Rule",
    location: "Location",
    findingTitles: {
      operationAdded: "Operation added",
      operationIdChanged: "Operation identifier changed",
      responsePropertyRemoved: "Response property removed",
      responseTypeChanged: "Response type changed",
    },
  },
  errors: {
    timeout: "The comparison timed out.",
    unavailable: "The comparison service is unavailable.",
    unexpected: "Unexpected comparison error.",
  },
  docs: {
    search: "Search documentation",
    searchPlaceholder: "Search docs…  ⌘ K",
    groups: [
      {
        title: "GET STARTED",
        items: ["Overview", "Quickstart", "Your first comparison"],
      },
      {
        title: "CORE CONCEPTS",
        items: [
          "Compatibility rules",
          "Understanding findings",
          "Supported specifications",
        ],
      },
      {
        title: "AUTOMATION",
        items: ["CLI reference", "GitHub Actions", "Export formats"],
      },
      { title: "PROJECT", items: ["Security & privacy", "Contributing"] },
    ],
    label: "GET STARTED / QUICKSTART",
    title: "A safer API release starts here.",
    lead: "Compare two OpenAPI contracts, understand the impact, and bring compatibility checks into your development workflow.",
    yamlJson: "YAML and JSON",
    firstTitle: "01. Run your first comparison",
    firstCopy:
      "Open the workspace and load the Users API example, or paste your own specifications. Baseline is the contract consumers use today. Candidate is the version you plan to release.",
    openWorkspace: "Open comparison workspace →",
    compatibilityTitle: "02. Understand compatibility",
    compatibilityCopy:
      "Compatibility is evaluated from the consumer's perspective. A valid specification can still break an existing client. Review both the classification and the affected schema location.",
    change: "CHANGE",
    classification: "CLASSIFICATION",
    operationRemoved: "Operation removed",
    optionalAdded: "Optional request parameter added",
    enumAdded: "Response enum value added",
    cliTitle: "03. Use the CLI",
    cliCopy:
      "The Java CLI invokes the same comparison core without sending contracts over the network.",
    exitCodes:
      "Exit code 0 means the chosen threshold was not met, 1 means findings met it, and 2 means invalid input or a comparison error.",
    actionsTitle: "04. Add a pull-request check",
    actionsCopy:
      "Use the CLI on a GitHub-hosted runner. Keep production secrets and self-hosted deployment runners away from untrusted pull-request code.",
    securityTitle: "Security & privacy by intention",
    securityCopy:
      "Comparisons are stateless and inputs are not saved by the application. External $ref values are rejected and never fetched. Public deployments must enforce body, concurrency, and rate limits.",
    auditCopy:
      "This is a design claim backed by the repository implementation, not a third-party audit or a guarantee about a host you do not control.",
    onThisPage: "ON THIS PAGE",
    toc: [
      "First comparison",
      "Compatibility rules",
      "CLI usage",
      "GitHub Actions",
      "Security & privacy",
    ],
  },
};

type DeepWiden<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepWiden<U>[]
    : T extends object
      ? { [K in keyof T]: DeepWiden<T[K]> }
      : T;

export type Messages = DeepWiden<typeof enUS>;

const ptBR: Messages = {
  common: {
    skip: "Pular para o conteúdo",
    primaryNavigation: "Navegação principal",
    compare: "Comparar",
    docs: "Documentação",
    projectType: "PROJETO DE PORTFÓLIO",
    language: "Idioma",
  },
  home: {
    intro: "Evolução de APIs, sem suposições.",
    title: "Encontre mudanças incompatíveis antes da publicação.",
    subtitle:
      "Compare especificações OpenAPI. Entenda o que mudou, o que quebra e o que exige atenção antes que seus consumidores descubram.",
    start: "Começar comparação",
    github: "Ver no GitHub",
    note: "Sem cadastro. Traga duas especificações e obtenha um diff claro.",
    exampleLabel: "Exemplo de resultado de comparação",
    complete: "COMPARAÇÃO CONCLUÍDA",
    changes: "4 MUDANÇAS DETECTADAS",
    breaking: "2 incompatíveis",
    safe: "1 compatível",
    review: "1 para revisão",
    findingTitle: "Tipo da propriedade de resposta alterado",
    findingText:
      "User.id mudou de inteiro para texto. Clientes existentes podem falhar ao desserializar a resposta.",
    baselineCandidate: "BASE → CANDIDATA",
    semantic: "Mudanças semânticas, não apenas linhas diferentes.",
    explore: "Explorar a comparação →",
    builtFor: "Feito para o seu contrato de API",
    workflowLabel: "01 / O FLUXO",
    workflowTitle: "Uma resposta clara em três etapas.",
    workflowCopy: "Menos tempo lendo diffs. Mais confiança na próxima versão.",
    steps: [
      {
        title: "Traga seus contratos",
        description:
          "Cole YAML ou JSON, envie arquivos ou carregue o exemplo. Defina a versão base e a candidata.",
      },
      {
        title: "Compare o significado",
        description:
          "Encontre mudanças em endpoints, parâmetros, schemas e respostas — não em formatação ou ordem de chaves.",
      },
      {
        title: "Publique com contexto",
        description:
          "Analise cada resultado, compartilhe o relatório e use as mesmas verificações nos pull requests.",
      },
    ],
    contractLabel: "02 / FEITO PARA O CONTRATO",
    contractTitle: "Sinal, não ruído.",
    features: [
      {
        title: "Semântico por definição",
        description:
          "Entenda tipos de resposta, campos obrigatórios e mudanças de endpoints no contexto do contrato OpenAPI.",
      },
      {
        title: "Resultados prontos para revisão",
        description:
          "Cada mudança apresenta o motivo e a localização exata no contrato, com classificação conservadora.",
      },
      {
        title: "Do navegador ao build",
        description:
          "Comece com uma comparação interativa, exporte JSON ou Markdown e automatize com a CLI.",
      },
    ],
    privacyLabel: "03 / PRIVACIDADE PRIMEIRO",
    privacyTitle: "Seus contratos.\nSeu controle.",
    privacyCopy:
      "Especificações de API podem descrever sistemas sensíveis. O OASFuse compara tudo em memória e não mantém histórico.",
    securityLink: "Leia os princípios de segurança →",
    privacyItems: [
      {
        title: "Sem estado por intenção",
        description:
          "As entradas da comparação não são gravadas no armazenamento da aplicação.",
      },
      {
        title: "Sem cadastro no caminho",
        description:
          "O fluxo começa com as especificações, não com um formulário de registro.",
      },
      {
        title: "Inspecionável, não uma caixa-preta",
        description:
          "As regras são determinísticas, documentadas e compartilhadas com a CLI.",
      },
    ],
    ctaTitle: "Faça da próxima mudança uma decisão consciente.",
    ctaCopy: "Comece pelo exemplo ou compare a API que você publica hoje.",
    footer: "Especificações abertas. Decisões claras.",
    documentation: "Documentação",
  },
  workspace: {
    kicker: "WORKSPACE / NOVA COMPARAÇÃO",
    title: "Toda versão começa com uma comparação.",
    subtitle:
      "Adicione o contrato atual e a versão proposta. Mostraremos as mudanças relevantes.",
    example: "Exemplo",
    loadExample: "Carregar exemplo",
    swap: "Trocar especificações",
    baseline: "Base",
    candidate: "Candidata",
    privacy:
      "Comparação sem estado por design. Consulte nossos princípios de segurança.",
    compare: "Comparar especificações",
    comparing: "Comparando especificações…",
    missing: "Adicione as especificações base e candidata.",
  },
  editor: {
    loading: "Carregando editor…",
    upload: "Enviar arquivo",
    drop: "Solte um arquivo .yaml ou .json em qualquer área deste editor",
    ready: "✓ Pronto para validação",
    lines: "linhas",
    chooseFile: "Escolha um arquivo .yaml, .yml ou .json.",
    size: "Cada especificação deve ter no máximo 2 MiB.",
    specification: "especificação",
    openApiEditor: "editor OpenAPI",
  },
  results: {
    back: "← Voltar ao workspace",
    title: "Resultados da comparação",
    complete: "CONCLUÍDA",
    newComparison: "Nova comparação",
    severities: {
      breaking: "Incompatível",
      nonBreaking: "Compatível",
      review: "Requer revisão",
    },
    severityHelp: {
      breaking: "Consumidores existentes podem ser afetados",
      nonBreaking: "Mudanças aditivas no contrato",
      review: "O impacto depende do seu fluxo",
    },
    search: "Pesquisar resultados",
    searchPlaceholder: "Pesquisar resultados ou caminhos do schema…",
    filter: "Filtrar por severidade",
    all: "Todas as severidades",
    showing: "Exibindo {shown} de {total} mudanças",
    emptyTitle: "Nenhum resultado corresponde aos filtros.",
    emptyCopy: "Tente outro caminho de schema ou limpe os filtros.",
    clear: "Limpar filtros",
    baseline: "BASE",
    candidate: "CANDIDATA",
    present: "presente",
    absent: "ausente",
    markdownTitle: "Relatório de comparação OASFuse",
    totalFindings: "Total de resultados",
    severity: "Severidade",
    rule: "Regra",
    location: "Localização",
    findingTitles: {
      operationAdded: "Operação adicionada",
      operationIdChanged: "Identificador da operação alterado",
      responsePropertyRemoved: "Propriedade de resposta removida",
      responseTypeChanged: "Tipo da resposta alterado",
    },
  },
  errors: {
    timeout: "A comparação excedeu o tempo limite.",
    unavailable: "O serviço de comparação está indisponível.",
    unexpected: "Erro inesperado na comparação.",
  },
  docs: {
    search: "Pesquisar documentação",
    searchPlaceholder: "Pesquisar docs…  ⌘ K",
    groups: [
      {
        title: "PRIMEIROS PASSOS",
        items: ["Visão geral", "Início rápido", "Sua primeira comparação"],
      },
      {
        title: "CONCEITOS PRINCIPAIS",
        items: [
          "Regras de compatibilidade",
          "Entendendo os resultados",
          "Especificações compatíveis",
        ],
      },
      {
        title: "AUTOMAÇÃO",
        items: [
          "Referência da CLI",
          "GitHub Actions",
          "Formatos de exportação",
        ],
      },
      {
        title: "PROJETO",
        items: ["Segurança e privacidade", "Como contribuir"],
      },
    ],
    label: "PRIMEIROS PASSOS / INÍCIO RÁPIDO",
    title: "Uma publicação de API mais segura começa aqui.",
    lead: "Compare dois contratos OpenAPI, entenda o impacto e leve as verificações de compatibilidade para seu fluxo de desenvolvimento.",
    yamlJson: "YAML e JSON",
    firstTitle: "01. Execute sua primeira comparação",
    firstCopy:
      "Abra o workspace e carregue o exemplo da API de usuários ou cole suas especificações. A base é o contrato usado hoje; a candidata é a versão que será publicada.",
    openWorkspace: "Abrir workspace de comparação →",
    compatibilityTitle: "02. Entenda a compatibilidade",
    compatibilityCopy:
      "A compatibilidade é avaliada pela perspectiva do consumidor. Uma especificação válida ainda pode quebrar clientes existentes. Analise a classificação e a localização afetada.",
    change: "MUDANÇA",
    classification: "CLASSIFICAÇÃO",
    operationRemoved: "Operação removida",
    optionalAdded: "Parâmetro opcional de requisição adicionado",
    enumAdded: "Valor de enum de resposta adicionado",
    cliTitle: "03. Use a CLI",
    cliCopy:
      "A CLI Java usa o mesmo núcleo de comparação sem enviar contratos pela rede.",
    exitCodes:
      "O código 0 indica que o limite não foi atingido, 1 indica resultados no limite escolhido e 2 indica entrada inválida ou erro.",
    actionsTitle: "04. Adicione uma verificação ao pull request",
    actionsCopy:
      "Use a CLI em um runner hospedado pelo GitHub. Mantenha segredos de produção e runners de deploy longe de código não confiável.",
    securityTitle: "Segurança e privacidade por intenção",
    securityCopy:
      "As comparações não mantêm estado e as entradas não são salvas. Referências $ref externas são rejeitadas e nunca acessadas. Deploys públicos devem impor limites de corpo, concorrência e requisições.",
    auditCopy:
      "Esta é uma afirmação de design sustentada pela implementação do repositório, não uma auditoria independente nem uma garantia sobre hosts externos.",
    onThisPage: "NESTA PÁGINA",
    toc: [
      "Primeira comparação",
      "Regras de compatibilidade",
      "Uso da CLI",
      "GitHub Actions",
      "Segurança e privacidade",
    ],
  },
};

const esES: Messages = {
  common: {
    skip: "Saltar al contenido",
    primaryNavigation: "Navegación principal",
    compare: "Comparar",
    docs: "Documentación",
    projectType: "PROYECTO DE PORTAFOLIO",
    language: "Idioma",
  },
  home: {
    intro: "Evolución de APIs, sin conjeturas.",
    title: "Detecta cambios incompatibles antes de publicar.",
    subtitle:
      "Compara especificaciones OpenAPI. Entiende qué cambió, qué se rompe y qué necesita revisión antes de que lo descubran tus consumidores.",
    start: "Iniciar comparación",
    github: "Ver en GitHub",
    note: "Sin registro. Trae dos especificaciones y obtén un diff claro.",
    exampleLabel: "Ejemplo de resultado de comparación",
    complete: "COMPARACIÓN COMPLETA",
    changes: "4 CAMBIOS DETECTADOS",
    breaking: "2 incompatibles",
    safe: "1 compatible",
    review: "1 para revisar",
    findingTitle: "Cambió el tipo de una propiedad de respuesta",
    findingText:
      "User.id cambió de entero a texto. Los clientes existentes pueden fallar al deserializar la respuesta.",
    baselineCandidate: "BASE → CANDIDATA",
    semantic: "Cambios semánticos, no solo líneas distintas.",
    explore: "Explorar la comparación →",
    builtFor: "Creado para tu contrato de API",
    workflowLabel: "01 / EL FLUJO",
    workflowTitle: "Una respuesta clara en tres pasos.",
    workflowCopy:
      "Menos tiempo leyendo diffs. Más confianza en la próxima versión.",
    steps: [
      {
        title: "Trae tus contratos",
        description:
          "Pega YAML o JSON, carga archivos o usa el ejemplo. Define una base y una candidata.",
      },
      {
        title: "Compara el significado",
        description:
          "Encuentra cambios en endpoints, parámetros, esquemas y respuestas, no en formato u orden de claves.",
      },
      {
        title: "Publica con contexto",
        description:
          "Revisa cada resultado, comparte un informe y lleva las mismas verificaciones a tus pull requests.",
      },
    ],
    contractLabel: "02 / CREADO PARA EL CONTRATO",
    contractTitle: "Señal, no ruido.",
    features: [
      {
        title: "Semántico por diseño",
        description:
          "Entiende tipos de respuesta, campos obligatorios y cambios de endpoints dentro del contrato OpenAPI.",
      },
      {
        title: "Resultados listos para revisar",
        description:
          "Cada cambio incluye un motivo y una ubicación precisa, con clasificación conservadora.",
      },
      {
        title: "Del navegador al build",
        description:
          "Comienza con una comparación interactiva, exporta JSON o Markdown y automatiza con la CLI.",
      },
    ],
    privacyLabel: "03 / PRIVACIDAD PRIMERO",
    privacyTitle: "Tus contratos.\nTu control.",
    privacyCopy:
      "Las especificaciones pueden describir sistemas sensibles. OASFuse compara en memoria y no conserva historial.",
    securityLink: "Lee los principios de seguridad →",
    privacyItems: [
      {
        title: "Sin estado por intención",
        description:
          "Las entradas no se guardan en el almacenamiento de la aplicación.",
      },
      {
        title: "Sin registro de por medio",
        description:
          "El flujo comienza con las especificaciones, no con un formulario.",
      },
      {
        title: "Inspeccionable, no una caja negra",
        description:
          "Las reglas son deterministas, documentadas y compartidas con la CLI.",
      },
    ],
    ctaTitle: "Haz que el próximo cambio sea deliberado.",
    ctaCopy: "Comienza con el ejemplo o compara la API que publicas hoy.",
    footer: "Especificaciones abiertas. Decisiones claras.",
    documentation: "Documentación",
  },
  workspace: {
    kicker: "WORKSPACE / NUEVA COMPARACIÓN",
    title: "Cada versión comienza con una comparación.",
    subtitle:
      "Añade el contrato actual y la versión propuesta. Mostraremos los cambios relevantes.",
    example: "Ejemplo",
    loadExample: "Cargar ejemplo",
    swap: "Intercambiar especificaciones",
    baseline: "Base",
    candidate: "Candidata",
    privacy:
      "Comparación sin estado por diseño. Revisa nuestros principios de seguridad.",
    compare: "Comparar especificaciones",
    comparing: "Comparando especificaciones…",
    missing: "Añade las especificaciones base y candidata.",
  },
  editor: {
    loading: "Cargando editor…",
    upload: "Subir archivo",
    drop: "Suelta un archivo .yaml o .json en cualquier parte de este editor",
    ready: "✓ Listo para validar",
    lines: "líneas",
    chooseFile: "Elige un archivo .yaml, .yml o .json.",
    size: "Cada especificación debe tener como máximo 2 MiB.",
    specification: "especificación",
    openApiEditor: "editor OpenAPI",
  },
  results: {
    back: "← Volver al workspace",
    title: "Resultados de la comparación",
    complete: "COMPLETA",
    newComparison: "Nueva comparación",
    severities: {
      breaking: "Incompatible",
      nonBreaking: "Compatible",
      review: "Requiere revisión",
    },
    severityHelp: {
      breaking: "Los consumidores existentes pueden verse afectados",
      nonBreaking: "Cambios aditivos en el contrato",
      review: "El impacto depende de tu flujo",
    },
    search: "Buscar resultados",
    searchPlaceholder: "Buscar resultados o rutas del esquema…",
    filter: "Filtrar por severidad",
    all: "Todas las severidades",
    showing: "Mostrando {shown} de {total} cambios",
    emptyTitle: "Ningún resultado coincide con los filtros.",
    emptyCopy: "Prueba otra ruta de esquema o limpia los filtros.",
    clear: "Limpiar filtros",
    baseline: "BASE",
    candidate: "CANDIDATA",
    present: "presente",
    absent: "ausente",
    markdownTitle: "Informe de comparación OASFuse",
    totalFindings: "Total de resultados",
    severity: "Severidad",
    rule: "Regla",
    location: "Ubicación",
    findingTitles: {
      operationAdded: "Operación añadida",
      operationIdChanged: "Identificador de operación modificado",
      responsePropertyRemoved: "Propiedad de respuesta eliminada",
      responseTypeChanged: "Tipo de respuesta modificado",
    },
  },
  errors: {
    timeout: "La comparación superó el tiempo límite.",
    unavailable: "El servicio de comparación no está disponible.",
    unexpected: "Error inesperado en la comparación.",
  },
  docs: {
    search: "Buscar documentación",
    searchPlaceholder: "Buscar docs…  ⌘ K",
    groups: [
      {
        title: "PRIMEROS PASOS",
        items: ["Resumen", "Inicio rápido", "Tu primera comparación"],
      },
      {
        title: "CONCEPTOS PRINCIPALES",
        items: [
          "Reglas de compatibilidad",
          "Entender los resultados",
          "Especificaciones compatibles",
        ],
      },
      {
        title: "AUTOMATIZACIÓN",
        items: [
          "Referencia de la CLI",
          "GitHub Actions",
          "Formatos de exportación",
        ],
      },
      { title: "PROYECTO", items: ["Seguridad y privacidad", "Contribuir"] },
    ],
    label: "PRIMEROS PASOS / INICIO RÁPIDO",
    title: "Una publicación de API más segura comienza aquí.",
    lead: "Compara dos contratos OpenAPI, entiende el impacto e integra verificaciones de compatibilidad en tu flujo de desarrollo.",
    yamlJson: "YAML y JSON",
    firstTitle: "01. Ejecuta tu primera comparación",
    firstCopy:
      "Abre el workspace y carga el ejemplo de la API de usuarios o pega tus especificaciones. La base es el contrato actual y la candidata es la versión que planeas publicar.",
    openWorkspace: "Abrir workspace de comparación →",
    compatibilityTitle: "02. Entiende la compatibilidad",
    compatibilityCopy:
      "La compatibilidad se evalúa desde la perspectiva del consumidor. Una especificación válida todavía puede romper clientes existentes. Revisa la clasificación y la ubicación afectada.",
    change: "CAMBIO",
    classification: "CLASIFICACIÓN",
    operationRemoved: "Operación eliminada",
    optionalAdded: "Parámetro opcional de solicitud añadido",
    enumAdded: "Valor enum de respuesta añadido",
    cliTitle: "03. Usa la CLI",
    cliCopy:
      "La CLI de Java usa el mismo núcleo de comparación sin enviar contratos por la red.",
    exitCodes:
      "El código 0 indica que no se alcanzó el umbral, 1 indica resultados en el umbral elegido y 2 indica una entrada inválida o un error.",
    actionsTitle: "04. Añade una verificación al pull request",
    actionsCopy:
      "Usa la CLI en un runner alojado por GitHub. Mantén secretos de producción y runners de despliegue lejos de código no confiable.",
    securityTitle: "Seguridad y privacidad por intención",
    securityCopy:
      "Las comparaciones no conservan estado y las entradas no se guardan. Las referencias $ref externas se rechazan y nunca se consultan. Los despliegues públicos deben aplicar límites de cuerpo, concurrencia y solicitudes.",
    auditCopy:
      "Esta es una afirmación de diseño respaldada por el repositorio, no una auditoría externa ni una garantía sobre hosts que no controlas.",
    onThisPage: "EN ESTA PÁGINA",
    toc: [
      "Primera comparación",
      "Reglas de compatibilidad",
      "Uso de la CLI",
      "GitHub Actions",
      "Seguridad y privacidad",
    ],
  },
};

export const messages: Record<Locale, Messages> = {
  "en-US": enUS,
  "pt-BR": ptBR,
  "es-ES": esES,
};
