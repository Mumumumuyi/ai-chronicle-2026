import { Epoch, Milestone } from '../types';
import { SupportedLanguage } from '../i18n/types';

interface LocalizedEpochData {
  title: string;
  subtitle: string;
  summary: string;
  era?: string;
  computeOrderOfMagnitude?: string;
  dominantParadigm?: string;
  philosophicalTension?: string;
  epigraphQuote?: string;
  epigraphAuthor?: string;
}

interface LocalizedMilestoneData {
  title: string;
  subtitle: string;
  summary: string;
  computeCostEstimate?: string;
  fullNarrative?: string;
  historicalImpact?: string;
  tags?: string[];
}

// Translations for all 7 Epochs
export const EPOCH_TRANSLATIONS: Record<string, Record<string, LocalizedEpochData>> = {
  'epoch-0': {
    en: {
      title: 'The Spark of Prometheus: Precursors of Rational Machines',
      subtitle: 'Turing\'s Question, Simplified Neurons & The Dartmouth Ambition',
      summary: 'World War II codebreaking catalyzed the first electronic computers. Alan Turing, John von Neumann, Warren McCulloch, and Walter Pitts sought to formalize human reasoning with mathematics and circuitry.',
      dominantParadigm: 'Symbolic Reasoning & Logic',
      philosophicalTension: 'Is "thinking" equivalent to formal symbolic manipulation on a Turing tape?',
      epigraphQuote: 'I believe that at the end of the century the use of words and general educated opinion will have altered so much that one will be able to speak of machines thinking without expecting to be contradicted.',
      epigraphAuthor: 'Alan Turing, Computing Machinery and Intelligence (1950)'
    },
    es: {
      title: 'La Chispa de Prometeo: Precursores de las Máquinas Racionales',
      subtitle: 'La pregunta de Turing, neuronas simplificadas y la ambición de Dartmouth',
      summary: 'El descifrado de códigos en la Segunda Guerra Mundial catalizó las primeras computadoras. Turing, von Neumann y Pitts buscaron formalizar el razonamiento humano con circuitos y lógica.',
      dominantParadigm: 'Simbolismo y Lógica',
      philosophicalTension: '¿El pensamiento equivale a la manipulación de símbolos formales?',
      epigraphQuote: 'Creo que a finales de siglo se hablará de máquinas pensantes sin encontrar contradicción.',
      epigraphAuthor: 'Alan Turing (1950)'
    },
    de: {
      title: 'Der Funke des Prometheus: Vorläufer rationaler Maschinen',
      subtitle: 'Turings Frage, vereinfachte Neuronen und die Dartmouth-Ambition',
      summary: 'Die Kryptoanalyse des Zweiten Weltkriegs brachte die ersten elektronischen Computer hervor. Pioniere wie Turing und von Neumann formalisierten logische Denkprozesse mathematisch.',
      dominantParadigm: 'Symbolik und Logik',
      philosophicalTension: 'Ist Denken äquivalent zu formaler Symbolverarbeitung?',
      epigraphQuote: 'Ich glaube, dass man Ende des Jahrhunderts von denkenden Maschinen sprechen kann, ohne Widerspruch zu ernten.',
      epigraphAuthor: 'Alan Turing (1950)'
    },
    fr: {
      title: 'L’Étincelle de Prométhée : Les Précurseurs des Machines Rationnelles',
      subtitle: 'La question de Turing, neurones simplifiés et l’ambition de Dartmouth',
      summary: 'Le décryptage de la Seconde Guerre mondiale a catalysé les premiers ordinateurs électroniques. Turing, von Neumann et McCulloch ont formalisé le raisonnement humain.',
      dominantParadigm: 'Symbolisme et Logique',
      philosophicalTension: 'La pensée équivaut-elle à une manipulation de symboles formels ?',
      epigraphQuote: 'Je crois qu’à la fin du siècle, on pourra parler de machines pensantes sans craindre de contradiction.',
      epigraphAuthor: 'Alan Turing (1950)'
    }
  },
  'epoch-1': {
    en: {
      title: 'The Golden Surge & The First Disillusion: Symbols vs. Perceptrons',
      subtitle: 'Heuristic Search, The Perceptron Dream & The Linear XOR Barrier',
      summary: 'From Dartmouth to the early 1970s, euphoria surrounded theorem provers and Frank Rosenblatt\'s Perceptron. But Minsky and Papert\'s proof of linear limits triggered the first brutal AI Winter.',
      dominantParadigm: 'Early Connectionism vs. Symbolic Search',
      philosophicalTension: 'Are minds inductive statistical learners or deductive axiomatic reasoners?',
      epigraphQuote: 'Machines will be capable, within twenty years, of doing any work a man can do.',
      epigraphAuthor: 'Herbert A. Simon (1965)'
    },
    es: {
      title: 'El Auge Dorado y la Primera Desilusión: Símbolos vs. Perceptrones',
      subtitle: 'Búsqueda heurística, el sueño del perceptrón y la barrera lineal XOR',
      summary: 'De Dartmouth a los 70, la euforia dominó la demostración automática de teoremas y el perceptrón. Pero la prueba de Minsky sobre los límites del XOR desató el primer invierno de la IA.',
      dominantParadigm: 'Conexionismo temprano vs. Búsqueda simbólica',
      philosophicalTension: '¿La mente es un aprendiz estadístico inductivo o un razonador deductivo?',
      epigraphQuote: 'Las máquinas serán capaces, en veinte años, de hacer cualquier trabajo que un hombre pueda hacer.',
      epigraphAuthor: 'Herbert A. Simon (1965)'
    },
    de: {
      title: 'Der goldene Aufschwung und die erste Ernüchterung: Symbole vs. Perzeptrons',
      subtitle: 'Heuristische Suche, der Perzeptron-Traum und die lineare XOR-Grenze',
      summary: 'Von Dartmouth bis in die frühen 1970er Jahre herrschte Euphorie über automatische Theorembeweiser. Minskys Beweis der linearen Schranken löste den ersten harten KI-Winter aus.',
      dominantParadigm: 'Früher Konnektionismus vs. Symbolische Suche',
      philosophicalTension: 'Ist der Geist ein induktiver statistischer Lerner oder ein deduktiver Logiker?',
      epigraphQuote: 'Maschinen werden innerhalb von zwanzig Jahren jede Arbeit verrichten können, die ein Mensch kann.',
      epigraphAuthor: 'Herbert A. Simon (1965)'
    },
    fr: {
      title: 'L’Âge d’Or et la Première Désillusion : Symboles vs. Perceptrons',
      subtitle: 'Recherche heuristique, le rêve du perceptron et la barrière linéaire XOR',
      summary: 'De Dartmouth au début des années 70, l’euphorie régnait autour du perceptron. Mais la preuve de Minsky sur les limites linéaires a déclenché le premier hiver de l’IA.',
      dominantParadigm: 'Connexionnisme précoce vs. Recherche symbolique',
      philosophicalTension: 'L’esprit est-il un apprenant statistique ou un raisonneur déductif ?',
      epigraphQuote: 'Les machines seront capables, d’ici vingt ans, de faire tout travail qu’un homme peut faire.',
      epigraphAuthor: 'Herbert A. Simon (1965)'
    }
  },
  'epoch-2': {
    en: {
      title: 'Winter Hibernation, Resurgence & Expert Systems: Knowledge is Power',
      subtitle: 'Feigenbaum\'s Knowledge Engineering, Hopfield Physics & The Backpropagation Awakening',
      summary: 'AI pivoted from general logic to domain expertise. Expert systems delivered immense corporate value, while Hopfield networks and Rumelhart-Hinton-Williams revived backpropagation from dormancy.',
      dominantParadigm: 'Knowledge Engineering & Multi-Layer Neural Nets',
      philosophicalTension: 'Can commonsense reasoning be hand-engineered through millions of if-then rules?',
      epigraphQuote: 'Knowledge is power: in the knowledge lies the power to make the expert performance possible.',
      epigraphAuthor: 'Edward Feigenbaum (1977)'
    },
    es: {
      title: 'Hibernación, Resurgimiento y Sistemas Expertos: El Conocimiento es Poder',
      subtitle: 'Ingeniería del conocimiento, física de Hopfield y el despertar de la retropropagación',
      summary: 'La IA pasó de la lógica pura al conocimiento experto. Los sistemas expertos demostraron valor comercial, mientras que Hopfield y Hinton revivieron la retropropagación.',
      dominantParadigm: 'Ingeniería del Conocimiento y Redes Neuronales',
      philosophicalTension: '¿Se puede codificar el sentido común humano en millones de reglas if-then?',
      epigraphQuote: 'El conocimiento es poder: en el conocimiento reside la capacidad del desempeño experto.',
      epigraphAuthor: 'Edward Feigenbaum (1977)'
    },
    de: {
      title: 'Winterschlaf, Wiederbelebung und Expertensysteme: Wissen ist Macht',
      subtitle: 'Wissensbasierte Systeme, Hopfield-Netze und das Erwachen der Backpropagation',
      summary: 'Die KI wandte sich Fachwissen zu. Expertensysteme lieferten immensen wirtschaftlichen Nutzen, während Hopfield und Hinton der Backpropagation neues Leben einhauchten.',
      dominantParadigm: 'Wissensrepräsentation und Mehrschichtige Netze',
      philosophicalTension: 'Kann gesunder Menschenverstand in Millionen Wenn-Dann-Regeln gefasst werden?',
      epigraphQuote: 'Wissen ist Macht: Im Wissen liegt die Kraft für Expertenleistungen.',
      epigraphAuthor: 'Edward Feigenbaum (1977)'
    },
    fr: {
      title: 'Hibernation, Renaissance et Systèmes Experts : Le Savoir est Pouvoir',
      subtitle: 'Ingénierie des connaissances, réseaux de Hopfield et réveil de la rétropropagation',
      summary: 'L’IA s’est tournée vers l’expertise métier. Les systèmes experts ont prouvé leur valeur industrielle, tandis que Hinton et ses pairs ont ressuscité la rétropropagation.',
      dominantParadigm: 'Ingénierie des Connaissances et Réseaux de Neurones',
      philosophicalTension: 'Le bon sens peut-il être codé à la main via des millions de règles ?',
      epigraphQuote: 'Le savoir est pouvoir : c’est dans la connaissance que réside la performance.',
      epigraphAuthor: 'Edward Feigenbaum (1977)'
    }
  },
  'epoch-3': {
    en: {
      title: 'Statistical Rationality & The Quiet Revolution: The Golden Age of ML',
      subtitle: 'Vapnik\'s Structural Risk, Convex Optimization, Deep Blue & The Seed of ImageNet',
      summary: 'Machine learning rejected brittle heuristics in favor of rigorous statistical foundations. Support Vector Machines, graphical models, and Bayesian networks dominated academic discourse.',
      dominantParadigm: 'Statistical Learning Theory (SVM & Convex Optimization)',
      philosophicalTension: 'Should machine intelligence rely on human-designed features or end-to-end learning?',
      epigraphQuote: 'Nothing is more practical than a good theory.',
      epigraphAuthor: 'Vladimir Vapnik, The Nature of Statistical Learning Theory (1995)'
    },
    es: {
      title: 'Racionalidad Estadística y la Revolución Silenciosa: La Edad de Oro del ML',
      subtitle: 'Riesgo estructural de Vapnik, optimización convexa, Deep Blue y la semilla de ImageNet',
      summary: 'El aprendizaje automático adoptó fundamentos estadísticos rigurosos. Las SVM, modelos gráficos y redes bayesianas dominaron la academia.',
      dominantParadigm: 'Teoría del Aprendizaje Estadístico',
      philosophicalTension: '¿La IA debe depender de características diseñadas a mano o de aprendizaje de extremo a extremo?',
      epigraphQuote: 'Nada es más práctico que una buena teoría.',
      epigraphAuthor: 'Vladimir Vapnik (1995)'
    },
    de: {
      title: 'Statistische Rationalität & Die leise Revolution: Das goldene Zeitalter des ML',
      subtitle: 'Vapniks strukturelles Risiko, konvexe Optimierung, Deep Blue und ImageNet',
      summary: 'Maschinelles Lernen stützte sich auf mathematische Strenge. Support Vector Machines und Bayessche Netze verdrängten symbolische Heuristiken.',
      dominantParadigm: 'Statistische Lerntheorie (SVM & Konvexe Optimierung)',
      philosophicalTension: 'Sollte Intelligenz auf handgefertigten Merkmalen oder End-to-End-Lernen basieren?',
      epigraphQuote: 'Nichts ist praktischer als eine gute Theorie.',
      epigraphAuthor: 'Vladimir Vapnik (1995)'
    },
    fr: {
      title: 'Rationalité Statistique et Révolution Silencieuse : L’Âge d’Or du ML',
      subtitle: 'Risque structurel de Vapnik, optimisation convexe, Deep Blue et la graine d’ImageNet',
      summary: 'L’apprentissage automatique a adopté des fondations statistiques rigoureuses. Les SVM et réseaux bayésiens ont dominé le monde académique.',
      dominantParadigm: 'Théorie de l’Apprentissage Statistique',
      philosophicalTension: 'L’intelligence doit-elle reposer sur des features manuelles ou du end-to-end ?',
      epigraphQuote: 'Rien n’est plus pratique qu’une bonne théorie.',
      epigraphAuthor: 'Vladimir Vapnik (1995)'
    }
  },
  'epoch-4': {
    en: {
      title: 'The Compute Tsunami & Deep Representation: The Triumph of Scale',
      subtitle: 'AlexNet, ResNet, AlphaGo, GANs and The Universal Transformer Architecture',
      summary: 'AlexNet unleashed the deep learning revolution powered by GPUs and massive datasets. Transformers, GANs, and AlphaGo shattered human baselines in vision, strategic games, and language understanding.',
      dominantParadigm: 'Deep Representation Learning & Compute Scaling',
      philosophicalTension: 'The Bitter Lesson: Does general method leveraging compute always beat human domain heuristics?',
      epigraphQuote: 'The biggest lesson that can be read from 70 years of AI research is that general methods that leverage computation are ultimately the most effective, by a large margin.',
      epigraphAuthor: 'Rich Sutton, The Bitter Lesson (2019)'
    },
    es: {
      title: 'El Tsunami del Cómputo y la Representación Profunda: El Triunfo de la Escala',
      subtitle: 'AlexNet, ResNet, AlphaGo, GANs y la arquitectura universal Transformer',
      summary: 'AlexNet desató la revolución del aprendizaje profundo con GPUs. Los Transformers y AlphaGo superaron las marcas humanas en visión, juegos y lenguaje.',
      dominantParadigm: 'Aprendizaje de Representaciones Profundas',
      philosophicalTension: 'La Lección Amarga: ¿Los métodos que escalan con el cómputo siempre superan a las heurísticas humanas?',
      epigraphQuote: 'La mayor lección de 70 años de investigación en IA es que los métodos generales que aprovechan el cómputo son los más eficaces.',
      epigraphAuthor: 'Rich Sutton (2019)'
    },
    de: {
      title: 'Der Rechenpower-Tsunami & Tiefe Repräsentationen: Triumph der Skalierung',
      subtitle: 'AlexNet, ResNet, AlphaGo, GANs und die universelle Transformer-Architektur',
      summary: 'AlexNet startete die Deep-Learning-Revolution mit GPUs. Transformer und AlphaGo übertrafen menschliche Höchstleistungen im Sehen, Spielen und Verstehen.',
      dominantParadigm: 'Deep Representation Learning & Rechenskalierung',
      philosophicalTension: 'Die bittere Lektion: Übertrifft rechenskalierbare Methodik stets menschliche Heuristiken?',
      epigraphQuote: 'Die größte Lektion aus 70 Jahren KI-Forschung ist, dass allgemeine Methoden, die Rechenleistung nutzen, am effektivsten sind.',
      epigraphAuthor: 'Rich Sutton (2019)'
    },
    fr: {
      title: 'Le Tsunami du Calcul et la Représentation Profonde : Le Triomphe de l’Échelle',
      subtitle: 'AlexNet, ResNet, AlphaGo, GANs et l’architecture universelle Transformer',
      summary: 'AlexNet a inauguré l’ère du deep learning moderne grâce aux GPU. Les Transformers et AlphaGo ont pulvérisé les références humaines.',
      dominantParadigm: 'Apprentissage de Représentations Profondes',
      philosophicalTension: 'La Leçon Amère : Les méthodes exploitant le calcul surpassent-elles toujours l’expertise humaine ?',
      epigraphQuote: 'La plus grande leçon de 70 ans de recherche en IA est que les méthodes générales tirant parti du calcul sont les plus efficaces.',
      epigraphAuthor: 'Rich Sutton (2019)'
    }
  },
  'epoch-5': {
    en: {
      title: 'Foundation Models & The Emergence Era: A Glimpse of General Intelligence',
      subtitle: 'Scaling Laws, In-Context Few-Shot Learning, ChatGPT & The Open-Source Explosion',
      summary: 'Kaplan\'s scaling laws and GPT-3 revealed that predictable parameter scaling yields unpredictable qualitative emergence. ChatGPT sparked a global geopolitical and industrial scramble.',
      dominantParadigm: 'Autoregressive Foundation Models & RLHF Alignment',
      philosophicalTension: 'Are LLMs stochastic parrots or do internal world models form through next-token prediction?',
      epigraphQuote: 'Scale is all you need: larger models are more sample-efficient and exhibit sudden phase transitions.',
      epigraphAuthor: 'OpenAI Frontier Team (2020-2023)'
    },
    es: {
      title: 'Modelos Fundacionales y la Era de la Emergencia: Un Atisbo de la Inteligencia General',
      subtitle: 'Leyes de escala, aprendizaje en contexto, ChatGPT y el estallido de código abierto',
      summary: 'Las leyes de escala demostraron que la escala produce emergencias cualitativas inesperadas. ChatGPT encendió una carrera tecnológica global.',
      dominantParadigm: 'Modelos Fundacionales Autoregresivos y RLHF',
      philosophicalTension: '¿Son los LLM loros estocásticos o forman verdaderos modelos internos del mundo?',
      epigraphQuote: 'La escala es todo lo que necesitas: modelos más grandes muestran transiciones de fase cualitativas.',
      epigraphAuthor: 'Frontier AI Research (2020-2023)'
    },
    de: {
      title: 'Fundamentale Modelle & Die Ära der Emergenz: Ein Blick auf AGI',
      subtitle: 'Skalierungsgesetze, In-Context-Learning, ChatGPT und der Open-Source-Boom',
      summary: 'Kaplans Skalierungsgesetze zeigten, dass reine Parameterskalierung qualitative Fähigkeiten hervorbringt. ChatGPT löste eine globale industrielle Revolution aus.',
      dominantParadigm: 'Autoregressive Foundation Models & RLHF Alignment',
      philosophicalTension: 'Sind LLMs stochastische Papageien oder bilden sie echte innere Weltmodelle?',
      epigraphQuote: 'Skalierung ist der Schlüssel: Größere Modelle vollziehen plötzliche qualitative Phasensprünge.',
      epigraphAuthor: 'Frontier AI Research (2020-2023)'
    },
    fr: {
      title: 'Modèles Fondamentaux et l’Ère de l’Émergence : Une Lueur d’Intelligence Générale',
      subtitle: 'Lois d’échelle, apprentissage en contexte, ChatGPT et l’explosion open source',
      summary: 'Les lois d’échelle ont révélé que la mise à l’échelle quantitative produit des sauts qualitatifs émergents. ChatGPT a déclenché une révolution planétaire.',
      dominantParadigm: 'Modèles Fondamentaux Autoregressifs et Alignement RLHF',
      philosophicalTension: 'Les LLM sont-ils de simples perroquets stochastiques ou modélisent-ils le monde ?',
      epigraphQuote: 'L’échelle fait la différence : les modèles géants présentent de véritables transitions de phase.',
      epigraphAuthor: 'Frontier AI Research (2020-2023)'
    }
  },
  'epoch-6': {
    en: {
      title: 'Dawn of the Singularity: System 2 Reasoning, Test-Time Compute & Agent Swarms',
      subtitle: 'Beyond Next-Token Prediction: Latent Search, Neuro-Symbolic Synthesis & Self-Governing Loops',
      summary: 'As pretraining hits physical data walls, the frontier pivots to Test-Time Compute (Search, Rollout Verification, and Tree of Thoughts). Autonomous agent runtime loops and neuro-symbolic reasoning herald the silicon threshold.',
      era: '2024 — 2026.09 (Current Time)',
      computeOrderOfMagnitude: '10^25 — 10^27 FLOPs + Dynamic Test-Time Compute',
      dominantParadigm: 'System 2 Test-Time Search & Autonomous Agentic Loops',
      philosophicalTension: 'Can verifiable search and automated self-play surpass all human intellectual benchmarks?',
      epigraphQuote: 'The essence of true intelligence is not in memorizing all answers, but in searching through vast action spaces under rigorous constraints to find the optimal path.',
      epigraphAuthor: 'Frontier AI Research Consensus (2026.09)'
    },
    es: {
      title: 'El Amanecer de la Singularidad: Razonamiento Sistema 2, Cómputo de Inferencia y Enjambres',
      subtitle: 'Más allá de la predicción de tokens: Búsqueda latente, síntesis neuro-simbólica y bucles autónomos',
      summary: 'Al tocar techo los datos de preentrenamiento, la frontera avanza hacia el Cómputo en Tiempo de Inferencia y el razonamiento Sistema 2 con bucles de agentes autónomos.',
      era: '2024 — 2026.09 (Actualidad)',
      computeOrderOfMagnitude: '10^25 — 10^27 FLOPs + Cómputo Dinámico en Inferencia',
      dominantParadigm: 'Búsqueda en Tiempo de Inferencia y Bucles Autónomos',
      philosophicalTension: '¿Puede la búsqueda verificable con auto-juego superar todo juicio humano?',
      epigraphQuote: 'La esencia de la inteligencia no es memorizar, sino buscar el camino óptimo en el espacio de acción.',
      epigraphAuthor: 'Consenso de Investigación de Frontera (2026.09)'
    },
    de: {
      title: 'Dämmerung der Singularität: System 2 Denken, Inferenzzeit-Suche & Agenten-Schwärme',
      subtitle: 'Jenseits von Next-Token-Prediction: Latente Suche, Neuro-Symbolik und autonome Runtime-Loops',
      summary: 'Da Pretraining an Datengrenzen stößt, verlagert sich der Fortschritt auf Inferenzzeit-Rechenleistung, Rollout-Verifikation und autonome Software-Agenten.',
      era: '2024 — 2026.09 (Gegenwart)',
      computeOrderOfMagnitude: '10^25 — 10^27 FLOPs + Dynamische Inferenz-Berechnung',
      dominantParadigm: 'System 2 Inferenz-Suche & Autonome Agenten-Loops',
      philosophicalTension: 'Kann verifizierbare Suche und Selbstspiel alle menschlichen Denkleistungen übertreffen?',
      epigraphQuote: 'Wahre Intelligenz speichert nicht alle Antworten, sondern findet den optimalen Pfad durch Suche unter harten Bedingungen.',
      epigraphAuthor: 'Frontier AI Research Consensus (2026.09)'
    },
    fr: {
      title: 'L’Aube de la Singularité : Raisonnement Système 2, Calcul d’Inférence et Essaims d’Agents',
      subtitle: 'Au-delà de la prédiction du token suivant : Recherche latente, neuro-symbolisme et boucles autonomes',
      summary: 'Le pré-entraînement heurtant le mur des données, la frontière pivote vers le calcul au moment de l’inférence (System 2, vérification d’arbres de pensée et essaims d’agents).',
      era: '2024 — 2026.09 (Présent)',
      computeOrderOfMagnitude: '10^25 — 10^27 FLOPs + Calcul Dynamique au Temps de Test',
      dominantParadigm: 'Recherche en Temps d’Inférence & Boucles d’Agents Autonomes',
      philosophicalTension: 'La recherche vérifiable et l’auto-jeu peuvent-ils surpasser tout le génie humain ?',
      epigraphQuote: 'L’essence de l’intelligence ne réside pas dans la mémoire, mais dans la recherche de trajectoires optimales.',
      epigraphAuthor: 'Consensus de Recherche IA de Pointe (2026.09)'
    }
  }
};

// Core Milestone Translations for English & International
export const MILESTONE_TRANSLATIONS: Record<string, Record<string, LocalizedMilestoneData>> = {
  'm-1943': {
    en: {
      title: 'McCulloch-Pitts Neuron Model',
      subtitle: 'First Mathematical Formalization of Neural Activity',
      summary: 'Warren McCulloch and Walter Pitts prove that networks of idealized binary threshold switches can implement any logical operation.',
      historicalImpact: 'Demonstrated that mental phenomena can be executed by equivalent machine logic circuits.',
      fullNarrative: 'In 1943 the neurophysiologist Warren McCulloch and the young mathematician Walter Pitts published "A Logical Calculus of the Ideas Immanent in Nervous Activity" in the Bulletin of Mathematical Biophysics. The paper abstracted the all-or-none firing of a biological neuron into a binary weighted summation unit with a threshold. For the first time it built a bridge between neurophysiology and mathematical logic, and it laid the first conceptual cornerstone for every artificial neural network that followed.',
      computeCostEstimate: 'Pencil-and-paper derivation / relay logic',
      tags: ['Neuron Model', 'Logic Calculus', 'Cybernetics']
    }
  },
  'm-1950': {
    en: {
      title: 'The Turing Test & "Computing Machinery and Intelligence"',
      subtitle: 'Defining Thinking as an Operable Imitation Game',
      summary: 'Alan Turing bypasses metaphysical debates about "consciousness", proposing the imitation game: if a machine behaves indistinguishably from a human via language, it is intelligent.',
      historicalImpact: 'Established functional equivalence and natural language dialogue as the foundational benchmark of machine intelligence.',
      fullNarrative: 'In his 1950 paper in the journal Mind, Alan Turing proposed the famous Imitation Game. He went further than the test itself: the paper anticipated learning machines (the "child machine"), the role of randomness in decision-making, ways of instilling knowledge, and even the ethical objections to thinking machines. It stands as the founding research programme of twentieth-century AI philosophy and method.',
      computeCostEstimate: 'Thought experiment / Manchester Mark 1',
      tags: ['Turing Test', 'Philosophy of AI', 'Natural Language']
    }
  },
  'm-1956': {
    en: {
      title: 'The Dartmouth Summer Research Project on AI',
      subtitle: 'Official Birth and Naming of "Artificial Intelligence"',
      summary: 'John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude Shannon organize the historic two-month workshop that established AI as an academic discipline.',
      historicalImpact: 'Coined the term Artificial Intelligence and charted the research roadmap for the next half-century.',
      fullNarrative: 'In the summer of 1956, about a dozen young mathematicians, psychologists and engineers spent eight weeks in the mathematics building at Dartmouth College. John McCarthy coined the term "Artificial Intelligence", with a distinctly computational flavour, partly to step out of the broad shadow of Norbert Wiener\'s cybernetics. Allen Newell and Herbert Simon brought the Logic Theorist, a program that proved theorems from Principia Mathematica and impressed everyone present.',
      computeCostEstimate: 'IBM 704',
      tags: ['Dartmouth Workshop', 'Birth of AI', 'Logic Theorist']
    }
  },
  'm-1958': {
    en: {
      title: 'Frank Rosenblatt\'s Perceptron',
      subtitle: 'The First Learnable Artificial Neural Network Hardware',
      summary: 'Frank Rosenblatt creates the Mark I Perceptron at Cornell Aeronautical Laboratory, capable of optical pattern recognition via weighted updates.',
      historicalImpact: 'Ignited worldwide enthusiasm for physical self-organizing learning systems.',
      fullNarrative: 'Frank Rosenblatt defined the perceptron as an adaptive system of sensory, association and response layers, and proved the perceptron convergence theorem. The press was electrified: The New York Times described the machine as the embryo of a computer expected to walk, talk, see, write, reproduce itself and be conscious of its existence. Connectionism drew intense public and military attention for the first time.',
      computeCostEstimate: 'Custom analog circuitry + IBM 704',
      tags: ['Perceptron', 'Weight Learning', 'Hardware']
    }
  },
  'm-1965': {
    en: {
      title: 'ELIZA: First Psychotherapist Chatbot',
      subtitle: 'Pattern Matching and The Illusion of Machine Empathy',
      summary: 'Joseph Weizenbaum builds ELIZA at MIT. Through simple syntactic keyword substitution, it convincingly simulated a Rogerian psychotherapist, exposing the "ELIZA Effect".',
      historicalImpact: 'First demonstration of human psychological susceptibility to linguistic AI illusions.',
      fullNarrative: 'ELIZA\'s code was remarkably simple: it rephrased keywords from the user\'s input as questions ("Why do you feel your mother is hard on you?"). Yet many users believed it had genuine empathy; Weizenbaum\'s own secretary reportedly asked him to leave the room so she could talk to the machine in private. The experience left Weizenbaum deeply troubled and led him to write Computer Power and Human Reason, a lasting critique of technological rationality.',
      computeCostEstimate: 'IBM 7094',
      tags: ['NLP', 'ELIZA Effect', 'Philosophy of Technology']
    }
  },
  'm-1969': {
    en: {
      title: 'Minsky & Papert\'s "Perceptrons"',
      subtitle: 'The XOR Limitation Proof and The First AI Winter',
      summary: 'Marvin Minsky and Seymour Papert prove mathematically that single-layer perceptrons cannot solve linearly non-separable problems like XOR, freezing neural network funding for a decade.',
      historicalImpact: 'Drove symbolic logic to dominance while plunging connectionism into its first harsh winter.',
      fullNarrative: 'This mathematically rigorous book landed like a blizzard on connectionism\'s hopes in academia and among funding agencies. Multilayer networks already existed, but without an efficient way to compute gradients for their hidden weights (backpropagation), the field generalised Minsky and Papert\'s critique of single-layer perceptrons into a verdict against neural networks as a whole, and funding quickly dried up.',
      computeCostEstimate: 'Mathematical proof',
      tags: ['XOR Problem', 'First AI Winter', 'Paradigm Debate']
    }
  },
  'm-1973': {
    en: {
      title: 'The Lighthill Report & DARPA Retrenchment',
      subtitle: 'Academic Skepticism and The Onset of the First AI Winter',
      summary: 'Sir James Lighthill reports to the British Science Research Council that AI research failed to achieve grandiose promises, leading to sweeping budget cancellations in the UK and US.',
      historicalImpact: 'Established the recurring boom-and-bust paradigm of inflated AI expectations.',
      fullNarrative: 'Sir James Lighthill argued that algorithms which performed well in laboratory "toy worlds" collapsed in real-world settings, where the search space grew exponentially and the computation became unaffordable. Soon afterwards DARPA sharply cut funding for basic AI research without a clear military application, and the first AI winter spread worldwide.',
      computeCostEstimate: 'Policy review and audit',
      tags: ['First AI Winter', 'Combinatorial Explosion', 'Research Policy']
    }
  },
  'm-1976': {
    en: {
      title: 'The Rise of Expert Systems: MYCIN & DENDRAL',
      subtitle: 'Knowledge Engineering Takes Root in Real-World Domains',
      summary: 'Stanford researchers build MYCIN for infectious disease diagnosis and DENDRAL for chemical mass spectrometry, demonstrating the practical value of specialized heuristic rule engines.',
      historicalImpact: 'Transitioned AI from toy mathematical problems to high-value industrial and clinical applications.',
      fullNarrative: 'MYCIN introduced certainty factors, formalising the heuristic judgement of human experts working with incomplete information as rule-based inference. In evaluations its antibiotic recommendations for specific pathogens were judged comparable to those of Stanford infectious-disease specialists, launching a decade-long commercial boom in expert systems.',
      computeCostEstimate: 'DEC PDP-10 / SAIL',
      tags: ['Expert Systems', 'Production Rules', 'Knowledge Engineering']
    }
  },
  'm-1982': {
    en: {
      title: 'Hopfield Networks & Physical Energy Formulations',
      subtitle: 'Ising Spin Glasses Meet Associative Memory',
      summary: 'Physicist John Hopfield introduces recurrent symmetric networks with an associative Lyapunov energy function, reviving interdisciplinary physicist interest in neural networks.',
      historicalImpact: 'Bridged statistical mechanics, physics, and associative computation.',
      fullNarrative: 'John Hopfield showed physicists and computer scientists that a network evolving under asynchronous dynamics descends monotonically along an energy surface until it settles in a local minimum. The result drew mainstream physicists to neural networks as complex systems and restored a measure of rigour and respectability to connectionism.',
      computeCostEstimate: 'Minicomputer batch jobs',
      tags: ['Hopfield Network', 'Energy-Based Model', 'Nobel Prize in Physics']
    }
  },
  'm-1986': {
    en: {
      title: 'Rumelhart, Hinton & Williams: Backpropagation Resurgence',
      subtitle: 'Efficient Gradient Descent for Multi-Layer Perceptrons',
      summary: 'The PDP Research Group publishes "Learning representations by back-propagating errors" in Nature, solving the multi-layer credit assignment problem that broke single-layer perceptrons.',
      historicalImpact: 'Provided the mathematical engine that powers nearly all modern deep learning systems.',
      fullNarrative: 'Paul Werbos and others had described similar gradient back-propagation ideas earlier, notably in Werbos\'s doctoral thesis. But the paper by Rumelhart, Hinton and Williams used clear experiments, such as learning nonlinear hidden representations inside an autoencoder, to show the world that multilayer networks can discover abstract internal features on their own. The dead end Minsky had described was broken.',
      computeCostEstimate: 'VAX-11/780 minicomputer',
      tags: ['Backpropagation', 'Gradient Descent', 'Hidden Representations']
    }
  },
  'm-1989': {
    en: {
      title: 'LeCun\'s LeNet & Convolutional Neural Networks',
      subtitle: 'Weight Sharing and Spatial Invariance in Visual Recognition',
      summary: 'Yann LeCun and colleagues develop backprop-trained CNNs at Bell Labs, successfully reading handwritten zip codes on US mail.',
      historicalImpact: 'Laid the foundational architectural template for modern computer vision.',
      fullNarrative: 'Inspired by Hubel and Wiesel\'s experiments on receptive fields in the cat visual cortex, Yann LeCun combined three core ideas: local connectivity, weight sharing and spatial subsampling (pooling). Together they removed the parameter explosion of fully connected layers and their blindness to spatial translation.',
      computeCostEstimate: 'Dedicated digital signal processor (DSP)',
      tags: ['CNN', 'Computer Vision', 'LeNet']
    }
  },
  'm-1990': {
    en: {
      title: 'Collapse of Lisp Machines & The Second AI Winter',
      subtitle: 'Commercial Brittleness of Rule-Based Systems Exposed',
      summary: 'Specialized Lisp hardware vendors like Symbolics collapsed as commodity PC and Unix workstations overtook their price-performance, exposing the maintenance crisis of millions of brittle rules.',
      historicalImpact: 'Ended the expert systems bubble and forced the field toward empirical statistical learning.',
      fullNarrative: 'The brittleness of expert systems became impossible to ignore. Once a system held thousands of rules, conflicts between them made maintenance extremely hard: the common-sense bottleneck and the knowledge-acquisition bottleneck. On the hardware side, general-purpose Intel x86 chips, riding Moore\'s law, quickly overtook expensive dedicated Lisp machines. The AI market collapsed, and investors once again treated "artificial intelligence" as a pejorative.',
      computeCostEstimate: 'Dedicated parallel inference machines (PIM)',
      tags: ['Fifth Generation Computer', 'Second AI Winter', 'Moore\'s Law']
    }
  },
  'm-1995': {
    en: {
      title: 'Vapnik & Cortes: Support Vector Machines (SVM)',
      subtitle: 'Structural Risk Minimization & The Kernel Trick',
      summary: 'Vladimir Vapnik and Corinna Cortes introduce SVMs. With maximum margin hyperplanes and non-linear kernel projections, SVMs displaced neural networks in academia for 15 years.',
      historicalImpact: 'Established convex optimization and statistical learning theory as standard machine learning dogma.',
      fullNarrative: 'Backed by rigorous VC-dimension theory and a quadratic-programming solution free of local minima, support vector machines dominated the top machine learning conferences from the late 1990s into the early 2000s. Multilayer neural networks, by contrast, were sensitive to hyperparameters, prone to local minima and lacked mathematical elegance, and were pushed to the margins as "alchemy".',
      computeCostEstimate: 'Workstation quadratic-programming solvers',
      tags: ['SVM', 'Kernel Trick', 'Statistical Learning Theory']
    }
  },
  'm-1997': {
    en: {
      title: 'IBM Deep Blue Defeats Garry Kasparov',
      subtitle: 'Brute-Force Alpha-Beta Search Vanquishes Human Champion',
      summary: 'IBM Deep Blue evaluates 200 million chess positions per second using specialized VLSI chips, defeating reigning World Chess Champion Garry Kasparov in a 6-game match.',
      historicalImpact: 'The watershed moment where specialized compute and heuristic search triumphed over human intuition.',
      fullNarrative: 'Deep Blue used 480 custom VLSI chess chips and could evaluate about 200 million positions per second, combining minimax search, alpha-beta pruning and grandmaster opening and endgame databases. It had no general intelligence, but the victory broke a century-old belief that the peak of human intellect could not be reached by a machine.',
      computeCostEstimate: 'IBM RS/6000 SP parallel supercomputer (11.38 GFLOPS)',
      tags: ['Deep Blue', 'Chess', 'Game-Tree Search']
    }
  },
  'm-1997-lstm': {
    en: {
      title: 'Hochreiter & Schmidhuber Invent LSTM',
      subtitle: 'Conquering the Vanishing Gradient Barrier in Recurrent Nets',
      summary: 'Sepp Hochreiter and Jürgen Schmidhuber introduce Long Short-Term Memory, using constant error carrousels and multiplicative gates to bridge long temporal sequences.',
      historicalImpact: 'Became the dominant architecture for speech recognition, translation, and audio for two decades.',
      fullNarrative: 'When a standard RNN backpropagates through time, repeated multiplication makes its gradients vanish or explode exponentially. LSTM added a cell state that carries information forward unchanged, plus learned gates, so the network can control when memory is written, kept and cleared, much like a register in a computer. It became the workhorse of speech recognition and machine translation for the next two decades.',
      computeCostEstimate: 'DEC Alpha processors',
      tags: ['LSTM', 'RNN', 'Sequence Modeling']
    }
  },
  'm-2009': {
    en: {
      title: 'Fei-Fei Li Releases ImageNet Dataset',
      subtitle: 'Shifting AI Priority from Algorithm Design to Massive Data Curation',
      summary: 'Fei-Fei Li and Stanford collaborators release ImageNet with 14 million hand-annotated images, establishing the benchmark that made the 2012 deep learning revolution possible.',
      historicalImpact: 'Proved that algorithms without massive real-world data cannot generalize.',
      fullNarrative: 'While most researchers were refining algorithms, Fei-Fei Li recognised that models failed to learn complex patterns not because the algorithms were weak, but because the training sets were too small. ImageNet made data the turning point among the three pillars of algorithms, data and compute. The ILSVRC challenge, launched in 2010, became the direct trigger of the deep learning explosion.',
      computeCostEstimate: 'Crowdsourced labelling on Amazon Mechanical Turk',
      tags: ['ImageNet', 'Big Data', 'Computer Vision']
    }
  },
  'm-2012': {
    en: {
      title: 'AlexNet Wins ImageNet by Staggering Margin',
      subtitle: 'The Big Bang of Modern Deep Learning & GPU Acceleration',
      summary: 'Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton train an 8-layer deep CNN on dual NVIDIA GTX 580 GPUs, crushing the ImageNet error rate by 10.8 percentage points.',
      historicalImpact: 'Marked the irreversible turning point where deep neural networks with GPU acceleration dominated AI.',
      fullNarrative: 'AlexNet combined ReLU activations, dropout regularisation, data augmentation and hand-written CUDA code that fitted the model into GPU memory. Against carefully hand-engineered features such as SIFT and HOG, end-to-end backpropagation proved far better at extracting features. The result ended the era of classical computer vision, and Google, Facebook and Baidu all pivoted to deep learning.',
      computeCostEstimate: '2 × NVIDIA GeForce GTX 580 (5–6 days of training)',
      tags: ['AlexNet', 'GPU Computing', 'End-to-End Learning']
    }
  },
  'm-2014': {
    en: {
      title: 'Ian Goodfellow Invents Generative Adversarial Networks (GANs)',
      subtitle: 'Minimax Game Between Generator and Discriminator',
      summary: 'Goodfellow frames generative synthesis as a zero-sum game between a counterfeit generator and an adversarial detective, synthesizing photorealistic artificial imagery.',
      historicalImpact: 'Opened the floodgates for generative AI and modern visual synthesis.',
      fullNarrative: 'Yann LeCun called GANs "the most interesting idea in the last ten years in machine learning". A discriminator tries to tell real images from fakes while a generator tries to fool it; the two improve together in a minimax game. This made it possible to sample complex high-dimensional distributions, such as realistic faces, without labels, and opened the era of AI-generated content.',
      computeCostEstimate: 'Single GPU',
      tags: ['GAN', 'Generative Models', 'Game Theory']
    }
  },
  'm-2015': {
    en: {
      title: 'He et al. Introduce ResNet (Deep Residual Learning)',
      subtitle: 'Identity Shortcut Connections Shatter the 100-Layer Ceiling',
      summary: 'Kaiming He and colleagues at Microsoft Research introduce residual skip connections, training 152-layer networks without vanishing gradients and beating human top-5 vision accuracy.',
      historicalImpact: 'Residual skip connections became an indispensable primitive across all modern architectures.',
      fullNarrative: 'Before ResNet, making a network deeper often made it worse: vanishing gradients and degradation meant deep networks were less accurate than shallow ones. Kaiming He and colleagues added identity skip connections, a strikingly simple change that lets gradients flow back to early layers without decaying. The design became the standard skeleton of every very deep model, including the residual stream inside today\'s large language models.',
      computeCostEstimate: '8-GPU cluster',
      tags: ['ResNet', 'Residual Connections', 'Kaiming He']
    }
  },
  'm-2016': {
    en: {
      title: 'DeepMind AlphaGo Defeats World Champion Lee Sedol',
      subtitle: 'Deep Reinforcement Learning & Monte Carlo Tree Search Conquer Go',
      summary: 'AlphaGo combines policy networks, value estimation, and MCTS to defeat 18-time world champion Lee Sedol 4-1 in Seoul, executing move 37 that astonished human grandmasters.',
      historicalImpact: 'Proved that deep reinforcement learning can master complex intuitive games previously thought decades away.',
      fullNarrative: 'Go has roughly 10^170 legal positions, more than the number of atoms in the observable universe, and was widely expected to resist machines for decades. AlphaGo used a policy network to narrow the breadth of search and a value network to estimate the outcome and cut its depth, then surpassed human experience through self-play. In 2017 AlphaGo Zero went further, reaching superhuman strength from scratch without any human game records.',
      computeCostEstimate: '1,920 CPUs + 280 GPUs (distributed version) / TPU v1',
      tags: ['AlphaGo', 'Reinforcement Learning', 'MCTS', 'DeepMind']
    }
  },
  'm-2017': {
    en: {
      title: 'Vaswani et al.: "Attention Is All You Need"',
      subtitle: 'The Universal Transformer Architecture Takes Flight',
      summary: 'Google researchers discard recurrence and convolutions entirely, introducing multi-head self-attention to parallelize sequential compute across entire contexts.',
      historicalImpact: 'The unified architectural bedrock powering all modern LLMs, multi-modal systems, and vision models.',
      fullNarrative: 'The fundamental weakness of RNNs is that they process a sequence step by step, which cannot keep a large GPU cluster busy. The Transformer\'s self-attention lets every token attend directly to every other token in the context in a single step, freeing parallel compute. What followed was a decade-long era of unification in which text, speech, images, video and molecules were all expressed as sequences of tokens.',
      computeCostEstimate: '8 × NVIDIA P100 GPUs (3.5 days of training)',
      tags: ['Transformer', 'Self-Attention', 'Parallel Computing']
    }
  },
  'm-2020': {
    en: {
      title: 'Kaplan et al.: Empirical Scaling Laws for Neural Language Models',
      subtitle: 'Power-Law Predictability in Compute, Parameters, and Data',
      summary: 'Jared Kaplan and OpenAI colleagues demonstrate that cross-entropy loss scales as a smooth power-law over orders of magnitude in compute, parameters, and dataset size.',
      historicalImpact: 'Turned AI engineering from black-magic tinkering into a predictable, capital-intensive science.',
      fullNarrative: 'A protein folds from a one-dimensional chain of amino acids into a complex three-dimensional shape that determines its biological function. AlphaFold 2 tightly coupled multiple sequence alignments with the Evoformer\'s geometric attention, and its database later released predicted structures for about 200 million known proteins, saving researchers years of laboratory work in drug discovery, enzyme engineering and basic biology. In 2024 Demis Hassabis and John Jumper shared the Nobel Prize in Chemistry for this work.',
      computeCostEstimate: '128 TPU v3 cores (weeks of iteration)',
      tags: ['AlphaFold', 'AI for Science', 'Nobel Prize in Chemistry']
    }
  },
  'm-2020-gpt3': {
    en: {
      title: 'OpenAI Releases GPT-3 (175 Billion Parameters)',
      subtitle: 'In-Context Few-Shot Learning Emerges at Massive Scale',
      summary: 'GPT-3 demonstrates that sufficiently scaled autoregressive models can translate, write code, and solve novel tasks purely from natural language prompts without parameter updates.',
      historicalImpact: 'Established prompting and foundation models as the new paradigm of software development.',
      fullNarrative: 'Jared Kaplan and colleagues\' "Scaling Laws for Neural Language Models" gave the bet its compass: loss falls along a smooth, predictable power law as model size, dataset size and compute budget grow. It convinced Silicon Valley and Wall Street that large models were no longer black-box trial and error but a heavy-industry science in which returns on investment could be planned.',
      computeCostEstimate: 'About 3.14 × 10^23 FLOPs (estimated training cost ~US$4.6M)',
      tags: ['GPT-3', 'Scaling Laws', 'Few-Shot Learning']
    }
  },
  'm-2022': {
    en: {
      title: 'OpenAI Launches ChatGPT (The RLHF Phenomenon)',
      subtitle: 'Alignment with Human Intent Sparking Global Adoption',
      summary: 'Combining InstructGPT and Reinforcement Learning from Human Feedback, OpenAI launches ChatGPT, reaching 100 million users in two months—the fastest growing consumer application in history.',
      historicalImpact: 'Brought conversational generative AI into mainstream culture, business, and geopolitics.',
      fullNarrative: 'Base pretrained models hallucinated, rambled and behaved unpredictably. InstructGPT used supervised fine-tuning (SFT) and reinforcement learning from human feedback (RLHF) to align a raw compression model into a modest, well-behaved assistant that follows instructions. ChatGPT set off a worldwide public debate about AI and changed how people write code, write creatively and look up knowledge.',
      computeCostEstimate: 'Microsoft Azure supercomputing clusters (tens of thousands of GPUs)',
      tags: ['ChatGPT', 'RLHF', 'Alignment', 'iPhone Moment']
    }
  },
  'm-2023': {
    en: {
      title: 'OpenAI Releases GPT-4',
      subtitle: 'Multimodal Frontier Intelligence & Near-Human Professional Reasoning',
      summary: 'GPT-4 passes simulated bar exams, USABO, and GRE at the 90th percentile, proving that massive mixture-of-experts architectures exhibit deep cross-domain reasoning.',
      historicalImpact: 'Proved the viability of machine intelligence across high-stakes professional knowledge domains.',
      fullNarrative: 'OpenAI did not disclose GPT-4\'s architecture; it was widely reported to be a sparse Mixture-of-Experts model, with one commonly cited estimate of 16 experts of about 110B parameters each. It accepted images as well as text and handled long contexts of 32k and later 128k tokens. Microsoft Research\'s 154-page paper "Sparks of Artificial General Intelligence" set off a fierce debate over whether AGI was beginning to emerge.',
      computeCostEstimate: 'Estimated ~2.1 × 10^25 FLOPs (~25,000 A100 GPUs)'
    }
  },
  'm-2023-open': {
    en: {
      title: 'Meta Releases LLaMA: The Open-Source Tsunami',
      subtitle: 'Democratizing Frontier Weights to Global Developers and Universities',
      summary: 'Meta releases open-weights LLaMA series, catalyzing an explosion of fine-tunes, quantization techniques (QLoRA, llama.cpp), and independent academic experimentation.',
      historicalImpact: 'Prevented proprietary monopolization and established open-source AI as a perpetual counterweight.',
      fullNarrative: 'A leaked internal Google memo, "We Have No Moat, And Neither Does OpenAI", captured what the industry was seeing: the open-source community was iterating astonishingly fast on quantisation (such as 4-bit GGUF), single-GPU local fine-tuning, retrieval-augmented generation and lightweight architectures. Open weights freed researchers, start-ups and developers from the pricing and policies of any single closed API, and democratised the frontier.',
      computeCostEstimate: 'Meta AI compute clusters',
      tags: ['Open Source', 'LLaMA', 'Edge Computing']
    }
  },
  'm-2024-reasoning': {
    en: {
      title: 'OpenAI o1 & Strawberry: The Second Scaling Law',
      subtitle: 'System 2 Latent Reasoning via Test-Time Compute Search',
      summary: 'OpenAI unveils o1, demonstrating that inference-time search and hidden chain-of-thought verification scale performance on competitive mathematics, coding, and scientific research.',
      computeCostEstimate: 'Large-scale RL post-training cluster + Multi-turn test-time compute search',
      fullNarrative: 'OpenAI o1 marked the fundamental leap from Kahneman’s System 1 (fast, intuitive token generation) to System 2 (deliberate, verifiable chain-of-thought search). By training models with reinforcement learning to generate hidden reasoning traces before answering, researchers discovered an empirical second scaling law: allocating more test-time search tokens yields exponential accuracy gains on complex problems like AIME and competitive software engineering.',
      historicalImpact: 'Overcame the pretraining data plateau by establishing the Test-Time Compute scaling paradigm.',
      tags: ['o1', 'System 2', 'Test-Time Compute', 'Chain-of-Thought']
    }
  },
  'm-2025-r1': {
    en: {
      title: 'DeepSeek-R1 Open-Weights Reasoning Breakthrough',
      subtitle: 'Pure Reinforcement Learning Emergence with Ultra-Efficient Training',
      summary: 'DeepSeek releases R1 trained with large-scale cold-start and pure rule-based RL, matching top proprietary reasoning models while releasing full weights and training methodology openly.',
      computeCostEstimate: 'Ultra-efficient cluster utilizing pure rule-based RL and cold-start checkpoints',
      fullNarrative: 'DeepSeek-R1 demonstrated that sophisticated reasoning behaviors—including self-reflection, backtracking, and algorithmic verification—can emerge autonomously from pure reinforcement learning on rule-verifiable domains (math, code, and formal logic), democratizing frontier reasoning capabilities globally.',
      historicalImpact: 'Proved that algorithmic ingenuity and efficient RL can challenge multi-billion dollar frontier clusters.',
      tags: ['DeepSeek-R1', 'Open Weights', 'Pure RL', 'Self-Reflection']
    }
  },
  'm-2025-agents': {
    en: {
      title: 'Autonomous Multi-Agent Runtime Loops (System-2 Swarms)',
      subtitle: 'From Single Prompts to Goal-Directed Autonomous Software Engineering',
      summary: 'Agents transition from single-turn chatbots to iterative runtime loops with goal compilers, plan graph builders, verification engines, and automated self-healing execution.',
      computeCostEstimate: 'Distributed Agent Runtime Loops + Multi-Turn Tool Environments',
      fullNarrative: 'AI transitioned from passive question-answering chatbots to autonomous agent execution loops. Equipped with goal compilers, plan graphs, verification engines, and automated error-recovery mechanisms, multi-agent swarms execute complex multi-day software engineering and scientific discovery tasks autonomously.',
      historicalImpact: 'Shifted the unit of software work from human keystrokes to autonomous agent supervision.',
      tags: ['Agent Runtime Loop', 'Goal Compiler', 'Plan Graph', 'Verification Engine']
    }
  },
  'm-2026-present': {
    en: {
      title: 'The 2026 Canonical Present: Silicon Singularity Threshold',
      subtitle: 'Neuro-Symbolic Synthesis & Test-Time Search Convergence',
      summary: 'Pretraining, test-time compute, and autonomous execution merge into unified self-improving reasoning fabrics, standing on the threshold of genuine artificial general intelligence.',
      computeCostEstimate: 'Neuro-symbolic synthesis clusters + Formal theorem provers (Lean 4)',
      fullNarrative: 'The contemporary frontier represents the convergence of statistical deep learning and formal symbolic reasoning. Powered by test-time search, automated theorem verification, and self-improving execution environments, artificial systems approach the threshold of recursive general intelligence.',
      historicalImpact: 'The culmination of 80 years of human inquiry into the mathematical nature of mind.',
      tags: ['Singularity Threshold', 'Neuro-Symbolic', 'Formal Verification', 'Self-Improvement']
    }
  }
};

/**
 * Returns an Epoch with localized strings applied for the target language.
 * Falls back to English if target language is not Chinese and no specific translation is found.
 */
export function getLocalizedEpoch(epoch: Epoch, lang: SupportedLanguage): Epoch {
  if (lang === 'zh') return epoch;

  const epochTrans = EPOCH_TRANSLATIONS[epoch.id];
  const targetData = epochTrans?.[lang] || epochTrans?.en;

  if (!targetData) return epoch;

  return {
    ...epoch,
    title: targetData.title || epoch.title,
    subtitle: targetData.subtitle || epoch.subtitle,
    summary: targetData.summary || epoch.summary,
    era: targetData.era || epoch.era.replace('（当前时刻）', '').replace('(当前时刻)', ''),
    computeOrderOfMagnitude: targetData.computeOrderOfMagnitude || epoch.computeOrderOfMagnitude.replace(' + 测试时动态扩展', ' + Dynamic Test-Time Compute'),
    dominantParadigm: (targetData.dominantParadigm as any) || epoch.dominantParadigm,
    philosophicalTension: targetData.philosophicalTension || epoch.philosophicalTension,
    epigraph: {
      ...epoch.epigraph,
      quote: targetData.epigraphQuote || epoch.epigraph.quote,
      author: targetData.epigraphAuthor || epoch.epigraph.author,
    },
    milestones: epoch.milestones.map((m) => getLocalizedMilestone(m, lang))
  };
}

/**
 * Returns a Milestone with localized strings applied for the target language.
 */
export function getLocalizedMilestone(milestone: Milestone, lang: SupportedLanguage): Milestone {
  if (lang === 'zh') return milestone;

  const mTrans = MILESTONE_TRANSLATIONS[milestone.id];
  const targetData = mTrans?.[lang] || mTrans?.en;

  if (!targetData) return milestone;

  return {
    ...milestone,
    title: targetData.title || milestone.title,
    subtitle: targetData.subtitle || milestone.subtitle,
    summary: targetData.summary || milestone.summary,
    computeCostEstimate: targetData.computeCostEstimate || milestone.computeCostEstimate || 'Frontier GPU Cluster / Specialized Compute',
    fullNarrative: targetData.fullNarrative || targetData.summary || milestone.fullNarrative,
    historicalImpact: targetData.historicalImpact || milestone.historicalImpact,
    tags: targetData.tags || milestone.tags.map(t => t.replace('系统二推理', 'System 2').replace('测试时计算', 'Test-Time Compute').replace('思维链', 'CoT').replace('神经符号', 'Neuro-Symbolic')),
  };
}
